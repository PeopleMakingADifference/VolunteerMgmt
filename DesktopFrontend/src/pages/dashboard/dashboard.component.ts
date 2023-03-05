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
    this.loadItems(false);
  }

  // Bit of a hack, but need to delay a bit to allow config update before refresh
  sleep(ms) {
    const date = Date.now();
    let now = null;
    do {
      now = Date.now();
    } while (now - date < ms);
  }

  // Gets the items into this.items by reading through the file
  loadItems(refresh: boolean) {
    let urlString = "/?token=" + this._cookieService.get("userFirebaseToken");
    this.http.get(urlString)
    .subscribe({
      next: (json)=> {
        this.bowls = json;
      },
      error: (e) => { 
        console.error(e);
        this.showError('reach database');
      },
      complete: () => {
        console.trace('complete loadItems');
        if (refresh) {
          this.sleep(250);
          this.refresh();
        }
      }
    });
  }

  postAssignment(volunteer: any) {
    this.errorMessage = '';
    this.http.post('/update_assignment',
      {
        uid : volunteer.id,
        assignment : volunteer.new_assignment
      }
    )
    .subscribe({
      next: ()=> {
        volunteer.assignment = volunteer.new_assignment;
        console.log('updated assignment');
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update assignment for ${volunteer.firstname} ${volunteer.lastname}`)
      },
      complete: () => console.trace('complete postAssignment')
    });
  }

  postLocation(volunteer: any) {
    this.errorMessage = '';
    this.http.post('/update_location',
      {
        uid : volunteer.id,
        location : volunteer.new_location
      }
    )
    .subscribe({
      next: ()=> {
        volunteer.location = volunteer.new_location;
        console.log('updated location')
      },
      error: (e) => { 
        console.error(e)
        this.showError(`update location for ${volunteer.firstname} ${volunteer.lastname}`)
      },
      complete: () => console.trace('complete postLocation')
    });
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
    .subscribe({
      next: ()=> {
        volunteer.checkin = value;
        console.log('updated checkin time')
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update checkin for ${volunteer.firstname} ${volunteer.lastname}`);
      },
      complete: () => console.trace('complete postCheckin')
    });
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
    .subscribe({
      next: ()=> {
        volunteer.checkout = value;
        console.log('updated checkout time')
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update checkout for ${volunteer.firstname} ${volunteer.lastname}`);
      },
      complete: () => console.trace('complete postCheckout')
    });
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
    .subscribe({
      next: ()=> {
        // Update bowl message if sent to all users
        if (user === 'All Volunteers') {
          bowl.message = bowl.new_message;
        }
        console.log('updated message');
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update message for ${bowl.name}`);
      },
      complete: () => console.trace('complete postVolunteerMessage')
    });
    // Reload so new message is displayed
    if (user === 'All Volunteers') {
      this.loadItems(true);
    }
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
    this.loadItems(true);
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
    .subscribe({
      next: (res)=> {
        console.log('reminder', res);
      },
      error: (e) => { 
        console.error(e);
        this.showError(`send reminder for ${bowl.name}`);
      },
      complete: () => console.trace('complete sendCheckoutReminder')
    });
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
    .subscribe({
      next: ()=> {
        console.log(`deleted ${bowl.name}`);
        bowl.deleted = true;
        this.loadItems(true);
      },
      error: (e) => { 
        console.error(e);
        this.showError(`delete event ${bowl.name}`);
      },
      complete: () => console.trace('complete confirmDelete')
    });
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
    .subscribe({
      next: ()=> {
        bowl.isClosed = true;
        bowl.closing = false;
        console.log('updated isClosed');
        this.loadItems(true);
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update isClosed for ${bowl.name}`);
      },
      complete: () => console.trace('complete confirmClose')
    });
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
    .subscribe({
      next: ()=> {
        bowl.isClosed = false;
        console.log('updated isClosed');
        this.loadItems(true);
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update isClosed for ${bowl.name}`);
      },
      complete: () => console.trace('complete reopenBowl')
    });
  }

  calcTotalTime(value: number) {
    if (!(value > 0)) return '';
    const seconds = value / 1000;
    let hoursDuration = Math.floor(seconds / (60 * 60));
    let minutesDuration = Math.floor((seconds - (hoursDuration * (60 * 60))) / 60);
    if(minutesDuration === 60){
      hoursDuration++;
      minutesDuration = 0;
    }
    // Show in fractional hours
    minutesDuration = Math.floor((100 * minutesDuration) / 60);
    return `${String(hoursDuration)}.${String(minutesDuration).padStart(2, '0')}`
  }

  timeToStr(time) {
    var str = '';
    if (typeof time == "number") {
      str = new Date(time).toLocaleDateString('en-US', {
        day: 'numeric', year: '2-digit', month: 'numeric', hour: 'numeric', minute: 'numeric'});
    }
    return str;
  }

  convertBowlToCSV(bowl: any) {
    // Create header row
    var str = 'Last Name,First Name,Assignment,Location,Check In,Check Out,Total Time\r\n';

    // Add in all volunteers
    for (let volunteer of bowl.volunteers) {
        var line = '\"' + volunteer.lastname + '\",';
        line += '\"' + volunteer.firstname + '\",';
        line += '\"' + volunteer.assignment + '\",';
        line += '\"' + volunteer.location + '\",';
        line += '\"' + this.timeToStr(volunteer.checkin) + '\",';
        line += '\"' + this.timeToStr(volunteer.checkout) + '\",';
        line += '\"' + this.calcTotalTime(volunteer.checkout - volunteer.checkin) + '\"';
        str += line + '\r\n';
    }
    return str;
  }

  archiveBowl(bowl) {
    var data = this.convertBowlToCSV(bowl);
    var filename = bowl.name + ".csv";
    var filetype = "text/csv";
    var a = document.createElement("a");
    a.href = "data:" + filetype + ";base64," + btoa(data);
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
