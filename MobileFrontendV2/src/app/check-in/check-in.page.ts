import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';

import { ConfigService } from '../../app/config.service';
import { User, UserService } from '../../app/user.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
})
export class CheckInPage implements OnInit {
  eventId: string;
  phoneNum: number;
  errorMessage = '';

  constructor(
      public router: Router,
      public configService: ConfigService,
      public userService: UserService,
      public loadingCtrl: LoadingController,
      public androidPermissions: AndroidPermissions,
      public platform: Platform,
      private iab: InAppBrowser,
      private svc: SafariViewController
      ) {}

   ngOnInit(): void {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
        .then(
          success => {
            console.log('Sms read permission granted');
            this.userService.watchForVerificationText();
          },
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
        );
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
      }
    });
  }

  isDebugUser(phone: number): boolean {
    // putting a healthy dose of test accounts here _just in case_
    return String(phone) in {
      1234567890: true,
      9987654321: true,
      9999999999: true,
      8888888888: true,
      7777777777: true,
      6666666666: true,
      5555555555: true
    };
  }

  checkLogin(phone: number, eventId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // clear the error message, if there is one
      this.errorMessage = '';

      // the config will determine which endpoint to use
      const apiEndpoint = this.configService.getEndpointUrl();
      const debugMode = this.userService.getDebug();
      const loginForm = {
        phone,
        eventId,
        debug: String(debugMode || this.isDebugUser(phone))
      };

      const formBody: string = this.configService.xwwwurlencode(loginForm);
      // make the HTTPRequest
      // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
      console.log('Fetching: {}update_checkin', apiEndpoint);
      fetch(`${apiEndpoint}update_checkin`, {
        method: 'POST',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      })

      // convert the blob request and JSON parse it asynchronously
      .then((blob) => {
        if (blob.ok) { return blob.json(); }
        // eslint-disable-next-line no-throw-literal
        throw 'Invalid Response';
      })

      .then((json) => {
        // the id provided is valid - set the current user of the app to use
        // this id
        const selectedUser = new User(json.id);
        try {
          const name = json.name;
          selectedUser.setName(name);
        } catch (e) {
          console.error(`Could not get the user's name: ${e}`);
        }
        this.userService.setUser(selectedUser);

        resolve(true);
      })
      // handle HTTP errors
      .catch(err => {
        console.error(err);
        this.errorMessage = 'Invalid phone number, or you have already checked out of this event.';
        resolve(false);
      });
    });
  }

  onSubmitClick() {
    const loader = this.loadingCtrl.create({
      message: 'Validating...'
    }).then((response) => {
      response.present();
      this.checkLogin(this.phoneNum, this.eventId)
      .then((loginValid) => {
        response.dismiss().then(() => {
          if (loginValid === true) {
            // navigate to the main page
            this.router.navigate(['/check-in-two']);
          }
        });
      });
    });
  }

  onSignupClick() {
    this.svc.isAvailable()
      .then((available: boolean) => {
        if (available) {
          this.svc.show({
            url: 'https://www.pmd.org/events.phtml'
          });
        } else {
          this.iab.create('https://www.pmd.org/events.phtml', '_system', 'location=yes');
        }
      }
    );
  }
}
