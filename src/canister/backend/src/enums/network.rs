
use candid::{self, CandidType, Deserialize};


#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Network {
    BTC,
    ETH,
    TRON,
    POLYGON,
    SOLANA,
}
