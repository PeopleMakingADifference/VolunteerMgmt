import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import {User} from './user.service';
//import {FCM} from '@ionic-native/fcm';
import {Platform} from '@ionic/angular';
import { Router } from '@angular/router';

// allows the app to receive push notifications

@Injectable({
  providedIn: 'root'
})
export class PushService {
  constructor(
    public storage: Storage,
    //public fcm: FCM,
    public platform: Platform,
    public router: Router
  ){
    this.platform.ready().then(()=>{
      if(this.platform.is('android')){
        //fcm.onNotification().subscribe(data => {
        //  if(data.intent && data.intent === 'checkout_reminder'){
        //    this.router.navigate(['/check-out-reminded']);
        //  }
        //});
      }
    });
  }

  register(user: User, endpoint: string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.platform.ready().then(()=>{
        //this.fcm.getToken().then(token => {
        //  this.sendToken(endpoint, token, user.id)
        //  .then(response => resolve(response))
        //  .catch(err => reject(err));
        //});
        //this.fcm.onTokenRefresh().subscribe(token => {
        //  this.sendToken(endpoint, token, user.id)
        //  .then(response => console.log('refreshed token.'))
        //  .catch(err => console.error('error refreshing token', err));
        //});
      });
    });
  }

  sendToken(endpoint: string, token: string, uid: number): Promise<any>{
    return new Promise((resolve, reject) => {
      fetch(
        `${endpoint}update_token`,
        {
          method: 'POST',
          body: JSON.stringify(
            {
              uid,
              token
            }
          ),
          headers: new Headers({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json'
          })
        }
      )
      .then(blob => blob.text())
      .then(text => resolve(text))
      .catch(err => reject(err));
    });
  }
}
