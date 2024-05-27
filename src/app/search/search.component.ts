import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../services/product.service';
import { FilterStateService } from '../services/filter-state.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchValue: string = '';

  constructor(private router: Router, private productService: ProductService, private filterStateService: FilterStateService) {}

  onSearchClick() {
    
    if (!this.searchValue.trim()) {
      console.log('No search input provided.');
      return;
    }
    console.log('Navigating with search:', this.searchValue);
    this.filterStateService.currentFilters.subscribe(filters => {
      this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue, ...filters } });
    });
  }
}
