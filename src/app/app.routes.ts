import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SuccessRegistrationComponent } from './register/success-registration.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component'; 
import { SearchResultsComponent } from './search-results/search-results.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutWizardComponent } from './checkout-wizard/checkout-wizard.component';
import { SuccessCheckoutComponent } from './checkout-wizard/success-checkout.component';

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
        path: '',
        component: ProductListComponent,
    },
    {
        path: 'products/:id',
        component: ProductDetailComponent,
    },
    {
        path: 'colors/:id',
        component: ProductDetailComponent,
    },
    {
        path: 'search-results',
        component: SearchResultsComponent,
    },
    {
        path: 'cart',
        component: CartComponent,
    },
    {
        path: 'checkout', 
        component: CheckoutWizardComponent,
    },
    {
        path: 'success-checkout',
        component: SuccessCheckoutComponent,
    },
    {
        path: '**',
        redirectTo: ''
    }
];
