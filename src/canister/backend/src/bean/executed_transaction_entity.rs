use candid::{CandidType};
use serde::Deserialize;
use crate::enums::{network::Network, routine_type::RoutineType, currency::Currency, reviewed_status::ReviewedStatus, charge_fees_from::ChargeFeesFrom};

#[derive(Clone, Debug, CandidType, Deserialize, Default)]
pub struct ExecutedTransactionEntity { 
    pub id : String
    , pub to_address : Option<String>
    , pub routine_type : Option<RoutineType>
    , pub network : Option<Network>
    , pub currency : Option<Currency>
    , pub amount : Option<f64>
    , pub charge_fees_from : Option<ChargeFeesFrom>
    , pub payment_date : Option<u64>
    , pub reviewed_status : Option<ReviewedStatus>
    , pub reviewed_date : Option<u64>
}


