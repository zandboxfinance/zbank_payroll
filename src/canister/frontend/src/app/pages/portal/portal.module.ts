import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IconsProviderModule } from 'src/app/icons-provider.module';



@NgModule({
  imports: [
    CommonModule, 
    PortalRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    IconsProviderModule
  ],
  declarations: [PortalComponent],
  exports: [PortalComponent]
})
export class PortalModule { }
