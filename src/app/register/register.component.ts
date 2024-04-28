import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FloatLabelModule, ButtonModule, RadioButtonModule, CalendarModule, InputNumberModule, DropdownModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  constructor(private cdr: ChangeDetectorRef) {} // ChangeDetectorRef is used to manually trigger change detection for radio buttons 
  registerForm = new FormGroup({
      firstName: new FormControl('', [
          // input validation
          Validators.required,
      ]),
      lastName: new FormControl('', [
          Validators.required,
      ]),

      title: new FormControl('', [
       
      ]),
      email: new FormControl('', [
        // input validation
        Validators.required,
        Validators.email
    ]),
    password: new FormControl('', [
        Validators.required,
    ]),
        street: new FormControl('', [
        Validators.required,
    ]),
        streetNumber: new FormControl('', [
        Validators.required,
    ]),
        zipCode: new FormControl('', [
        Validators.required,
    ]),
        city: new FormControl('', [
        Validators.required,
    ]),
        country: new FormControl('', [
        Validators.required,
    ]),

  });
  countries: SelectItem[] = [
    { label: 'United States', value: 'USA' },
    { label: 'Germany', value: 'Germany' },
    { label: 'France', value: 'France' },
    { label: 'United Kingdom', value: 'UK' }
  ];

  showOtherInput: boolean = false;

  onSubmit(){ // what happens when button is pressed
      if (this.registerForm.invalid){
          console.log("invalid");
      }
      console.log("submitted");
  }

  selectOtherOption() {
    this.showOtherInput = true; // Show the other input field when "Other" option is selected
    this.registerForm.get('title')?.setValue('Other');
  }
  
  selectMrOrMrs() {
    this.showOtherInput = false; // Hide the other input field when "Mr." or "Mrs." option is selected
  }
  
  get email(){
      return this.registerForm.get("email");
  }
  get title(){
    return this.registerForm.get("title");
  }

}
