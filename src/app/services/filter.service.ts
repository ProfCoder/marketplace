// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class FilterService {
//   private showFiltersSource = new BehaviorSubject<boolean>(false);
//   showFilters$ = this.showFiltersSource.asObservable();

//   toggleFilters() {
//     this.showFiltersSource.next(!this.showFiltersSource.value);
//   }
// }


// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class FilterService {
//   private filterVisibility = new BehaviorSubject<boolean>(false);

//   filterVisibility$ = this.filterVisibility.asObservable();

//   toggleFilters() {
//     this.filterVisibility.next(!this.filterVisibility.value);
//   }

//   showFilters() {
//     this.filterVisibility.next(true);
//   }

//   hideFilters() {
//     this.filterVisibility.next(false);
//   }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterVisibility = new BehaviorSubject<boolean>(false);
  filterVisibilityChanged$ = this.filterVisibility.asObservable();

  setFilterVisibility(visible: boolean) {
    this.filterVisibility.next(visible);
  }

  toggleFilters() {
    this.filterVisibility.next(!this.filterVisibility.value);
  }
}
