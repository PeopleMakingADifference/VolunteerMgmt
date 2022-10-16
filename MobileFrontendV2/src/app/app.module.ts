import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {SafariViewController} from '@ionic-native/safari-view-controller';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ConfigService} from './config.service';
import {UserService} from './user.service';
import {PushService} from './push.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    ConfigService, UserService, PushService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
