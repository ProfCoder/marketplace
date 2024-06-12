import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-form.component.html',
})
export class AddressFormComponent {
  @Output() addressValidityChange = new EventEmitter<boolean>();

  savedAddresses: any[];
  selectedAddress: any;
  addingAddress = false;
  editingAddress = false;
  showInstructions = false;
  deliveryInstructions = '';
  newAddress = {
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  };

  constructor(private addressService: AddressService) {
    this.savedAddresses = this.addressService.getAddresses();
    this.selectedAddress = this.savedAddresses[0];
    this.checkAddressValidity();
  }

  toggleEdit() {
    this.editingAddress = !this.editingAddress;
  }

  addNewAddress() {
    this.addingAddress = !this.addingAddress;
  }

  saveNewAddress() {
    this.addressService.addAddress({ ...this.newAddress });
    this.newAddress = { name: '', street: '', city: '', postalCode: '', country: '' };
    this.addingAddress = false;
    this.savedAddresses = this.addressService.getAddresses();
    this.selectedAddress = this.savedAddresses[this.savedAddresses.length - 1];
    this.checkAddressValidity();
  }

  selectAddress(address: any) {
    this.selectedAddress = address;
    this.checkAddressValidity();
  }

  onInstructionsInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.deliveryInstructions = target.value;
    }
  }

  onInputChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target ? target.value : '';
    if (this.editingAddress) {
      this.selectedAddress = { ...this.selectedAddress, [field]: value };
    } else {
      this.newAddress = { ...this.newAddress, [field]: value };
    }
    this.checkAddressValidity();
  }

  private checkAddressValidity() {
    const address = this.editingAddress ? this.selectedAddress : this.newAddress;
    const isValid = address.name && address.street && address.city && address.postalCode && address.country;
    this.addressValidityChange.emit(!!isValid);
  }
}
