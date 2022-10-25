import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from './user.service';
import { Router } from '@angular/router';

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
      router: Router
  ) {
    userService.loadUser()
    .then((loadedUser) => {
      this.rootPage = (loadedUser) ? '/home' : '/welcome';
      router.navigate([this.rootPage]);
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
  }
}
