import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ProductListComponent } from '../product-list/product-list.component';
import { SearchComponent } from '../search/search.component';
import { SliderModule } from 'primeng/slider';
import { Color } from '../services/color';
import { SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { Product } from '../services/product';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ProductListComponent, SearchComponent, SliderModule,  MultiSelectModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchValue: string = '';
  sortOptions = [
    { label: 'Price: Low to high', value: 'priceAsc' },
    { label: 'Price: High to low', value: 'priceDesc' },
    { label: 'Avg. Customer Rate', value: 'customerRate' },
    { label: 'Newest arrivals', value: 'newestArrivals' }
  ];

  includeSearchComponent: boolean = false;
  brandList: string[] = [];
  categoryList: string[] = [];
  selectedBrands: string[] = [];
  selectedCategory: string = 'All';
  filteredProducts: any[] = [];
  priceRange: number[] = [0, 1000];
  minPrice: number = 0;
  maxPrice: number = 1000;
  genderList: string[] = [];
  selectedGenders: string[] = [];
  colorList: Color[] = [];
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  sizeList: string[] = []; 
  sizeListOptions: SelectItem[] = [];

  constructor(private router: Router, private productService: ProductService) {
    this.selectedCategory = 'All';
  }

  ngOnInit() {
    this.includeSearchComponent = false;
    this.loadBrands();
    this.loadCategories();
    this.loadGenders();
    // this.loadColors(); // Make sure loadColors is called before updateProductList
    this.loadMaxPrice(); 
    this.loadSizes();
  }

  loadSizes() {
    this.productService.getSizesList().subscribe((sizes: string[]) => {
        this.sizeListOptions = sizes.map(size => ({ label: size, value: size }));
    });
  }

  onSizeFilterChange(event: any) {
    this.updateProductList([]);
  }

  toggleSelectAllSizes(event: any) {
    if (event.target.checked) {
        this.selectedSizes = this.sizeListOptions.map(option => option.value);
    } else {
        this.selectedSizes = [];
    }
  }

  areAllSizesSelected(): boolean {
    return this.selectedSizes.length === this.sizeListOptions.length;
  }

  loadGenders() {
    this.productService.getGenderList().subscribe((genders: string[]) => {
      this.genderList = genders;
    });
  }

  onGenderFilterChange(event: any) {
    const gender = event.target.value;
    if (event.target.checked) {
      if (!this.selectedGenders.includes(gender)) {
        this.selectedGenders.push(gender);
      }
    } else {
      const index = this.selectedGenders.indexOf(gender);
      if (index > -1) {
        this.selectedGenders.splice(index, 1);
      }
    }
    this.updateProductList([]);
  }

  loadBrands() {
    this.productService.getBrandList().subscribe((brands) => {
      this.brandList = brands;
    });
  }

  onSearchClick() {
    this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue } });
  }

  onSortChange(event: any) {

  }

  onBrandFilterChange(event: any) {
    const brand = event.target.value;
    if (event.target.checked) {
      this.selectedBrands.push(brand);
    } else {
      const index = this.selectedBrands.indexOf(brand);
      if (index > -1) {
        this.selectedBrands.splice(index, 1);
      }
    }
    this.updateProductList([]);
  }

  onPriceFilterChange() {
    console.log('Price Range:', this.priceRange);
    this.updateProductList([]);
  }

  loadCategories() {
    this.productService.getCategoryList().subscribe((categories) => {
      this.categoryList = ['All', ...categories];
    });
  }

  onCategoryFilterChange(event: any) {
    this.updateProductList([]);
  }

  onColorFilterChange(color: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
  
    if (isChecked) {
      this.selectedColors.push(color);
    } else {
      this.selectedColors = this.selectedColors.filter(c => c !== color);
    }
    this.updateProductList(this.selectedColors);
  }
  
  
  
  
  loadMaxPrice() { 
    this.productService.getMaxPrice().subscribe((maxPrice) => {
      this.maxPrice = maxPrice;
      this.priceRange = [0, this.maxPrice];
    });
  }

  updateProductList(selectedColors: string[]) {
    this.productService.getInitialProductMetadata(
      9,
      undefined,
      this.searchValue,
      this.selectedBrands,
      this.selectedGenders,
      undefined,
      this.selectedCategory === 'All' ? [] : [this.selectedCategory],
      selectedColors,
      this.selectedSizes,
      this.priceRange
    ).subscribe((products: any[]) => {
      // Append new products to the existing filteredProducts array
      this.filteredProducts = this.filteredProducts.concat(products);
    });
  }
  
  
} 