import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { AddressFormComponent } from '../address-form/address-form.component';

@Component({
  selector: 'app-checkout-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, StepsModule, AddressFormComponent],
  templateUrl: './checkout-wizard.component.html',
})
export class CheckoutWizardComponent {
  currentStep: number = 0;

  steps = [
    { label: 'Address' },
    { label: 'Delivery & Payment' },
    { label: 'Summary' }
  ];

  onAddressValidityChange(isValid: boolean) {

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
