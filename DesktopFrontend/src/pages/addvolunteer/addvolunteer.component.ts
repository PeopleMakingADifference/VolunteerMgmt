import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'add-volunteer',
  templateUrl: './addvolunteer.component.html',
  styleUrls: ['./addvolunteer.component.css']
})

export class AddVolunteerComponent implements OnInit {

  csvFile: any;
  nameFieldText: string;
  emailFieldText: string;
  locationFieldText: string;
  assignmentFieldText: string;
  phoneFieldText: string;
  phoneNumber: number;
  feedback: string;
  showFeedback: boolean = false;
  bowlID: string;
  private sub: any;

  constructor(private http: Http, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.bowlID = params['bowlID'];
    });
    console.log('Bowl ID:', this.bowlID);
  }

  onSubmitClick() {
    this.showFeedback = true;
    if(!this.nameFieldText){
      this.feedback = "Please add the volunteer name.";
      return;
    }
    if(!this.emailFieldText){
      this.feedback = "Please add the volunteer email.";
      return;
    }
    if(!this.assignmentFieldText){
      this.feedback = "Please add the volunteer assignment.";
      return;
    }
    if(!this.locationFieldText){
      this.feedback = "Please add the volunteer location.";
      return;
    }
    if(!this.phoneFieldText){
      this.feedback = "Please add the volunteer phone number.";
      return;
    }
    this.phoneNumber = parseInt(this.phoneFieldText, 10);
    if (!this.phoneNumber || this.phoneNumber === NaN) {
      this.feedback = "Please enter only digits for phone number.";
      return;
    }

    this.http.post('/add_volunteer',
    {
      bowlID: this.bowlID,
      volunteerName: this.nameFieldText,
      volunteerEmail: this.emailFieldText,
      volunteerLocation: this.locationFieldText,
      volunteerAssignment: this.assignmentFieldText,
      volunteerPhone: this.phoneNumber
    })
    .subscribe((res) => {
      if (res.status === 200) {
        this.feedback = "Volunteer added to database";
      } else {
        this.feedback = "Error adding volunteer to database!";
      }
    });
  }

  onNameChange(newText: string){
    this.nameFieldText = newText;
  }

  onEmailChange(newText: string){
    this.emailFieldText = newText;
  }

  onAssignmentChange(newText: string){
    this.assignmentFieldText = newText;
  }

  onLocationChange(newText: string){
    this.locationFieldText = newText;
  }

  onPhoneChange(newText: string){
    this.phoneFieldText = newText;
  }

  onReturnDashboardClick() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
