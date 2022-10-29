import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  errorMessage = '';
  bowls: any = [];

  constructor(private http: HttpClient, private router: Router, private _cookieService:CookieService) {}

  ngOnInit() {
    this.loadItems();
  }

  // Gets the items into this.items by reading through the file
  loadItems() {
    let urlString = "/?token=" + this._cookieService.get("userFirebaseToken");
    this.http.get(urlString)
    .subscribe(json => {
      this.bowls = json;
    }, this.showError('reach database'));
  }

  postAssignment(volunteer: any) {
    this.errorMessage = '';
    this.http.post('/update_assignment',
      {
        uid : volunteer.id,
        assignment : volunteer.new_assignment
      }
    )
    .subscribe(
      () => {
        volunteer.assignment = volunteer.new_assignment;
        console.log('updated assignment')
      },
      this.showError(`update assignment for ${volunteer.name}`));
  }

  postLocation(volunteer: any) {
    this.errorMessage = '';
    this.http.post('/update_location',
      {
        uid : volunteer.id,
        location : volunteer.new_location
      }
    )
    .subscribe(
      ()=>{
        volunteer.location = volunteer.new_location;
        console.log('updated location')
      },
      this.showError(`update location for ${volunteer.name}`));
  }

  postCheckin(volunteer: any) {
    this.errorMessage = '';
    let value = moment(volunteer.new_checkin, 'MM/DD/YY, hh:mm A').valueOf();
    this.http.post('/update_admin_checkin',
      {
        uid : volunteer.id,
        checkin : value
      }
    )
    .subscribe(
      ()=>{
        volunteer.checkin = value;
        console.log('updated checkin time')
      },
      this.showError(`update checkin for ${volunteer.name}`));
  }

  postCheckout(volunteer: any) {
    this.errorMessage = '';
    let value = moment(volunteer.new_checkout, 'MM/DD/YY, hh:mm A').valueOf();
    this.http.post('/update_admin_checkout',
      {
        uid : volunteer.id,
        checkout : value
      }
    )
    .subscribe(
      ()=>{
        volunteer.checkout = value;
        console.log('updated checkout time')
      },
      this.showError(`update checkout for ${volunteer.name}`));
  }

  postVolunteerMessage(bowl: any, user: any) {
    if(!bowl.new_message || bowl.new_message === bowl.message){
      console.log("nope");
      return;
    }
    this.errorMessage = '';
    this.http.post('/update_message',
      {
        eventId: bowl.id,
        message : bowl.new_message,
        toWho : user
      }
    )
    .subscribe((res) => {
      // Update bowl message if sent to all users
      if (user === 'All Volunteers') {
        bowl.message = bowl.new_message;
      }
      console.log('updated message');
    }, this.showError(`update message for ${bowl.name}`));

  }

  enableEditing(volunteer: any) {
    volunteer.edit = true;
  }

  showError = (action: string) => (message: any) => {
    console.error(message);
    this.errorMessage = `Server error: Could not ${action}.`;
  }

  saveEdits(volunteer: any){
    if(volunteer.new_location !== volunteer.location && volunteer.new_location) {
      this.postLocation(volunteer);
    }

    if(volunteer.new_assignment !== volunteer.assignment && volunteer.new_assignment) {
      this.postAssignment(volunteer);
    }

    if(volunteer.new_checkin !== volunteer.checkin && volunteer.new_checkin) {
      this.postCheckin(volunteer);
    }

    if(volunteer.new_checkout !== volunteer.checkout && volunteer.new_checkout) {
      this.postCheckout(volunteer);
    }

    volunteer.edit = false;
  }

  goToCreateEvent(){
    this.router.navigate(['/create-event']);
  }

  sendCheckoutReminder(bowl){
    this.http.post('/update_reminder',
      {
        eventId: bowl.id
      }
    )
    .subscribe((res) => {
      console.log('reminder', res);
    },
    this.showError(`send reminder for ${bowl.name}`));
  }

  deleteBowl(bowl){
    bowl.deleting = true;
  }

  confirmDelete(bowl){
    console.log("confirm delete");

    this.errorMessage = '';
    this.http.post('/delete_event',
      {
        eventId : bowl.id
      }
    )
    .subscribe(
      ()=>{
        console.log(`deleted ${bowl.name}`);
        bowl.deleted = true;
      },
      this.showError(`delete event ${bowl.name}`)
    );
  }

  cancelDelete(bowl){
    console.log("cancel delete");
    bowl.deleting = false;
  }

  closeBowl(bowl){
    bowl.closing = true;
  }

  confirmClose(bowl){
    this.errorMessage = '';
    this.http.post('/update_is_closed',
      {
        eventId: bowl.id,
        isClosed: true
      }
    )
    .subscribe((res) => {
      bowl.isClosed = true;
      bowl.closing = false;
      console.log('updated isClosed');
    }, this.showError(`update isClosed for ${bowl.name}`));
  }

  cancelClose(bowl){
    console.log("cancel close");
    bowl.closing = false;
  }

  reopenBowl(bowl){
    this.errorMessage = '';
    this.http.post('/update_is_closed',
      {
        eventId: bowl.id,
        isClosed: false
      }
    )
    .subscribe((res) => {
      bowl.isClosed = false;
      console.log('updated isClosed');
    }, this.showError(`update isClosed for ${bowl.name}`));
  }

  archiveBowl(bowl) {
    var fileContents = JSON.stringify(bowl, null, '\t');
    var filename = bowl.name + ".json";
    var filetype = "application/json";
    var a = document.createElement("a");
    a.href = "data:" + filetype + ";base64," + btoa(fileContents);
    a['download'] = filename;
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, false, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  }

  addVolunteer(bowl){
    this.router.navigate(['/add-volunteer', bowl.id]);
  }

  refresh(): void {
    this.router.navigateByUrl('/', {skipLocationChange: false})
    .then(() => this.router.navigate(['/dashboard']));
  }
}
