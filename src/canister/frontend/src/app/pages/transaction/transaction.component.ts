import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TransactionColumnItem, TransactionData } from 'src/common/interface/interface';
import { UtilService } from 'src/utils/util.service';
import { IcService } from 'src/app/ic.service';
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent {
  constructor(
    private utilService: UtilService,
    private notification: NzNotificationService,
    private icService:IcService
  ) { }
  /*Table*/
  checked = false;

  loading = false;

  isLoadingForRefresh = false;
  
  indeterminate = false;

  listOfData: readonly TransactionData[] = [];

  listOfCurrentPageData: readonly TransactionData[] = [];

  setOfCheckedId = new Set<number>();

  listOfColumns: TransactionColumnItem[] = [
    {
      name: 'Receiver',
      sortOrder: null,
      sortFn: (a: TransactionData, b: TransactionData) => a.to_address.localeCompare(b.to_address),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Periodic',
      sortOrder: null,
      sortFn: (a: TransactionData, b: TransactionData) => a.routine_type.localeCompare(b.routine_type),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Currency',
      sortOrder: null,
      sortFn: (a: TransactionData, b: TransactionData) => a.currency.localeCompare(b.currency),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'amount',
      sortOrder: null,
      sortFn: (a: TransactionData, b: TransactionData) => a.amount - b.amount,
      sortDirections: []
    },
    {
      name: 'Charge From',
      sortOrder: null,
      sortFn: (a: TransactionData, b: TransactionData) => a.charge_fees_from.localeCompare(b.charge_fees_from),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Submitted By',
      sortOrder: null,
      sortFn: (a: TransactionData, b: TransactionData) => a.submittedBy.localeCompare(b.submittedBy),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Status',
      sortOrder: null,
      sortFn: (a: TransactionData, b: TransactionData) => a.reviewed_status.localeCompare(b.reviewed_status),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Review Date',
      sortOrder: "1",
      sortFn: (a: TransactionData, b: TransactionData) => a.reviewed_date.localeCompare(b.reviewed_date),
      sortDirections: ['ascend', 'descend', null]
    }
  ];
  ngOnInit(): void {
    this.getTableData();
  }
  getTableData() {
    this.get_executed_transaction();
    //TODO call APi to get table data
    // Mock data for listOfData
    // this.listOfData = new Array(100).fill(0).map((_, index) => ({
    //   id: index,
    //   to_address: `@bank_user ${index}`,
    //   routine_type: index % 3 ? 'Monthly' : 'Daily',
    //   currency: 'BTC',
    //   network: 'BitCoin',
    //   amount: (Math.random()),
    //   charge_fees_from: index % 2 ? 'Sender' : 'Shared',
    //   submittedBy: `@hr ${index}`,
    //   reviewed_date: '2022-02-03',
    //   disabled: false,
    //   reviewed_status: index % 2 ? 'APPROVED' : 'REJECTED',
    // }));
  }

  async get_executed_transaction(){
    try{
      this.isLoadingForRefresh = true;
      let tmpListOfData = new Array();
      const f = await this.icService.get_executed_transaction();
      f.forEach( (element: any) => {
        var payment_date = new Date(Number(element.payment_date[0])/1000000).toISOString();
        var reviewed_date = new Date(Number(element.reviewed_date[0])/1000000).toISOString();
        let tmpData = {id: element.id, routine_type: Object.keys(element.routine_type[0])[0], network: Object.keys(element.network[0])[0], to_address: element.to_address, currency:  Object.keys(element.currency[0])[0], amount: element.amount, charge_fees_from: Object.keys(element.charge_fees_from[0])[0], payment_date: payment_date, reviewed_status: Object.keys(element.reviewed_status[0])[0], reviewed_date: reviewed_date};
        tmpListOfData.push(tmpData);
      });
      this.listOfData = tmpListOfData;
      this.isLoadingForRefresh = false;
      console.log(f);
    }
    catch(err){
      console.log(err);
    }
  }
}
