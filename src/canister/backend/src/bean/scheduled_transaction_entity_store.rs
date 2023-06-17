

use candid::{CandidType, Principal};
use serde::Deserialize;

use super::scheduled_transaction_entity::ScheduledTransactionEntity;

#[derive(Clone, Debug, Default)]
pub struct ScheduledTransactionEntityStore{
    pub data : Vec<ScheduledTransactionEntity>,
}

impl ScheduledTransactionEntityStore{
    pub fn get(&self) -> &Vec<ScheduledTransactionEntity> {
        &self.data
    }
    pub fn add(&mut self, value: ScheduledTransactionEntity) {
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