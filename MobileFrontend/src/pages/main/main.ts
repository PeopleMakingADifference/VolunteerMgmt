import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ConfigService} from '../../app/config.service';
import {UserService} from '../../app/user.service';

@Component({selector: 'page-main', templateUrl: 'main.html'})
export class MainPage implements OnInit {
  personId: number;
  personName: string;
  personAssignment: string;
  personLocation: string;
  announcementMessage: string;

  constructor(
      public navCtrl: NavController, public configService: ConfigService,
      userService: UserService) {
    this.personId = userService.getUser().id;
    this.announcementMessage =
        'This is a message to all volunteers, please have the most fun and thank you for volunteering! \ud83d\ude03';
  }

  ngOnInit(): void {
    this.getManifest();
    this.getMessage();
    
    setInterval(()=>{
	this.pollBackend();
        console.log("polling backend");
    }, 7500);
  }

  pollBackend() {
    this.getManifest();
    this.getMessage();
  }

  getManifest() {
    // the api we hit that runs remotely - the "real" one
    const apiEndpoint = this.configService.getEndpointUrl();

    // make the HTTPRequest
    // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    fetch(apiEndpoint + String(this.personId))
        // convert the blob request and JSON parse it asynchronously
        .then((blob) => blob.json())

        .then((json) => {
          if (json.length > 0) {
            // set the values that are bound in the template
            this.personName = json[0].name;
            this.personAssignment = json[0].assignment;
            this.personLocation = json[0].location;
          } else {
            throw new Error(`JSON response from ${
                apiEndpoint} formatted incorrectly, expecting at least one result.`);
          }
        })
        // handle HTTP errors
        .catch((err) => {
          this.personName = 'ERROR';
          this.personAssignment = 'ERROR';
          console.error(err);
          console.error('Try turning on CORS or switching DEV_MODE');
        });
  }

  getMessage() {
    const apiEndpoint = this.configService.getEndpointUrl();

    fetch(apiEndpoint + 'get_message')
        .then((blob) => blob.text())
        .then((message) => this.announcementMessage = message);
  }
}
