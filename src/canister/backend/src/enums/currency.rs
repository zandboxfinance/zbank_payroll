
use candid::{self, CandidType, Deserialize};


#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Currency {
    USDT,
    USDC,
    BTC,
    ETH,
    TRON,
}
