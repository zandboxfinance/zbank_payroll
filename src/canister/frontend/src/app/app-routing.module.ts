import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from './../environments/environment';

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/portal' },
  // { path: 'portal', loadChildren: () => import('./pages/portal/portal.module').then(m => m.PortalModule) },
  { path: '', pathMatch: 'full', redirectTo: '/schedule?canisterId=' + environment.frontendCanisterId },
  { path: 'schedule', loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.ScheduleModule) },
  { path: 'approval', loadChildren: () => import('./pages/approval/approval.module').then(m => m.ApprovalModule) },
  { path: 'transaction', loadChildren: () => import('./pages/transaction/transaction.module').then(m => m.TransactionModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
