import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { AddressFormComponent } from '../address-form/address-form.component';
import { DeliveryPaymentComponent } from '../delivery-payment/delivery-payment.component';
import { PaymentService } from '../services/payment.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, StepsModule, AddressFormComponent, DeliveryPaymentComponent],
  templateUrl: './checkout-wizard.component.html',
})
export class CheckoutWizardComponent {
  currentStep: number = 0;
  totalCost: number = 0;
  selectionValid: boolean = false;
  shippingSelected: boolean = false;
  paymentSelected: boolean = false;

  steps = [
    { label: 'Address' },
    { label: 'Delivery & Payment' },
    { label: 'Summary' }
  ];

  constructor(private paymentService: PaymentService, private cartService: CartService) {}

  onAddressValidityChange(isValid: boolean) {

  }

  onShippingSelectionChange(isValid: boolean) {
    console.log("Shipping selection changed:", isValid);
    this.shippingSelected = isValid;
    this.updateSelectionValidity();
  }

  onPaymentSelectionChange(isValid: boolean) {
    console.log("Payment selection changed:", isValid);
    this.paymentSelected = isValid;
    this.updateSelectionValidity();
  }

  updateSelectionValidity() {
    this.selectionValid = this.shippingSelected && this.paymentSelected;
    console.log("Updated selection valid state:", this.selectionValid);
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
