
use candid::{self, CandidType, Deserialize};

#[derive(Clone, Debug, CandidType, Deserialize, PartialEq, Eq)]
pub enum ReviewedStatus {
    APPROVED,
    REJECTED,
}
