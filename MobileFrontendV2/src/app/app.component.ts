import { Component } from '@angular/core';
import {Platform} from '@ionic/angular';
import {UserService} from './user.service';
import {SplashScreen} from '@ionic-native/splash-screen';

import {WelcomePage} from './welcome/welcome.page';
import {HomePage} from './home/home.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  rootPage: unknown;

  constructor(
      platform: Platform,
      userService: UserService,
      splashScreen: typeof SplashScreen
  ) {
    userService.loadUser()
    .then(loadedUser => {
      this.rootPage = (loadedUser) ? HomePage : WelcomePage;
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();
    });
  }
}
