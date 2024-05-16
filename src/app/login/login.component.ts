import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FloatLabelModule,ButtonModule ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm = new FormGroup({
        email: new FormControl('', [
            // input validation
            Validators.required,
            Validators.email,
        ]),
        password: new FormControl('', [
            Validators.required,

            // In my opinion it doesn't make sense to validate password when the user is logging in, so I am commenting out how it would be done.
            // The password would instead get validated upon register, and then checked against the password stored in the database as to
            // whether it's correct or not.
            
            //Validators.minLength(8),
        ])
    });

    formSubmitted: boolean = false;
    
    onSubmit(){ 
        if (this.loginForm.invalid){
            console.log("invalid");
        }
        console.log("submitted");
        this.formSubmitted = true;
    }
    get email(){
        return this.loginForm.get("email");
    }
    get password(){
        return this.loginForm.get("password");
    }
}
