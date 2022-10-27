import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckOutRemindedPage } from './check-out-reminded.page';

const routes: Routes = [
  {
    path: '',
    component: CheckOutRemindedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckOutRemindedPageRoutingModule {}
