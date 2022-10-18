import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckInTwoPageRoutingModule } from './check-in-two-routing.module';

import { CheckInTwoPage } from './check-in-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckInTwoPageRoutingModule
  ],
  declarations: [CheckInTwoPage]
})
export class CheckInTwoPageModule {}
