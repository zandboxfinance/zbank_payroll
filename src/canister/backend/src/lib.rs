mod bean;
mod enums;
mod util;
use enums::{routine_type::RoutineType, network::Network};
use ic_cdk::api::{call::ManualReply, time};
use ic_cdk_timers::TimerId;
use crate::bean::scheduled_transaction_entity::ScheduledTransactionEntity;
use crate::bean::scheduled_transaction_request::ScheduledTransactionRequest;
use crate::bean::scheduled_transaction_entity_store::ScheduledTransactionEntityStore;
use crate::bean::pending_transaction_entity_store::PendingTransactionEntityStore;
use crate::bean::pending_transaction_entity::PendingTransactionEntity;
use crate::bean::executed_transaction_entity_store::ExecutedTransactionEntityStore;
use crate::bean::executed_transaction_entity::ExecutedTransactionEntity;
use crate::bean::scheduled_transaction_timer_entity::ScheduledTransactionTimerEntity;
use crate::bean::wallet_response::WalletResponse;
use crate::enums::reviewed_status::ReviewedStatus;
use candid::{candid_method};
use ic_cdk_macros::{query, update, pre_upgrade, post_upgrade, init};
use std::{cell::RefCell, time::{SystemTime, Duration}};
use crate::util::id_util;

thread_local! {
    static SCHEDULED_TRANSACTION_ENTITY_STORE: RefCell<ScheduledTransactionEntityStore> = RefCell::new(ScheduledTransactionEntityStore::default());
    static PENDING_TRANSACTION_ENTITY_STORE: RefCell<PendingTransactionEntityStore> = RefCell::new(PendingTransactionEntityStore::default());
    static EXECUTED_TRANSACTION_ENTITY_STORE: RefCell<ExecutedTransactionEntityStore> = RefCell::new(ExecutedTransactionEntityStore::default());
    static TIMERS: RefCell<Vec<ScheduledTransactionTimerEntity>> = RefCell::new(Vec::new());
}

// ==============================================
// Backup
// ==============================================
// #[pre_upgrade]
// fn pre_upgrade(){
//     let scheduled_transaction_entity_store: ScheduledTransactionEntityStore = SCHEDULED_TRANSACTION_ENTITY_STORE.with(|s|s.take().unwrap());
//     ic_cdk::storage::stable_save((scheduled_transaction_entity_store,))
//         .expect("failed to save stable state");
// }

// #[post_upgrade]
// fn post_upgrade(){
//     let (scheduled_transaction_entity_store,): (ScheduledTransactionEntityStore,) =  
//         ic_cdk::storage::stable_restore().expect("failed to restore stable state");
//     SCHEDULED_TRANSACTION_ENTITY_STORE.with(|s| *s.borrow_mut() = scheduled_transaction_entity_store);
// }

#[ic_cdk::query]
async fn greet(name: String) -> String {
    format!("Hello, {}! {}", name, ic_cdk::caller())
}

// ==============================================
// Schedule Page
// ==============================================
#[candid_method(query)]
#[query(manual_reply = false)]
async fn get_scheduled_transaction() -> Vec<ScheduledTransactionEntity> {
    //gateway_checker::check_caller();
    SCHEDULED_TRANSACTION_ENTITY_STORE.with(|scheduled_transaction_entity_store|scheduled_transaction_entity_store.borrow().get().clone())
}
#[candid_method(query)]
#[query(manual_reply = false)]
async fn get_scheduled_transaction_detail(id: String) -> ScheduledTransactionEntity {
    SCHEDULED_TRANSACTION_ENTITY_STORE.with(|scheduled_transaction_entity_store|scheduled_transaction_entity_store.borrow().get().iter().find(|x| *x.id == id).unwrap().clone())
}
#[candid_method(update)]
#[update]
async fn add_scheduled_transaction(value: ScheduledTransactionRequest) {
    let schedule_id = id_util::get_random_id();
    let value_ = ScheduledTransactionEntity {id: schedule_id.clone()
        , to_address: Some(value.to_address.clone())
        , routine_type: Some(value.routine_type.clone())
        , network: Some(value.network.clone())
        , currency: Some(value.currency.clone())
        , amount: Some(value.amount.clone())
        , charge_fees_from: Some(value.charge_fees_from.clone())
        , create_date: Some(time())};
    SCHEDULED_TRANSACTION_ENTITY_STORE.with(|scheduled_transaction_entity_store| scheduled_transaction_entity_store.borrow_mut().add(value_));
    let timer = ScheduledTransactionTimerEntity {id: schedule_id, timer_id: start_with_interval_secs(value)};
    TIMERS.with(|timers| timers.borrow_mut().push(timer));
}
#[candid_method(update)]
#[update]
async fn delete_scheduled_transaction(id: String) {
    TIMERS.with(|timers|{
        let timer_id = timers.borrow_mut().iter().find(|x| *x.id == id).unwrap().timer_id;
        ic_cdk::println!("Timer canister: Stopping timer ID {timer_id:?}...");
        ic_cdk_timers::clear_timer(timer_id);
        let index = timers.borrow().iter().position(|x| *x.id == id).unwrap();
        timers.borrow_mut().remove(index);
    });
    SCHEDULED_TRANSACTION_ENTITY_STORE.with(|scheduled_transaction_entity_store| scheduled_transaction_entity_store.borrow_mut().delete(id));
}
#[candid_method(update)]
#[update]
async fn clear_scheduled_transaction() {
    TIMERS.with(|timers|{
        for timer in timers.borrow_mut().drain(..)  {
            let timer_id = timer.timer_id;
            ic_cdk::println!("Timer canister: Stopping timer ID {timer_id:?}...");
            ic_cdk_timers::clear_timer(timer_id);
        }
    });
    SCHEDULED_TRANSACTION_ENTITY_STORE.with(|scheduled_transaction_entity_store| scheduled_transaction_entity_store.borrow_mut().clear());
}

