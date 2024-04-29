import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SuccessRegistrationComponent } from './register/success-registration.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'success',
        component: SuccessRegistrationComponent,
    },
    {
        path: '**',
        redirectTo: ''
    }
];
