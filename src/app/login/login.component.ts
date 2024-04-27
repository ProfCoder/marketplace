import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FloatLabelModule, ButtonModule ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm = new FormGroup({
        email: new FormControl('', [
            // input validation
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', [
            Validators.required,
        ])
    });
    onSubmit(){ // what happens when button is pressed
        if (this.loginForm.invalid){
            console.log("invalid");
        }
        console.log("submitted");
    }
    get email(){
        return this.loginForm.get("email");
    }
}
