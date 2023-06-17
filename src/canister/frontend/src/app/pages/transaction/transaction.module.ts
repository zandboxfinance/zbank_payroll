import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { IcService } from 'src/app/ic.service';
import { FormsModule } from '@angular/forms';
import { UtilService } from 'src/utils/util.service';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [TransactionComponent],
  imports: [
    CommonModule, 
    TransactionRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzDividerModule,
    NzNotificationModule,
    FormsModule,
    NzTagModule
  ],
  exports: [TransactionComponent],
  providers:[IcService, UtilService]
})
export class TransactionModule { }
