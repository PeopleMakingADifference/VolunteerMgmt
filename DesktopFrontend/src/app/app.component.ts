import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  errorMessage = '';
  bowls: any = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadItems();
  }

  // Gets the items into this.items by reading through the file
  loadItems() {
    this.http.get('/')
    .subscribe(json => {
      this.bowls = json;
    }, this.showError('reach database'));
  }

  postAssignment(volunteer: any, input_assignment: string) {
    this.errorMessage = '';
    this.http.post('/update_assignment',
      {
        uid : volunteer.id,
        assignment : input_assignment
      }
    )
    .subscribe(res => {
      volunteer.assignment = input_assignment;
    }, this.showError(`update assignment for ${volunteer.name}`));
  }

  postLocation(volunteer: any, input_location: string) {
    this.errorMessage = '';
    this.http.post('/update_location',
      {
        uid : volunteer.id,
        location : input_location
      }
    )
    .subscribe(res => {
      volunteer.location = input_location;
    }, this.showError(`update location for ${volunteer.name}`));
  }

  postMessage(bowl: any, input_message: string) {
    this.errorMessage = '';
    this.http.post('/update_message',
      {
        eventId: bowl.id,
        message : input_message,
        toWho : 'All Volunteers'
      }
    )
    .subscribe((res) => {
      bowl.message = input_message;
    }, this.showError(`update message for ${bowl.name}`));

  }

  postIsClosed(bowl: any, is_closed: boolean) {
    this.errorMessage = '';
    this.http.post('/update_is_closed',
      {
        eventId: bowl.id,
        isClosed : is_closed
      }
    )
    .subscribe((res) => {
      bowl.isClosed = is_closed;
    }, this.showError(`update isClosed for ${bowl.name}`));

  }

  enableEditing(volunteer: any) {
    volunteer.edit = !volunteer.edit;
  }

  showError = (action: string) => (message: any) => {
    console.error(message);
    this.errorMessage = `Server error: Could not ${action}.`;
  }

}
