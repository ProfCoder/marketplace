import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FloatLabelModule, ButtonModule, RadioButtonModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
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

  });
  onSubmit(){ // what happens when button is pressed
      if (this.registerForm.invalid){
          console.log("invalid");
      }
      console.log("submitted");
  }
  selectOtherOption(){
    this.registerForm.get('title')?.setValue('Other');
  }
  get email(){
      return this.registerForm.get("email");
  }
  get title(){
    return this.registerForm.get("title");
  }
}
