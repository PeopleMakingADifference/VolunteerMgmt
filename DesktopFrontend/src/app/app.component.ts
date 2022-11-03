import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    .subscribe({
      next: (json)=> {
        this.bowls = json;
      },
      error: (e) => { 
        console.error(e);
        this.showError('reach database');
      },
      complete: () => console.trace('complete loadItems')
    });
  }

  postAssignment(volunteer: any, input_assignment: string) {
    this.errorMessage = '';
    this.http.post('/update_assignment',
      {
        uid : volunteer.id,
        assignment : input_assignment
      }
    )
    .subscribe({
      next: ()=> {
        volunteer.assignment = volunteer.new_assignment;
        console.log('updated assignment');
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update assignment for ${volunteer.name}`)
      },
      complete: () => console.trace('complete postAssignment')
    });
  }

  postLocation(volunteer: any, input_location: string) {
    this.errorMessage = '';
    this.http.post('/update_location',
      {
        uid : volunteer.id,
        location : input_location
      }
    )
    .subscribe({
      next: ()=> {
        volunteer.location = volunteer.new_location;
        console.log('updated location')
      },
      error: (e) => { 
        console.error(e)
        this.showError(`update location for ${volunteer.name}`)
      },
      complete: () => console.trace('complete postLocation')
    });
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
    .subscribe({
      next: ()=> {
        bowl.message = input_message;
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update message for ${bowl.name}`);
      },
      complete: () => console.trace('complete postMessage')
    });
  }

  postIsClosed(bowl: any, is_closed: boolean) {
    this.errorMessage = '';
    this.http.post('/update_is_closed',
      {
        eventId: bowl.id,
        isClosed : is_closed
      }
    )
    .subscribe({
      next: ()=> {
        bowl.isClosed = is_closed;
      },
      error: (e) => { 
        console.error(e);
        this.showError(`update isClosed for ${bowl.name}`);
      },
      complete: () => console.trace('complete postIsClosed')
    });
  }

  enableEditing(volunteer: any) {
    volunteer.edit = !volunteer.edit;
  }

  showError = (action: string) => (message: any) => {
    console.error(message);
    this.errorMessage = `Server error: Could not ${action}.`;
  }

}
