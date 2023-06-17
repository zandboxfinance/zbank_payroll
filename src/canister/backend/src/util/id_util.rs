use rand::{SeedableRng, Rng};
// use rand::{distributions::Alphanumeric, Rng};

use rand::rngs::StdRng;

pub fn get_random_id() -> String {
    let now_millis = ic_cdk::api::time();
    let mut seed = [0u8; 32];
    seed[..8].copy_from_slice(&now_millis.to_be_bytes());
    seed[8..16].copy_from_slice(&now_millis.to_be_bytes());
    seed[16..24].copy_from_slice(&now_millis.to_be_bytes());
    seed[24..32].copy_from_slice(&now_millis.to_be_bytes());
    let mut seeded_rng = StdRng::from_seed(seed);
    seeded_rng.gen_range(0, 999999999).to_string()
}
