import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ConfigService } from '../../app/config.service';
import { UserService } from '../../app/user.service';
import { PushService } from '../../app/push.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  personId: number;
  personName: string;
  personAssignment: string;
  personLocation: string;
  announcementMessage: string;

  constructor(
      public router: Router, public configService: ConfigService,
      public userService: UserService, public loadingCtrl: LoadingController,
      public pushService: PushService, public platform: Platform) {
    this.personId = userService.getUser().id;
    this.announcementMessage =
        'This is a message to all volunteers, please have the most fun and thank you for volunteering! \ud83d\ude03';
  }

  ngOnInit(): void {
    const loader = this.loadingCtrl.create({
      message: 'Loading...'
    }).then((response => {
      response.present();

      // Hit the backend for the data we need, then hide the loading spinner.
      Promise.all(
        [
          this.getManifest(),
          this.getMessage()
        ]
      ).then(() => {
        response.dismiss();
      }).catch((err) => {
        console.error(err);
        response.dismiss();
      });

      setInterval(() => {
	      this.pollBackend();
        console.log('polling backend');
      }, 7500);

      this.platform.ready().then(() => {
        // check to make sure this platform has the push notifications plugin
        if(this.platform.is('capacitor')){
          this.pushService.register(
          this.userService.getUser(),
          this.configService.getEndpointUrl()
        )
        .then((rsp) => {
          console.log('push response', rsp);
        });
        }
      });
    }));
  };

  pollBackend() {
    this.getManifest()
      .catch((err) => console.error(err));
    this.getMessage()
      .catch((err) => console.error(err));
  }

  getManifest(): Promise<void> {
    return new Promise((resolve, reject) => {
      // the api we hit that runs remotely - the "real" one
      const apiEndpoint = this.configService.getEndpointUrl();

      // make the HTTPRequest
      // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
      fetch(`${apiEndpoint}uid/${String(this.personId)}`)
          // convert the blob request and JSON parse it asynchronously
          .then((blob) => blob.json())

          .then((json) => {
            if (json.name && json.assignment && json.location) {
              // set the values that are bound in the template
              this.personName = json.name;
              this.personAssignment = json.assignment;
              this.personLocation = json.location;
            } else {
              throw new Error(`JSON response from ${
                  apiEndpoint} formatted incorrectly, expecting at least one result.`);
            }
            resolve();
            return;
          })
          // handle HTTP errors
          .catch((err) => {
            this.personName = 'ERROR';
            this.personAssignment = 'ERROR';
            console.error(err);
            console.error('Try turning on CORS or switching DEV_MODE');
            reject();
            return;
          });
      });
  }

  getMessage(): Promise<void> {
    return new Promise((resolve, reject) => {
      const apiEndpoint = this.configService.getEndpointUrl();

      fetch(`${apiEndpoint}get_message/${String(this.personId)}`)
        .then((blob) => blob.text())
        .then((message) => {
          this.announcementMessage = message;
          resolve();
        })
        .catch((err) => {
          reject(err);
          return;
        });
    });
  }

  onDoneClick() {
    this.router.navigate(['/checkout-out']);
  }

  onSaveUserClick() {
    this.userService.saveUser();
  }

  onLoadUserClick() {
    this.userService.loadUser().then(response => console.log('load_response', response));
  }

  onDeleteUserClick() {
    this.userService.deleteUser();
  }

  onCheckoutReminded(){
    this.router.navigate(['/check-out-reminded']);
  }
}
