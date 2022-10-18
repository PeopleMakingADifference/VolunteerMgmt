import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckInTwoPage } from './check-in-two.page';

const routes: Routes = [
  {
    path: '',
    component: CheckInTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckInTwoPageRoutingModule {}
