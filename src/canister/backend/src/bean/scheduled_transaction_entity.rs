use candid::{CandidType};
use serde::Deserialize;
use crate::enums::{network::Network, routine_type::RoutineType, currency::Currency, charge_fees_from::ChargeFeesFrom};

#[derive(Clone, Debug, CandidType, Deserialize, Default)]
pub struct ScheduledTransactionEntity { 
    pub id : String
    , pub to_address : Option<String>
    , pub routine_type : Option<RoutineType>
    , pub network : Option<Network>
    , pub currency : Option<Currency>
    , pub amount : Option<f64>
    , pub charge_fees_from : Option<ChargeFeesFrom>
    , pub create_date : Option<u64>
}