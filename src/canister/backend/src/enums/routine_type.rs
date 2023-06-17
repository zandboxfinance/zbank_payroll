
use candid::{self, CandidType, Deserialize};


#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum RoutineType {
    MONTHLY,
    BIWEEKLY,
    WEEKLY,
    DAILY,
    MINUTE,
}
