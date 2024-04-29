import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FloatLabelModule, ButtonModule, RadioButtonModule, CalendarModule, InputNumberModule, DropdownModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  maxDate: Date = new Date();

  ngOnInit() {
  //Disable future dates selection for birthday in the calendar
    this.maxDate.setDate(this.maxDate.getDate());
  }
  constructor(private cdr: ChangeDetectorRef, private router: Router) {} // ChangeDetectorRef is used to manually trigger change detection for radio buttons 
  registerForm = new FormGroup({
      firstName: new FormControl('', [
          Validators.required,
      ]),
      lastName: new FormControl('', [
          Validators.required,
      ]),
      title: new FormControl('', [

      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
    ]),
    password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
    ]),
        street: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
    ]),
        streetNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
    ]),
        zipCode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
    ]),
        city: new FormControl('', [
        Validators.required,
    ]),
        country: new FormControl('', [
        Validators.required,
    ]),
        birthdate: new FormControl('', [
        Validators.required,
    ]),

  }
);
  countries: SelectItem[] = [
    { label: 'France', value: 'France' },
    { label: 'Germany', value: 'Germany' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'United States', value: 'USA' },
  ];

  showOtherInput: boolean = false;
  formSubmitted: boolean = false;

/**
 * Method called when the registration form is submitted.
 * If the form is valid, performs necessary actions such as sending form data to a server and navigating to the success page.
 * If the form is invalid, logs error messages for each invalid field.
 */

  onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      console.log('Form submitted successfully!');
      this.router.navigate(['./success']);
    } else {
      console.log('Form is invalid. Please fill in all required fields.');

      if (this.firstName?.invalid) {
        console.log('First name is invalid.');
      }
      if (this.lastName?.invalid) {
        console.log('Last name is invalid.');
      }
      if (this.title?.invalid) {
        console.log('Title is invalid.');
      }
      if (this.email?.invalid) {
        console.log('Email is invalid.');
      }
      if (this.password?.invalid) {
        console.log('Password is invalid.');
      }
      if (this.birthdate?.invalid) {
        console.log('Birthdate is invalid.');
      }
      if (this.street?.invalid) {
        console.log('Street is invalid.');
      }
      if (this.streetNumber?.invalid) {
        console.log('Street number is invalid.');
      }
      if (this.zipCode?.invalid) {
        console.log('Zip code is invalid.');
      }
      if (this.city?.invalid) {
        console.log('City is invalid.');
      }
      if (this.country?.invalid) {
        console.log('Country is invalid.');
      }
    }
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
  get firstName(){
    return this.registerForm.get("firstName");
  }
  get lastName(){
    return this.registerForm.get("lastName");
  }
  get password(){
    return this.registerForm.get("password");
  }
  get birthdate(){
    return this.registerForm.get("birthdate");
  }
  get street(){
    return this.registerForm.get("street");
  }
  get streetNumber(){
    return this.registerForm.get("streetNumber");
  }
  get zipCode(){
    return this.registerForm.get("zipCode");
  }
  get city(){
    return this.registerForm.get("city");
  }
  get country(){
    return this.registerForm.get("country");
  }
}
