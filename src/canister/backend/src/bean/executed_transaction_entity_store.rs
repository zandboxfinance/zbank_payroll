
use candid::CandidType;
use serde::Deserialize;

use super::executed_transaction_entity::ExecutedTransactionEntity;

#[derive(Clone, Debug, CandidType, Deserialize, Default)]
pub struct ExecutedTransactionEntityStore{pub data : Vec<ExecutedTransactionEntity>}

impl ExecutedTransactionEntityStore{
    pub fn get(&self) -> &Vec<ExecutedTransactionEntity> {
        &self.data
    }
    pub fn add(&mut self, value: ExecutedTransactionEntity) {
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