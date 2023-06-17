
use candid::CandidType;
use serde::Deserialize;

use super::pending_transaction_entity::PendingTransactionEntity;

#[derive(Clone, Debug, CandidType, Deserialize, Default)]
pub struct PendingTransactionEntityStore{pub data : Vec<PendingTransactionEntity>}

impl PendingTransactionEntityStore{
    pub fn get(&self) -> &Vec<PendingTransactionEntity> {
        &self.data
    }
    pub fn get_by_id(&self, id: String) -> &PendingTransactionEntity {
        &self.data.iter().find(|&x| x.id == id).unwrap()
    }
    pub fn add(&mut self, value: PendingTransactionEntity) {
        self.data.push(value);
    }
    pub fn delete(&mut self, id: String) {
        let index = self.data.iter().position(|x| *x.id == id).unwrap();
        self.data.remove(index);
    }
    pub fn clear(&mut self) {
        self.data.clear();
    }
}