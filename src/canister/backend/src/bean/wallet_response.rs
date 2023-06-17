use candid::{Nat, CandidType};
use serde::Deserialize;
use crate::enums::{network::Network, routine_type::RoutineType, currency::Currency, charge_fees_from::ChargeFeesFrom};

#[derive(Clone, Debug, CandidType, Deserialize, Default)]
pub struct WalletResponse { 
    pub network : Option<Network>
    , pub wallet_address : Option<String>
}
