import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PaymentService } from '../services/payment.service';

export interface PaymentMethod {
  id: string;
  name: string;
  details: string; // Full card number
  maskedDetails?: string; // Masked card number
  imageUrl: string;
  default: boolean;
  accountHolderName: string;
  lastFourDigits?: string; 
}

export interface PaymentType {
  id: string;
  displayName: string;
  inputPlaceholder: string;
  defaultImageUrl: string;
}

@Component({
  selector: 'app-delivery-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-payment.component.html',
  styleUrls: ['./delivery-payment.component.css']
})
export class DeliveryPaymentComponent {
  @ViewChild('paymentForm') paymentForm!: NgForm;
  @Output() paymentSelectionChange = new EventEmitter<boolean>();
  @Output() shippingSelectionChange = new EventEmitter<boolean>();

  shippingOptions: any[] = [];

  currentDetailsPlaceholder: string = '';
  editingFullDetails: string = '';
  currentInputType: string = 'text';
  payments: PaymentMethod[];
  paymentTypes = [
    { id: 'credit', displayName: 'Credit Card', inputPlaceholder: 'Card Number', defaultImageUrl: 'https://npr.brightspotcdn.com/dims4/default/add8201/2147483647/strip/true/crop/445x281+0+0/resize/880x556!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fwgvu%2Ffiles%2F201509%2Fvisa-chipAndPin.jpg' },
    { id: 'paypal', displayName: 'PayPal', inputPlaceholder: 'Email Address', defaultImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/320px-PayPal.svg.png' },
    { id: 'sepa', displayName: 'SEPA', inputPlaceholder: 'IBAN', defaultImageUrl: 'https://t3.ftcdn.net/jpg/00/62/43/88/360_F_62438887_eZPerFRxvwahpWTXHst9yOcbucMO8CKd.jpg' }
  ];
  selectedPaymentType: PaymentType | null = null;
  addingPayment = false;
  editingIndex: number | null = null;
  paymentBackup: any = null;
  newPayment: PaymentMethod = { id: '', name: '', details: '', imageUrl: '', default: false, accountHolderName: '' };
  selectedPayment: PaymentMethod | null = null;

  selectedShipping: string | null = null;

  constructor(private paymentService: PaymentService) {
    this.payments = this.paymentService.getPayments();
    this.selectedPayment = this.payments.find(p => p.default) || this.payments[0];
    this.paymentSelectionChange.emit(true);
  }

  ngOnInit(): void {
    this.initializeDefaultPaymentType();
    this.initializeShippingOptions();
    this.emitInitialSelectionStates();
    this.setDefaultPaymentType();
  }

  initializeShippingOptions() {
    const today = new Date();
    this.shippingOptions = [
      { 
        id: 'next-day', 
        name: 'Next Day Delivery', 
        duration: '1 day', 
        cost: 10, 
        icon: 'pi pi-exclamation-circle',
        deliveryDate: this.formatDate(today, 1)
      },
      { 
        id: 'express', 
        name: 'Express Delivery', 
        duration: '3 days', 
        cost: 5, 
        icon: 'pi pi-send',
        deliveryDate: this.formatDate(today, 3)
      },
      { 
        id: 'standard', 
        name: 'Standard Delivery', 
        duration: '5 days', 
        cost: 0, 
        icon: 'pi pi-truck',
        deliveryDate: this.formatDate(today, 5)
      }
    ];
  }

  
  selectShippingMethod(shippingId: string): void {
    const selected = this.shippingOptions.find(option => option.id === shippingId);
    this.selectedShipping = shippingId;
    const cost = this.getSelectedShippingCost();
    this.paymentService.setShippingCost(cost);
    this.paymentService.setSelectedShippingMethod(selected);
    this.shippingSelectionChange.emit(true);
  }

  getSelectedShippingCost(): number {
    const selectedShippingOption = this.shippingOptions.find(option => option.id === this.selectedShipping);
      return selectedShippingOption.cost;

  }

  formatDate(date: Date, daysToAdd: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + daysToAdd);
    return result.toLocaleDateString();
  }

  emitInitialSelectionStates() {
    const defaultPaymentSelected = this.selectedPayment && this.selectedPayment.id && this.selectedPayment.details;
    this.paymentSelectionChange.emit(!!defaultPaymentSelected); 

    const defaultShippingSelected = !!this.selectedShipping;
    this.shippingSelectionChange.emit(defaultShippingSelected);
  }

  setDefaultPaymentType(): void {
    if (!this.selectedPaymentType) {
      const defaultType = this.paymentTypes.find(type => type.id === 'credit');
      if (defaultType) {
        this.selectPaymentTypeByType(defaultType);
        this.paymentSelectionChange.emit(true);
      }
    }
  }


  initializeDefaultPaymentType(): void {

    if (this.payments.length > 0) {
        const defaultPayment = this.payments.find(p => p.default);
        if (defaultPayment && this.isValidPayment(defaultPayment)) {
            this.selectedPayment = defaultPayment;
            this.paymentSelectionChange.emit(true);
        } else {
            this.selectedPayment = null;
        }
    } else {
        // No payments are available, no default possible
        this.selectedPayment = null;
        this.paymentSelectionChange.emit(false);
    }
  }

  isValidPayment(payment: PaymentMethod): boolean {
    return !!payment && !!payment.details && payment.details.trim() !== '' && !!payment.id;
  }

