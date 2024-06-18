import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddressService } from '../services/address.service';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
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
    country: null as Country | null,
    deliveryInstructions: '',
  };
  deliveryInstructions: string = '';
  showErrors = false; 

  countries: Country[] = [
    { name: 'Australia', code: 'AU' },
    { name: 'Canada', code: 'CA' },
    { name: 'Germany', code: 'DE' }, 
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'SP' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'United States', code: 'US' },
  ];

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
    this.addressService.setAddressAddingState(true);
  }

  saveNewAddress() {
    this.showErrors = true;
    if (this.isAddressValid(this.newAddress)) {
      this.addressService.addAddress({ ...this.newAddress });
      this.newAddress = { name: '', street: '', city: '', postalCode: '', country: null, deliveryInstructions: '' };
      this.addingAddress = false;
      this.showErrors = false;
      this.addressService.setAddressAddingState(false);
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
    this.addressBackup = { ...this.savedAddresses[index] }; 
  }

  saveUpdatedAddress(index: number) {
    this.showErrors = true;
    if (this.isAddressValid(this.savedAddresses[index])) {
      this.addressService.updateAddress(index, this.savedAddresses[index]);
      this.editingIndex = null;
      this.addressBackup = null;
      this.showErrors = false;
      this.savedAddresses = this.addressService.getAddresses();
      this.addressValidityChange.emit(true);
    }
  }

  cancelAddOrEdit() {
    if (this.editingIndex !== null) {
      this.savedAddresses[this.editingIndex] = this.addressBackup; 
      this.editingIndex = null;
      this.addressBackup = null;
    } else {
      this.addingAddress = false;
      this.addressService.setAddressAddingState(false);
      this.showErrors = false;
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
    this.savedAddresses.forEach(address => address.isDefault = false); 
    const address = this.savedAddresses.splice(index, 1)[0];
    address.isDefault = true; 
    this.savedAddresses.unshift(address);
    this.selectedAddress = address;
    this.defaultAddressIndex = 0; 
    setTimeout(() => this.defaultAddressIndex = null, 500); 
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
    this.addressService.updateAddress(index, this.savedAddresses[index]); 
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
