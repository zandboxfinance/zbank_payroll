use candid::{CandidType};
use serde::Deserialize;
use crate::enums::{network::Network, routine_type::RoutineType, currency::Currency, charge_fees_from::ChargeFeesFrom};

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ScheduledTransactionRequest { 
    pub to_address : String
    , pub routine_type : RoutineType
    , pub network : Network
    , pub currency : Currency
    , pub amount : f64
    , pub charge_fees_from : ChargeFeesFrom
}
