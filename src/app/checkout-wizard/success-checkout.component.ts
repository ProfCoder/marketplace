import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-checkout',
  standalone: true,
  imports: [],
  templateUrl: './success-checkout.component.html',
  styleUrl: './success-checkout.component.css'
})
export class SuccessCheckoutComponent {

  constructor(private router: Router) {}

  navigateHome(): void {
    this.router.navigate(['/']); 
  }
}