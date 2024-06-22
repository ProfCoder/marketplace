import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentMethod } from '../delivery-payment/delivery-payment.component';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private selectedShippingMethod = new BehaviorSubject<any>(null);
  private selectedPaymentMethod = new BehaviorSubject<PaymentMethod | null>(null);
  private selectedPayment = new BehaviorSubject<any>(null);
  private shippingCost = new BehaviorSubject<number>(0);
  private paymentsKey = 'payments';
  private payments: any[] = [];

  constructor() {
    this.loadPayments();
  }

  setShippingCost(cost: number): void {
    this.shippingCost.next(cost);
  }

  getShippingCost(): Observable<number> {
    return this.shippingCost.asObservable();
  }

  getSelectedShippingMethod() {
    return this.selectedShippingMethod.asObservable();
  }

  setSelectedShippingMethod(method: any) {
    this.selectedShippingMethod.next(method);
  }
  
  getSelectedPaymentMethod(): Observable<PaymentMethod | null> {
    return this.selectedPaymentMethod.asObservable();
  }

  setSelectedPaymentMethod(method: PaymentMethod) {
    this.selectedPaymentMethod.next(method);
  }

  private loadPayments() {
    const savedPayments = localStorage.getItem(this.paymentsKey);
    if (savedPayments) {
      this.payments = JSON.parse(savedPayments);
    } else {
      this.payments = [
        {
          id: 'credit',
          name: 'Credit Card',
          details: '1234 5678 9012 3456',
          imageUrl: 'https://t3.ftcdn.net/jpg/05/74/43/12/360_F_574431210_icdpLDlDxAfsNacnV56vIWb4pCRnaNBA.jpg',
          default: true
        },
        {
          id: 'paypal',
          name: 'PayPal',
          details: 'user@example.com',
          imageUrl: '',
          default: false
        }
      ];
      this.savePayments();
    }
  }

  savePayments() {
    localStorage.setItem(this.paymentsKey, JSON.stringify(this.payments));
  }

  getPayments() {
    return this.payments;
  }

  addPayment(payment: any) {
    this.payments.push(payment);
    this.savePayments();
  }

  updatePayment(index: number, payment: any) {
    this.payments[index] = payment;
    this.savePayments();
  }

  removePayment(index: number) {
    this.payments.splice(index, 1);
    this.savePayments();
  }
}