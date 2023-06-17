
use candid::{self, CandidType, Deserialize};


#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum ChargeFeesFrom {
    SENDER,
    RECEIVER,
    SHARED,
}
