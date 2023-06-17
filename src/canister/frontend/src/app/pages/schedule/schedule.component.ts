import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UtilService } from 'src/utils/util.service';
import { ColumnItem, Data } from 'src/common/interface/interface';
import { IcService } from 'src/app/ic.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit {
  constructor(
    private notification: NzNotificationService,
    private utilService: UtilService,
    private icService:IcService
    ) { }
  /*Table*/
  checked = false;

  isLoadingForDelete = false;

  isLoadingForCreate = false;

  isLoadingForRefresh = false;

  indeterminate = false;

  listOfData: readonly Data[] = [];

  listOfCurrentPageData: readonly Data[] = [];

  setOfCheckedId = new Set<string>();

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

  /* Drawer*/
  valueStyle = {
    "font-weight": 500,
    "font-size": "16px",
    "overflow": "auto"
  }
  visibleDrawer = false

  estimateFee = 0;

  userInput = {
    to_address: "",
    amount: 0,
    routine_type: "",
    network: "",
    currency: "",
    charge_fees_from: ""
  }

  ngOnInit(): void {
    this.getTableData();
  }
  getTableData() {
    this.get_scheduled_transaction();
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
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onCurrentPageDataChange(listOfCurrentPageData: readonly Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }
  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  onDelete(): void {
    this.isLoadingForDelete = true;
    //const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    //console.log(requestData);
    console.log(this.setOfCheckedId);
    for(var id of this.setOfCheckedId){
      this.delete_scheduled_transaction(id);
    }
    setTimeout(() => {
      //After APi response
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.getTableData();
      this.isLoadingForDelete = false;
    }, 1500);
  }
  openDrawer(): void {
    this.visibleDrawer = true;
  }
  closeDrawer(): void {
    this.visibleDrawer = false;
    this.resetValue();
  }
  caculateFinalAmount() {
    return this.userInput.amount - this.estimateFee;
  }
  isAnyInputEmpty() {
    return Object.values(this.userInput).some(x => x === null || x === '');
  }
  resetValue(): void {
    this.userInput = {
      to_address: "",
      routine_type: "",
      network: "",
      currency: "",
      amount: 0,
      charge_fees_from: ""
    }
  }
  onCreate(): void {
    //check require iuput
    if (this.isAnyInputEmpty()) {
      this.utilService.createNotification('warning', 'Please filled in the blanks.')
      // this.createNotification('warning', 'Please filled in the blanks.')
    } else {
      this.isLoadingForCreate = true;
      this.add_scheduled_transaction(
        this.userInput.to_address
        , this.userInput.routine_type
        , this.userInput.network
        , this.userInput.currency
        , this.userInput.amount
        , this.userInput.charge_fees_from);
      setTimeout(() => {
        //After APi response
        this.getTableData();
        this.isLoadingForCreate = false;
        // clear user input data after API call
        this.resetValue();
        this.closeDrawer();
      }, 1500);
    }
  }
  async get_scheduled_transaction(){
    try{
      this.isLoadingForRefresh = true;
      let tmpListOfData = new Array();
      const f = await this.icService.get_scheduled_transaction();
      f.forEach( (element: any) => {
        var date = new Date(Number(element.create_date[0])/1000000).toISOString();
        let tmpData = {id: element.id, routine_type: Object.keys(element.routine_type[0])[0], network: Object.keys(element.network[0])[0], to_address: element.to_address, create_date: date, currency:  Object.keys(element.currency[0])[0], amount: element.amount, charge_fees_from: Object.keys(element.charge_fees_from[0])[0]};
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
  async add_scheduled_transaction(to_address:string, routine_type:string, network:string, currency:string, amount:number, charge_fees_from:string){
    try{
      await this.icService.add_scheduled_transaction(to_address, routine_type, network, currency, amount, charge_fees_from);
    }
    catch(err){
      console.log(err);
    }
  }
  async delete_scheduled_transaction(id:string){
    try{
      await this.icService.delete_scheduled_transaction(id);
    }
    catch(err){
      console.log(err);
    }
  }
}
