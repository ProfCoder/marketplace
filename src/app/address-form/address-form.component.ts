import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css'],
  animations: [
    trigger('slideDown', [
      state('closed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('open', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      transition('closed <=> open', [
        animate('0.3s ease')
      ])
    ])
  ]
})
export class AddressFormComponent {
  @Output() addressValidityChange = new EventEmitter<boolean>();

  savedAddresses: any[];
  selectedAddress: any;
  addingAddress = false;
  editingIndex: number | null = null;
  instructionsIndex: number | null = null;
  defaultAddressIndex: number | null = null;
  addressBackup: any = null;
  newAddress = {
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    deliveryInstructions: '',
  };
  deliveryInstructions: string = '';

  constructor(private addressService: AddressService) {
    this.savedAddresses = this.addressService.getAddresses();
    this.savedAddresses.forEach(address => {
      if (!address.deliveryInstructions) {
        address.deliveryInstructions = '';
      }
    });
    this.selectedAddress = this.savedAddresses[0];
    this.defaultAddressIndex = null;
    this.addressValidityChange.emit(true);
  }

  toggleEdit() {
    this.editingIndex = null;
    this.addressBackup = null;
  }

  addNewAddress() {
    this.addingAddress = true;
  }

  saveNewAddress() {
    if (this.isAddressValid(this.newAddress)) {
      this.addressService.addAddress({ ...this.newAddress });
      this.newAddress = { name: '', street: '', city: '', postalCode: '', country: '', deliveryInstructions: '' };
      this.addingAddress = false;
      this.savedAddresses = this.addressService.getAddresses();
      this.selectedAddress = this.savedAddresses[this.savedAddresses.length - 1];
      this.defaultAddressIndex = null;
      this.addressValidityChange.emit(true);
    }
  }

  selectAddress(address: any) {
    this.selectedAddress = address;
  }

  editAddress(index: number) {
    this.editingIndex = index;
    this.addressBackup = { ...this.savedAddresses[index] }; // Backup original address
  }

  saveUpdatedAddress(index: number) {
    if (this.isAddressValid(this.savedAddresses[index])) {
      this.addressService.updateAddress(index, this.savedAddresses[index]);
      this.editingIndex = null;
      this.addressBackup = null;
      this.savedAddresses = this.addressService.getAddresses();
      this.addressValidityChange.emit(true);
    }
  }

  cancelAddOrEdit() {
    if (this.editingIndex !== null) {
      this.savedAddresses[this.editingIndex] = this.addressBackup; // Revert to original address
      this.editingIndex = null;
      this.addressBackup = null;
    } else {
      this.addingAddress = false;
    }
  }

  removeAddress(index: number) {
    this.addressService.removeAddress(index);
    this.savedAddresses = this.addressService.getAddresses();
    if (this.selectedAddress === this.savedAddresses[index]) {
      this.selectedAddress = this.savedAddresses[0];
    }
    this.addressValidityChange.emit(true);
  }

  makeDefault(index: number) {
    this.savedAddresses.forEach(address => address.isDefault = false); // Reset all defaults
    const address = this.savedAddresses.splice(index, 1)[0];
    address.isDefault = true; // Set as default
    this.savedAddresses.unshift(address);
    this.selectedAddress = address;
    this.defaultAddressIndex = 0; // Trigger animation
    setTimeout(() => this.defaultAddressIndex = null, 500); // Reset after animation
  }

  toggleInstructions(index: number) {
    this.instructionsIndex = this.instructionsIndex === index ? null : index;
    if (this.instructionsIndex !== null) {
      this.deliveryInstructions = this.savedAddresses[index].deliveryInstructions;
    }
  }

  saveInstructions(index: number) {
    this.savedAddresses[index].deliveryInstructions = this.deliveryInstructions;
    this.instructionsIndex = null;
    this.addressService.updateAddress(index, this.savedAddresses[index]); // Save the updated address
  }

  onInputChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target ? target.value : '';
    if (this.editingIndex !== null) {
      this.savedAddresses[this.editingIndex] = { ...this.savedAddresses[this.editingIndex], [field]: value };
    } else {
      this.newAddress = { ...this.newAddress, [field]: value };
    }
  }

  isAddressValid(address: any) {
    return address.name && address.street && address.city && address.postalCode && address.country;
  }

  trackByIndex(index: number, item: any) {
    return index;
  }
}
