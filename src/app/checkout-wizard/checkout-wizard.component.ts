import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { AddressFormComponent } from '../address-form/address-form.component';
import { DeliveryPaymentComponent } from '../delivery-payment/delivery-payment.component';
import { PaymentService } from '../services/payment.service';
import { CartService } from '../services/cart.service';
import { AddressService } from '../services/address.service';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-checkout-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, StepsModule, AddressFormComponent, DeliveryPaymentComponent],
  templateUrl: './checkout-wizard.component.html',
  styleUrls: ['./checkout-wizard.component.css'],
})
export class CheckoutWizardComponent implements OnInit {
  currentStep: number = 0;
  cartItems: any[] = [];
  totalCartPrice: number = 0;
  selectedAddress: any;
  selectedShippingMethod: any;
  selectedPaymentMethod: any;
  totalPrice: number = 0;
  selectionValid: boolean = false;
  shippingSelected: boolean = false;
  paymentSelected: boolean = false;
  addressValid: boolean = false; 
  addingAddress: boolean = false;
  savedAddresses: any[] = []; 
  steps = [
    { label: 'Address' },
    { label: 'Delivery & Payment' },
    { label: 'Summary' }
  ];

  constructor(
    private addressService: AddressService, 
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadCartItems();

    this.addressService.getSelectedAddress().subscribe(address => {
      this.selectedAddress = address;
    });

    this.paymentService.getSelectedShippingMethod().subscribe(method => {
      this.selectedShippingMethod = method;
    });
  
    this.paymentService.getSelectedPaymentMethod().subscribe(method => {
      this.selectedPaymentMethod = method;
    });

    this.addressService.addressAdding.subscribe((isAdding: boolean) => {
      this.addingAddress = isAdding;
    });

    this.savedAddresses = this.addressService.getAddresses();
  }

  loadCartItems() {
    this.cartItems = this.cartService.getAllCartItems();
    this.loadProductDetails(); 
  }

  loadProductDetails() {
    this.productService.getAllProductMetadata().subscribe(products => {
        this.cartItems = this.cartItems.map(item => {
            const productDetails = products.find(p => p.id === item.id);
            if (productDetails) {
                return {
                    ...item,
                    ...productDetails,
                    imageUrl: this.getProductImage(productDetails)
                };
            }
            return item;
        });
    });
  }

  calculateItemsTotalPrice(): number {
    const total = this.cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    return parseFloat(total.toFixed(2));
  }

  loadSummaryDetails() {
    this.selectedAddress = this.addressService.getSelectedAddress(); 
    this.selectedShippingMethod = this.paymentService.getSelectedShippingMethod();
    this.selectedPaymentMethod = this.paymentService.getSelectedPaymentMethod();
    // this.totalPrice = this.cartService.getTotalPrice();
  }

  confirmPurchase() {
    this.cartService.clearCart();
    this.router.navigate(['/success-checkout']);
  }

  trackByItemId(index: number, item: any): any {
    return item.id;
  }

  getProductImage(product: any): string {
    const color = product.colors.find((c: { color_id: any; }) => c.color_id === product.color);
    return color ? `./assets/products/images/${color.color_id}.jpg` : './assets/images/default.jpg';
  }

  calculateTotalPrice(quantity: number, price: number): string {
    return (quantity * price).toFixed(2);
  }

  updateTotalPrice(): void {
    const itemsTotal = this.calculateItemsTotalPrice();
    const shippingCost = this.selectedShippingMethod ? parseFloat(this.selectedShippingMethod.cost) : 0;
    this.totalPrice = itemsTotal + shippingCost;
  }

  onAddressValidityChange(isValid: boolean) {
    this.addressValid = isValid;
  }

  onShippingSelectionChange(isValid: boolean) {
    this.shippingSelected = isValid;
    this.updateSelectionValidity();
    this.updateTotalPrice();
  }

  onPaymentSelectionChange(isValid: boolean) {
    this.paymentSelected = isValid;
    this.updateSelectionValidity();
    this.updateTotalPrice();
  }

  updateSelectionValidity() {
    this.selectionValid = this.shippingSelected && this.paymentSelected;
  }

  canProceedToNextStep(): boolean {
    if (this.currentStep === 0) {
      return this.savedAddresses.length > 0 && this.addressValid && !this.addingAddress;
    }
    if (this.currentStep === 1) {
      return this.shippingSelected && this.paymentSelected;
    }
    return true;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1 && this.canProceedToNextStep()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
