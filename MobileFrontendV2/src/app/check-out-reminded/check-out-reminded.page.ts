import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../app/config.service';
import { UserService } from '../../app/user.service';

@Component({
  selector: 'app-check-out-reminded',
  templateUrl: './check-out-reminded.page.html',
  styleUrls: ['./check-out-reminded.page.scss'],
})
export class CheckOutRemindedPage implements OnInit {
  checkoutTime: string;
  feedback: string;

  constructor(
      public configService: ConfigService,
      public userService: UserService) {}

  ngOnInit(): void {
  }

  onCheckOutClick() {
    this.postCheckoutReminded(this.checkoutTime).then(()=>{
      console.log('checked out?');
    });
  }

  postCheckoutReminded(checkoutTime: string){
    return new Promise((resolve, reject) => {

      // the config will determine which endpoint to use
      const apiEndpoint = this.configService.getEndpointUrl();

      const verificationForm = {
        checkoutTime,
        uid: this.userService.getUser().id
      };

      const formBody: string = this.configService.xwwwurlencode(verificationForm);
      // make the HTTPRequest
      // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
      fetch(`${apiEndpoint}update_checkout_reminded`, {
        method: 'POST',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      })

      // convert the blob request and JSON parse it asynchronously
      .then((blob) => blob.text())

      .then((text) => {
        // the id provided is valid - set the current user of the app to use
        // this id

        this.feedback = text;
        this.userService.deleteUser().then(deleted => {
          resolve(true);
        });
      })
      // handle HTTP errors
      .catch((err) => {
        console.error(err);

        // if the response we get from the server is not valid json,
        // our attempt to JSON parse it above throws a SyntaxError
        // we always get invalid JSON when the ID is invalid
        // if (err.name === 'SyntaxError') {
        //   this.errorMessage = 'Invalid Phone Number';
        // }
        resolve(false);
      });
    });
  }
}
