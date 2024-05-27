import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  private filters = new BehaviorSubject<any>({});
  currentFilters = this.filters.asObservable();

  constructor() {}

  updateFilters(filterState: any) {
    this.filters.next(filterState);
  }
}