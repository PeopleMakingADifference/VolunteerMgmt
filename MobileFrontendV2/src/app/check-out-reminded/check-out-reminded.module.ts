import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckOutRemindedPageRoutingModule } from './check-out-reminded-routing.module';

import { CheckOutRemindedPage } from './check-out-reminded.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckOutRemindedPageRoutingModule
  ],
  declarations: [CheckOutRemindedPage]
})
export class CheckOutRemindedPageModule {}
