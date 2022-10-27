import { Component, OnInit } from '@angular/core';
import { UserService } from '../../app/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  debugSms = true;

  constructor( public userService: UserService, public router: Router ) {}

  ngOnInit(): void {
  }

  onGetStartedClick() {
    // Uncomment to debug with fixed SMS code of 123456
    //this.userService.setDebug(this.debugSms);
    // navigate to the check in page
    this.router.navigate(['/check-in']);
  }

}