  onPaymentTypeChange(): void {
    if (this.selectedPaymentType) {
      this.currentDetailsPlaceholder = this.selectedPaymentType?.inputPlaceholder || '';
      this.currentInputType = this.selectedPaymentType.id === 'paypal' ? 'email' : 'number'; 
      this.newPayment = {
        id: this.selectedPaymentType?.id || '',
        name: this.selectedPaymentType?.displayName || '',
        details: '',
        imageUrl: this.selectedPaymentType?.defaultImageUrl || '',
        default: false,
        accountHolderName: ''
      };
    }
  }

  selectPaymentTypeByType(paymentType: PaymentType): void {
    this.selectedPaymentType = paymentType;
    this.currentDetailsPlaceholder = paymentType.inputPlaceholder;
    this.currentInputType = paymentType.id === 'paypal' ? 'email' : 'number';

    this.newPayment = {
        id: paymentType.id,
        name: paymentType.displayName,
        details: '', 
        imageUrl: paymentType.defaultImageUrl,
        default: false,
        accountHolderName: ''
    };

    this.selectedPayment = this.newPayment; 
    this.paymentSelectionChange.emit(true); 
}


  selectPayment(payment: any) {
    if (this.isValidPayment(payment)) {
      this.paymentService.setSelectedPaymentMethod(payment);
      this.selectedPayment = payment;
      this.paymentSelectionChange.emit(true);
  } else {
      this.selectedPayment = null;
      this.paymentSelectionChange.emit(false);
  }
  }

  addNewPayment() {
    this.addingPayment = true;
  }

  saveNewPayment() {
    if (!this.newPayment.accountHolderName.trim()) {
      alert('Account holder name is required.');
      return;
    }

    if (!this.newPayment.details.trim()) {
      alert('Details cannot be empty');
      return;
    }
  
    //check if it's a credit card to mask number
    if ((this.newPayment.id === 'credit' || this.newPayment.id === "sepa") && this.newPayment.details) {
      this.newPayment.maskedDetails = `ending in ${this.newPayment.details.slice(-4)}`;
    } else {
      this.newPayment.maskedDetails = this.newPayment.details; 
    }
  
    this.paymentService.addPayment(this.newPayment);
    this.resetNewPayment(); 
    this.addingPayment = false;
    this.payments = this.paymentService.getPayments();
    this.paymentSelectionChange.emit(true);
  }

  editPayment(index: number): void {
    this.editingIndex = index;
    this.paymentBackup = { ...this.payments[index] };

    const paymentType = this.paymentTypes.find(type => type.id === this.payments[index].id);
    if (paymentType) {
      this.selectedPaymentType = paymentType;
      this.currentDetailsPlaceholder = paymentType.inputPlaceholder;
    }

    this.editingFullDetails = this.payments[index].details; 
}

  saveUpdatedPayment(index: number): void {
  //   if (!this.payments[index].accountHolderName.trim()) {
  //     alert('Account holder name is required.');
  //     return;
  //  }

    if (!this.paymentForm.valid) {
      return;
    }

    this.payments[index].details = this.editingFullDetails; 
    if (this.payments[index].id === 'credit' || this.payments[index].id === 'sepa') {
        this.payments[index].maskedDetails = `ending in ${this.editingFullDetails.slice(-4)}`; 
    } else {
        this.payments[index].maskedDetails = this.editingFullDetails;
    }

    this.paymentService.updatePayment(index, this.payments[index]);
    this.editingIndex = null;
    this.payments = this.paymentService.getPayments();
    this.paymentSelectionChange.emit(true);
  }

  cancelAddOrEdit() {
    if (this.editingIndex !== null) {
      this.editingIndex = null;
    }
    this.addingPayment = false;
    this.newPayment = { id: '', name: '', details: '', imageUrl: '', default: false, accountHolderName: ''};
    this.resetNewPayment();
  }

  removePayment(index: number) {
    if (this.payments[index].default && this.payments.length > 1) {
      this.selectPayment(this.payments[index === 0 ? 1 : 0]);
    }
    this.paymentService.removePayment(index);
    this.payments = this.paymentService.getPayments();
    this.paymentSelectionChange.emit(true);
  }

  resetNewPayment() {
    if (this.selectedPaymentType) {
      this.newPayment = {
        id: this.selectedPaymentType.id,
        name: this.selectedPaymentType.displayName,
        details: '',
        imageUrl: this.selectedPaymentType.defaultImageUrl,
        default: false,
        accountHolderName: ''
      };
    }
  }

  makeDefault(index: number) {
    this.payments.forEach(p => p.default = false);
    this.payments[index].default = true;
    this.paymentService.savePayments(); 
    this.paymentSelectionChange.emit(true);
  }

  getPattern(): string {
    if (!this.selectedPaymentType) return ''; 
    switch (this.selectedPaymentType.id) {
      case 'credit':
        return '^[0-9]{16}$';  //16 digits for credit cards
      case 'sepa':
        return '^[0-9]{22}$';  //22 digits for IBAN
      case 'paypal':
        return '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$';// Email for PayPal
      default:
        return '';
    }
  }

  getErrorMessage(): string {
    if (!this.selectedPaymentType) return 'Invalid input.';
    switch (this.selectedPaymentType.id) {
      case 'credit':
        return 'Card number must have exactly 16 digits.';
      case 'sepa':
        return 'IBAN must have exactly 22 digits.';
      case 'paypal':
        return 'Please enter a valid email address.';
      default:
        return 'Invalid input.';
    }
  }
}
