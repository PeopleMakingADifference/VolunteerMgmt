import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';

import { ConfigService } from '../../app/config.service';
import { UserService } from '../../app/user.service';

@Component({
  selector: 'app-check-in-two',
  templateUrl: './check-in-two.page.html',
  styleUrls: ['./check-in-two.page.scss'],
})
export class CheckInTwoPage implements OnInit {
  personName: string;
  errorMessage: string;
  responseCode: string;

  constructor(
    public router: Router,
    public userService: UserService,
    public configService: ConfigService, public loadingCtrl: LoadingController,
    public platform: Platform) {
    this.personName = userService.getUser().name;
  }

  ngOnInit(): void {
    this.platform.ready().then(()=>{
      if(/*!this.userService.getDebug()*/ false && this.platform.is('android')){
        const loader = this.loadingCtrl.create({
          message: 'Waiting for text message...'
        }).then((response) => {
        response.present();
        const interval = setInterval(() => {
          console.log('checking...')
          if(this.userService.getUser().hasCode()){
            console.log(`code: ${this.userService.getUser().getCode()}`);
            this.verifyCode(this.userService.getUser().getCode())
            .then(verified => {
              response.dismiss();
              this.userService.saveUser();
              this.router.navigate(['/home']);
              clearInterval(interval);
            });
          }
        }, 500);
      });
    }});
  }

  onSubmitClick(): void {
    // clear the error message, if there is one
    this.errorMessage = '';
    this.verifyCode(this.responseCode)
    .then(verified => {
      if(verified) {
        // log the user in automagically from now on
        this.userService.saveUser();
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Incorrect verification code.';
      }
    });
  }

  verifyCode(responseCode: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

      // the config will determine which endpoint to use
      const apiEndpoint = this.configService.getEndpointUrl();

      const verificationForm = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        verif_code: responseCode,
        uid: this.userService.getUser().id
      };

      const formBody: string = this.configService.xwwwurlencode(verificationForm);
      // make the HTTPRequest
      // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
      fetch(`${apiEndpoint}verification`, {
        method: 'POST',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      })

      // convert the blob request and JSON parse it asynchronously
      .then((blob) => blob.json())

      .then((json) => {
        resolve(true);
      })
      // handle HTTP errors
      .catch((err) => {
        console.error(err);
        resolve(false);
      });
    });
  }
}
