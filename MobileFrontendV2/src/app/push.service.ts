import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from './user.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

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
        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotificationSchema) => {
          if (notification.data.intent && notification.data.intent === 'checkout_reminder'){
            console.log('Push received: ' + JSON.stringify(notification));
            this.router.navigate(['/check-out-reminded']);
          }
        });
      }
    });
  }

  register(user: User, endpoint: string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.platform.ready().then(()=>{
        // Request permission to use push notifications
        // iOS will prompt user and return if they granted permission or not
        // Android will just grant without prompting
        PushNotifications.requestPermissions().then(result => {
          if (result.receive === 'granted') {
            // Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();
          } else {
            console.log('Push permission request failed: ' + JSON.stringify(result));
          }
        });

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration', (token: Token) => {
          console.log('Push registration success, token: ' + token.value);
          this.sendToken(endpoint, token.value, user.id)
          .then(response => resolve(response))
          .catch(err => reject(err));
        });

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError', (error: any) => {
          console.log('Error on registration: ' + JSON.stringify(error));
          reject(error);
        });

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: ActionPerformed) => {
          console.log('Push action performed: ' + JSON.stringify(notification));
        });
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
