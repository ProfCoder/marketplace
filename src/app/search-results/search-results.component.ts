import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ProductListComponent } from '../product-list/product-list.component';
import { SearchComponent } from '../search/search.component';
import { SliderModule } from 'primeng/slider';
import { GenderList } from '../services/product.service'; 

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ProductListComponent, SearchComponent, SliderModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchValue: string = '';
  selectedSortOption: any;
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
  selectedCategory: string = '';
  filteredProducts: any[] = [];
  priceRange: number[] = [0, 1000]; 
  minPrice: number = 0; 
  maxPrice: number = 1000; 
  genderList: string[] = []; // Change type to string[]
  selectedGenders: string[] = [];

  constructor(private router: Router, private productService: ProductService) {
    this.selectedCategory = ''; 
  }
  

  ngOnInit() {
    this.includeSearchComponent = false;
    this.loadBrands();
    this.loadCategories(); 
    this.loadGenders(); 
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
    this.updateProductList();
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
    console.log('Selected sort option:', this.selectedSortOption);
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
    this.updateProductList();
  }

  onPriceFilterChange() {
    console.log('Price Range:', this.priceRange);
    this.updateProductList();
}

loadCategories() {
  this.productService.getCategoryList().subscribe((categories) => {
    this.categoryList = categories;
  });
}

onCategoryFilterChange(event: any) {
  this.updateProductList();
}

updateProductList() {
  console.log('Updating product list with price range and genders:', this.priceRange, this.selectedGenders);
  this.filteredProducts = [];
  this.productService.getInitialProductMetadata(
      9, 
      undefined,
      this.searchValue,
      this.selectedBrands,
      this.selectedGenders, 
      undefined,
      [this.selectedCategory], 
      undefined,
      undefined,
      this.priceRange 
  ).subscribe((products: any[]) => {
      this.filteredProducts = products;
  });
}
}
