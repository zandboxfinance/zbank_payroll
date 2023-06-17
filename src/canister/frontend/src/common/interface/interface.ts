import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface Data {
  id: string;
  to_address: string;
  routine_type: string;
  currency: string;
  network: string;
  amount: number
  charge_fees_from: string;
  submittedBy: string;
  disabled: boolean;
  create_date: string;
}

export interface TransactionData {
  id: number;
  to_address: string;
  routine_type: string;
  currency: string;
  network: string;
  amount: number
  charge_fees_from: string;
  submittedBy: string;
  disabled: boolean;
  reviewed_status: string;
  reviewed_date: string;
}

export interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Data> | null;
  sortDirections: NzTableSortOrder[];
}

export interface TransactionColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<TransactionData> | null;
  sortDirections: NzTableSortOrder[];
}