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
  selectedCategory: string = 'All';
  filteredProducts: any[] = [];
  priceRange: number[] = [0, 1000];
  minPrice: number = 0;
  maxPrice: number = 1000;
  genderList: string[] = [];
  selectedGenders: string[] = [];
  colorList: Color[] = [];
  selectedColors: string[] = [];

  constructor(private router: Router, private productService: ProductService) {
    this.selectedCategory = 'All';
  }

  ngOnInit() {
    this.includeSearchComponent = false;
    this.loadBrands();
    this.loadCategories();
    this.loadGenders();
    this.loadColors();
    this.loadMaxPrice(); // Diamond: Load the maximum price on init
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
      this.categoryList = ['All', ...categories];
    });
  }

  onCategoryFilterChange(event: any) {
    this.updateProductList();
  }

  loadColors() {
    this.productService.getColorsList().subscribe((colors: Color[]) => {
      this.colorList = colors;
    });
  }

  onColorFilterChange(event: any, color: string) {
    if (event.target.checked) {
      this.selectedColors.push(color);
    } else {
      const index = this.selectedColors.indexOf(color);
      if (index > -1) {
        this.selectedColors.splice(index, 1);
      }
    }
    this.updateProductList();
  }

  onColorBoxClick(color: string) {
    const index = this.selectedColors.indexOf(color);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
    this.updateProductList();
  }

  loadMaxPrice() { // Diamond: Method to load the maximum price
    this.productService.getMaxPrice().subscribe((maxPrice) => {
      this.maxPrice = maxPrice;
      this.priceRange = [0, this.maxPrice];
    });
  }

  updateProductList() {
    console.log('Updating product list with price range and genders:', this.priceRange, this.selectedGenders);

    this.productService.getInitialProductMetadata(
      9,
      undefined,
      this.searchValue,
      this.selectedBrands,
      this.selectedGenders,
      undefined,
      this.selectedCategory === 'All' ? [] : [this.selectedCategory],
      this.selectedColors,
      undefined,
      this.priceRange
    ).subscribe((products: any[]) => {
      this.filteredProducts = products;
    });
  }
}
