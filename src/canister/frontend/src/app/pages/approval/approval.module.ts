import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalRoutingModule } from './approval-routing.module';
import { ApprovalComponent } from './approval.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { IcService } from 'src/app/ic.service';
import { FormsModule } from '@angular/forms';
import { UtilService } from 'src/utils/util.service';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@NgModule({
  imports: [
    CommonModule,
    ApprovalRoutingModule,
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule,
    NzNotificationModule,
    FormsModule,
    NzPopconfirmModule
  ],
  declarations: [ApprovalComponent],
  exports: [ApprovalComponent],
  providers: [IcService, UtilService]
})
export class ApprovalModule { }
