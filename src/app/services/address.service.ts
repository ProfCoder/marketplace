// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class AddressService {
//   private addressesKey = 'addresses';
//   private addresses: any[] = [];

//   constructor() {
//     this.loadAddresses();
//   }

//   private loadAddresses() {
//     const savedAddresses = localStorage.getItem(this.addressesKey);
//     if (savedAddresses) {
//       this.addresses = JSON.parse(savedAddresses);
//     } else {
//       this.addresses = [
//         {
//           name: 'Almaz',
//           street: '12222, Nr. 111111, Jacob-Burckhardt-Straße 444',
//           city: 'Konstanz',
//           postalCode: '78464',
//           country: 'Germany',
//         },
//       ];
//       this.saveAddresses();
//     }
//   }

//   private saveAddresses() {
//     localStorage.setItem(this.addressesKey, JSON.stringify(this.addresses));
//   }

//   getAddresses() {
//     return this.addresses;
//   }

//   addAddress(address: any) {
//     this.addresses.push(address);
//     this.saveAddresses();
//   }

//   updateAddress(index: number, address: any) {
//     this.addresses[index] = address;
//     this.saveAddresses();
//   }

//   removeAddress(index: number) {
//     this.addresses.splice(index, 1);
//     this.saveAddresses();
//   }
// }


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private addressesKey = 'addresses';
  private addresses: any[] = [];

  constructor() {
    this.loadAddresses();
  }

  private loadAddresses() {
    const savedAddresses = localStorage.getItem(this.addressesKey);
    if (savedAddresses) {
      this.addresses = JSON.parse(savedAddresses);
    } else {
      this.addresses = [
        {
          name: 'Almaz',
          street: '12222, Nr. 111111, Jacob-Burckhardt-Straße 444',
          city: 'Konstanz',
          postalCode: '78464',
          country: 'Germany',
        },
      ];
      this.saveAddresses();
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
}
