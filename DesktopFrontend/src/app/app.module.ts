import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CreateEventComponent } from '../pages/createevent/createevent.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { LoginComponent } from '../pages/login/login.component';
import { AddVolunteerComponent } from '../pages/addvolunteer/addvolunteer.component';
import { VolunteerTimePipe } from './volunteer-time.pipe';
import { VolunteerDurationPipe } from './volunteer-duration.pipe';
import { VolunteerFilterCheckoutPipe } from './volunteer-filter-checkout.pipe';
import { VolunteerSortPipe } from './volunteer-sort.pipe';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

import { CookieModule } from 'ngx-cookie';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
  { path: 'create-event', component: CreateEventComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-volunteer/:bowlID', component: AddVolunteerComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AppComponent,
    CreateEventComponent,
    DashboardComponent,
    LoginComponent,
    VolunteerTimePipe,
    VolunteerDurationPipe,
    VolunteerFilterCheckoutPipe,
    VolunteerSortPipe,
    AddVolunteerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    CookieModule.forRoot(),
    AngularFireAuthModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