// ==============================================
// Approval Page
// ==============================================
#[candid_method(query)]
#[query(manual_reply = true)]
async fn get_pending_transaction() -> ManualReply<Vec<PendingTransactionEntity>> {
    PENDING_TRANSACTION_ENTITY_STORE.with(|pending_transaction_entity_store| ManualReply::one(pending_transaction_entity_store.borrow().get()))
}
#[candid_method(query)]
#[query(manual_reply = true)]
async fn get_pending_transaction_detail(id: String) -> ManualReply<PendingTransactionEntity> {
    PENDING_TRANSACTION_ENTITY_STORE.with(|pending_transaction_entity_store| ManualReply::one(pending_transaction_entity_store.borrow().get().iter().find(|x| *x.id == id).unwrap()))
}
#[candid_method(update)]
#[update]
async fn review_pending_transaction(id: String, reviewed_status: ReviewedStatus) {
    let pending_transaction_entity = PENDING_TRANSACTION_ENTITY_STORE.with(|pending_transaction_entity_store| pending_transaction_entity_store.borrow().get_by_id(id.clone()).clone());
    let executed_transaction_entity = ExecutedTransactionEntity {id: id_util::get_random_id()
        , to_address: pending_transaction_entity.to_address
        , routine_type: pending_transaction_entity.routine_type
        , network: pending_transaction_entity.network
        , currency: pending_transaction_entity.currency
        , amount: pending_transaction_entity.amount
        , charge_fees_from: pending_transaction_entity.charge_fees_from
        , payment_date: pending_transaction_entity.payment_date
        , reviewed_status: Some(reviewed_status.clone())
        , reviewed_date: Some(time())};
    EXECUTED_TRANSACTION_ENTITY_STORE.with(|executed_transaction_entity_store| executed_transaction_entity_store.borrow_mut().add(executed_transaction_entity));
    PENDING_TRANSACTION_ENTITY_STORE.with(|pending_transaction_entity_store| pending_transaction_entity_store.borrow_mut().delete(id));
}

fn start_with_interval_secs(value: ScheduledTransactionRequest) -> TimerId {
    let secs = Duration::from_secs(map_routine_type_to_seconds(value.routine_type.clone()));
    ic_cdk::println!("Timer canister: Starting a new timer with {secs:?} interval...");
    let timer_id = ic_cdk_timers::set_timer_interval(secs,  move ||periodic_task(value.clone()));
    timer_id
    //async
    //let timer_id = ic_cdk_timers::set_timer_interval(secs, || ic_cdk::spawn(periodic_task()));
}

fn map_routine_type_to_seconds(value: RoutineType) -> u64 {
    match value{
        RoutineType::MONTHLY => 4*7*24*60*60,
        RoutineType::BIWEEKLY => 2*7*24*60*60,
        RoutineType::WEEKLY=> 7*24*60*60,
        RoutineType::DAILY => 24*60*60,
        RoutineType::MINUTE => 60,
    }
}

fn periodic_task(value: ScheduledTransactionRequest) {
    ic_cdk::println!("Timer canister: insert pending transaction");
    let pending_id = id_util::get_random_id();
    let value_ = PendingTransactionEntity {id: pending_id.clone()
        , to_address: Some(value.to_address)
        , routine_type: Some(value.routine_type)
        , network: Some(value.network)
        , currency: Some(value.currency)
        , amount: Some(value.amount)
        , charge_fees_from: Some(value.charge_fees_from)
        , payment_date: Some(time())};
    PENDING_TRANSACTION_ENTITY_STORE.with(|pending_transaction_entity_store| pending_transaction_entity_store.borrow_mut().add(value_));
}

// ==============================================
// Transaction View Page
// ==============================================
#[candid_method(query)]
#[query(manual_reply = true)]
async fn get_executed_transaction() -> ManualReply<Vec<ExecutedTransactionEntity>> {
    EXECUTED_TRANSACTION_ENTITY_STORE.with(|executed_transaction_entity_store| ManualReply::one(executed_transaction_entity_store.borrow().get()))
}

// ==============================================
// Main Page
// ==============================================
#[candid_method(query)]
#[query(manual_reply = false)]
async fn get_wallet() -> Vec<WalletResponse> {
    let mut wallet_list: Vec<WalletResponse> = Vec::new();
    let mut wallet_response = WalletResponse::default();
    wallet_response.network = Some(Network::BTC);
    wallet_response.wallet_address = Some("bdfyggdfhtgdhgdfh".to_string());
    wallet_list.push(wallet_response);
    wallet_list
}
