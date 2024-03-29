import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'add-volunteer',
  templateUrl: './addvolunteer.component.html',
  styleUrls: ['./addvolunteer.component.css']
})

export class AddVolunteerComponent implements OnInit {

  csvFile: any;
  firstnameFieldText: string;
  lastnameFieldText: string;
  emailFieldText: string;
  locationFieldText: string;
  assignmentFieldText: string;
  phoneFieldText: string;
  phoneNumber: number;
  feedback: string;
  showFeedback: boolean = false;
  bowlID: string;
  private sub: any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.bowlID = params['bowlID'];
    });
    console.log('Bowl ID:', this.bowlID);
  }

  onSubmitClick() {
    this.showFeedback = true;
    if(!this.firstnameFieldText){
      this.feedback = "Please add the volunteer first name.";
      return;
    }
    if(!this.lastnameFieldText){
      this.feedback = "Please add the volunteer last name.";
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

    this.http.post(<any>'/add_volunteer',
    {
      bowlID: this.bowlID,
      volunteerFirstName: this.firstnameFieldText,
      volunteerLastName: this.lastnameFieldText,
      volunteerEmail: this.emailFieldText,
      volunteerLocation: this.locationFieldText,
      volunteerAssignment: this.assignmentFieldText,
      volunteerPhone: this.phoneNumber
    })
    .subscribe({
      next: data => {
        this.feedback = "Volunteer added to database";
      },
      error: error => {
        this.feedback = "Error adding volunteer to database!";
      }
    })
  }

  onFirstNameChange(newText: string){
    this.firstnameFieldText = newText;
  }

  onLastNameChange(newText: string){
    this.lastnameFieldText = newText;
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
