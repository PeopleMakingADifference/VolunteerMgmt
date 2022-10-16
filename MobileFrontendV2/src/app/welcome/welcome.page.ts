import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from '../../app/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  notAndroid = true;
  debugSms = true;

  constructor( public userService: UserService, public platform: Platform, public router: Router ) {}

  ngOnInit(): void {
    this.platform.ready().then(() => {
      this.notAndroid = !this.platform.is('android');
    });
  }

  onGetStartedClick() {
    this.userService.setDebug(this.debugSms);
    // navigate to the id page
    this.router.navigate(['/check-in']);
  }

}
