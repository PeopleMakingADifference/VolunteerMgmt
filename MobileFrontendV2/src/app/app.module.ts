import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { PushService } from './push.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule],
  providers: [
    ConfigService, UserService, PushService, SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
