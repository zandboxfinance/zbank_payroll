use ic_cdk_timers::TimerId;

#[derive(Clone, Debug, Default)]
pub struct ScheduledTransactionTimerEntity { 
    pub id : String
    , pub timer_id : TimerId
}