import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { ColumnItem, Data } from 'src/common/interface/interface';
import { UtilService } from 'src/utils/util.service';
import { IcService } from 'src/app/ic.service';
import { IcBitcoinService } from 'src/app/ic.bitcoin.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent {
  constructor(
    private notification: NzNotificationService,
    private utilService: UtilService,
    private icService:IcService,
    private icBitcoinService: IcBitcoinService
    ) { }
  /*Table*/
  checked = false;

  loading = false;

  isLoadingForRefresh = false;

  indeterminate = false;

  listOfData: readonly Data[] = [];

  listOfCurrentPageData: readonly Data[] = [];

  setOfCheckedId = new Set<number>();

  listOfColumns: ColumnItem[] = [
    {
      name: 'Receiver',
      sortOrder: null,
      sortFn: (a: Data, b: Data) => a.to_address.localeCompare(b.to_address),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Periodic',
      sortOrder: null,
      sortFn: (a: Data, b: Data) => a.routine_type.localeCompare(b.routine_type),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Currency',
      sortOrder: null,
      sortFn: (a: Data, b: Data) => a.currency.localeCompare(b.currency),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'amount',
      sortOrder: null,
      sortFn: (a: Data, b: Data) => a.amount - b.amount,
      sortDirections: []
    },
    {
      name: 'Charge From',
      sortOrder: null,
      sortFn: (a: Data, b: Data) => a.charge_fees_from.localeCompare(b.charge_fees_from),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Submitted By',
      sortOrder: null,
      sortFn: (a: Data, b: Data) => a.submittedBy.localeCompare(b.submittedBy),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Create Time',
      sortOrder: "1",
      sortFn: (a: Data, b: Data) => a.create_date.localeCompare(b.create_date),
      sortDirections: ['ascend', 'descend', null]
    }
  ];

  ngOnInit(): void {
    this.getTableData();
  }
  async getTableData() {
    this.isLoadingForRefresh = true;
    await this.get_pending_transaction();
    this.isLoadingForRefresh = false;
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
    //   create_date: '2022-02-03',
    //   disabled: false
    // }));
  }

  cancel(): void {
    console.log('cancel!');
    // this.utilService.createNotification(,'');
  }

  async approve(id:string) {
    const pending_transaction_detail = await this.icService.get_pending_transaction_detail(id);
    if(Object.keys(pending_transaction_detail.network[0])[0] == "BTC" && Object.keys(pending_transaction_detail.currency[0])[0] == "BTC"){
      this.isLoadingForRefresh = true;
      console.log('confirm');
      console.log('id: '+ id);
      //TODO call approve API
      await this.icBitcoinService.send(pending_transaction_detail.to_address[0], pending_transaction_detail.amount);
      await this.review_pending_transaction(id, 'APPROVED');
      // this.utilService.createNotification(,'');
      this.get_pending_transaction();
      this.isLoadingForRefresh = false;
    }
    console.log("Network and Currency are not supported, Network %s Currency %s.", Object.keys(pending_transaction_detail.network[0])[0], Object.keys(pending_transaction_detail.currency[0])[0]);
  }
  async reject(id:string) {
    this.isLoadingForRefresh = true;
    console.log('reject');
    console.log('id: '+ id);
    await this.review_pending_transaction(id, 'REJECTED');
    // this.utilService.createNotification(,'');
    this.get_pending_transaction();
    this.isLoadingForRefresh = false;
  }
 
  // beforeConfirm(): Observable<boolean> {
  //   return new Observable(observer => {
  //     setTimeout(() => {
  //       observer.next(true);
  //       observer.complete();
  //     }, 3000);
  //   });
  // }

  async review_pending_transaction(id: string, reviewed_status: string){
    try{
      await this.icService.review_pending_transaction(id, reviewed_status);
    }
    catch(err){
      console.log(err);
    }
  }
  async get_pending_transaction(){
    try{
      let tmpListOfData = new Array();
      const f = await this.icService.get_pending_transaction();
      f.forEach( (element: any) => {
        var date = new Date(Number(element.payment_date[0])/1000000).toISOString();
        let tmpData = {id: element.id, routine_type: Object.keys(element.routine_type[0])[0], network: Object.keys(element.network[0])[0], to_address: element.to_address, create_date: date, currency:  Object.keys(element.currency[0])[0], amount: element.amount, charge_fees_from: Object.keys(element.charge_fees_from[0])[0]};
        tmpListOfData.push(tmpData);
      });
      this.listOfData = tmpListOfData;
      console.log(f);
    }
    catch(err){
      console.log(err);
    }
  }

}
