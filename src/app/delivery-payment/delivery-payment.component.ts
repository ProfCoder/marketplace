import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PaymentService } from '../services/payment.service';

export interface PaymentMethod {
  id: string;
  name: string;
  details: string; 
  maskedDetails?: string; 
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
    { id: 'credit', displayName: 'Credit Card', inputPlaceholder: 'Card Number', defaultImageUrl: 'assets/icons/card1.png' },
    { id: 'paypal', displayName: 'PayPal', inputPlaceholder: 'Email Address', defaultImageUrl: 'assets/icons/paypal.png' },
    { id: 'sepa', displayName: 'SEPA', inputPlaceholder: 'IBAN', defaultImageUrl: 'assets/icons/sepa.jpg' }
  ];
  creditCardImages: string [] = [
    "assets/icons/card1.png",
    "assets/icons/card2.webp",
    "assets/icons/card3.jpg",
    "assets/icons/card4.png",
    "assets/icons/card5.png"
  ]
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
    this.emitInitialPaymentSelectionState();
    this.setDefaultPaymentType();
  }

  initializeShippingOptions() {
    const today = new Date();
    this.shippingOptions = [
      { 
        id: 'standard', 
        name: 'Standard', 
        duration: '5 days', 
        cost: "FREE", 
        icon: 'pi pi-truck',
        deliveryDate: this.formatDate(today, 5)
      },
      { 
        id: 'express', 
        name: 'Express', 
        duration: '3 days', 
        cost: 5, 
        icon: 'pi pi-send',
        deliveryDate: this.formatDate(today, 3)
      },
      { 
        id: 'next-day', 
        name: 'Next Day', 
        duration: '1 day', 
        cost: 10, 
        icon: 'pi pi-star',
        deliveryDate: this.formatDate(today, 1)
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

  emitInitialPaymentSelectionState(): void {
    const defaultPayment = this.payments.find(p => p.default);
  if (defaultPayment && this.isValidPayment(defaultPayment)) {
    this.paymentService.setSelectedPaymentMethod(defaultPayment);
    this.paymentSelectionChange.emit(true);
  } else {
    this.paymentSelectionChange.emit(false);
  }
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

      if (this.selectedPaymentType.id === 'credit') {
        const creditPaymentsCount = this.payments.filter(p => p.id === 'credit').length;
        const imageIndex = creditPaymentsCount % this.creditCardImages.length;
        this.newPayment.imageUrl = this.creditCardImages[imageIndex];
      } else {
        this.newPayment.imageUrl = this.selectedPaymentType.defaultImageUrl;
      }
  

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
    this.selectedPayment = payment;
    const isValid = this.isValidPayment(payment);
    if (this.isValidPayment(payment)) {
      this.paymentService.setSelectedPaymentMethod(payment);
      this.selectedPayment = payment;
      this.paymentSelectionChange.emit(isValid && payment === this.selectedPayment);
  } else {
      this.selectedPayment = null;
      this.paymentSelectionChange.emit(false);
    }
  }

  addNewPayment() {
    this.addingPayment = true;
  }

  saveNewPayment() {
  
     if (this.newPayment.id === 'credit' && this.newPayment.details) {
        const creditPaymentsCount = this.payments.filter(p => p.id === 'credit').length;
        const imageIndex = creditPaymentsCount % this.creditCardImages.length;
        this.newPayment.imageUrl = this.creditCardImages[imageIndex];
     }
    //check if it's a credit card/iban to mask number
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
    this.paymentSelectionChange.emit(false);
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
    const wasDefault = this.payments[index].default;
    this.payments.splice(index, 1);
    this.paymentService.removePayment(index);
    this.payments = this.paymentService.getPayments();

    if (wasDefault && this.payments.length > 0) {
        this.selectPayment(this.payments[0]); 
    } else if (this.payments.length === 0) {
        this.selectedPayment = null;
        this.paymentSelectionChange.emit(false);
    } else {
        this.paymentSelectionChange.emit(false);
    }
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

  // makeDefault(index: number) {
  //   this.payments.forEach(p => p.default = false);
  //   this.payments[index].default = true;
  //   this.paymentService.savePayments(); 
  //   this.paymentSelectionChange.emit(true);
  // }

  makeDefault(index: number) {
    this.payments.forEach(p => p.default = false);
    this.payments[index].default = true;
  
    if (index !== 0) {
      const [defaultPayment] = this.payments.splice(index, 1);
      this.payments.unshift(defaultPayment);
    }
  
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
