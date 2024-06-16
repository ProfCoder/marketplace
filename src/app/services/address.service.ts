import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private addressesKey = 'addresses';
  private addresses: any[] = [];
  private selectedAddress = new BehaviorSubject<any>(null);

  constructor() {
    this.loadAddresses();
  }

  private loadAddresses() {
    const savedAddresses = localStorage.getItem(this.addressesKey);
    if (savedAddresses) {
      this.addresses = JSON.parse(savedAddresses);
      // this.selectedAddress.next(this.addresses[0]);
    } else {
      this.addresses = [
        {
          name: 'Almaz',
          street: '12222, Nr. 111111, Jacob-Burckhardt-Straße 444',
          city: 'Konstanz',
          postalCode: '78464',
          country: 'Germany',
          deliveryInstructions: '',
        },
      ];
      this.saveAddresses();
      // this.selectedAddress.next(this.addresses[0]);
    }
    if (this.addresses.length > 0) {
      this.selectedAddress.next(this.addresses[0]);
  } else {
      this.selectedAddress.next(null);
  }
  }

  private saveAddresses() {
    localStorage.setItem(this.addressesKey, JSON.stringify(this.addresses));
  }

  getAddresses() {
    return this.addresses;
  }

  addAddress(address: any) {
    this.addresses.push(address);
    this.saveAddresses();
  }

  updateAddress(index: number, address: any) {
    this.addresses[index] = address;
    this.saveAddresses();
  }

  removeAddress(index: number) {
    this.addresses.splice(index, 1);
    this.saveAddresses();
  }

  getSelectedAddress() {
    return this.selectedAddress.asObservable();
  }

  setSelectedAddress(address: any) {
    this.selectedAddress.next(address);
  }
}
