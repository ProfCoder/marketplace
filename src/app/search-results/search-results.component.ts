import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ProductListComponent } from '../product-list/product-list.component';
import { SliderModule } from 'primeng/slider';
import { Color } from '../services/color';
import { SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { Product } from '../services/product';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ProductListComponent, SliderModule, MultiSelectModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchValue: string = '';
  sortOptions = [
    { label: 'Sort By: Featured', value: 'featured' },
    { label: 'Price: Low to high', value: 'priceAsc' },
    { label: 'Price: High to low', value: 'priceDesc' }
  ];

  includeSearchComponent: boolean = false;
  brandList: string[] = [];
  categoryList: string[] = [];
  selectedBrands: string[] = [];
  selectedCategory: string = 'All';
  filteredProducts: any[] = [];
  priceRange: number[] = [0, 104];
  minPrice: number = 0;
  maxPrice: number = 104;
  genderList: string[] = [];
  selectedGenders: string[] = [];
  colorList: Color[] = [];
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  sizeList: string[] = []; 
  sizeListOptions: SelectItem[] = [];
  selectedSortOption: string = 'featured';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.selectedCategory = 'All';
  }

  ngOnInit() {
    this.route.queryParams.pipe(debounceTime(300)).subscribe(params => {
      const newSearchValue = params['query'] || "";
      const newBrands = params['brands'] ? params['brands'].split(',') : [];
      const newGenders = params['genders'] ? params['genders'].split(',') : [];
      const newCategory = params['category'] || 'All';
      const newColors = params['colors'] ? params['colors'].split(',') : [];
      const newSizes = params['sizes'] ? params['sizes'].split(',') : [];
      const newPriceRange = [params['priceMin'] ? +params['priceMin'] : 0, params['priceMax'] ? +params['priceMax'] : 1000];
      const newSortOption = params['sort'] || 'featured';

      if (this.searchValue !== newSearchValue || !this.areArraysEqual(this.selectedBrands, newBrands) ||
          !this.areArraysEqual(this.selectedGenders, newGenders) || this.selectedCategory !== newCategory ||
          !this.areArraysEqual(this.selectedColors, newColors) || !this.areArraysEqual(this.selectedSizes, newSizes) ||
          this.priceRange[0] !== newPriceRange[0] || this.priceRange[1] !== newPriceRange[1] || this.selectedSortOption !== newSortOption) {

        this.searchValue = newSearchValue;
        this.selectedBrands = newBrands;
        this.selectedGenders = newGenders;
        this.selectedCategory = newCategory;
        this.selectedColors = newColors;
        this.selectedSizes = newSizes;
        this.priceRange = newPriceRange;
        this.selectedSortOption = newSortOption;
        this.updateProductList();
      }
    });

    this.includeSearchComponent = false;
    this.loadBrands();
    this.loadCategories();
    this.loadGenders();
    this.loadMaxPrice(); 
    this.loadSizes();
    this.loadColors();
  }


  isColorDark(colorName: string): boolean {
    const brightColors = ['Beige', 'Gold', 'Lavender', 'Pink', 'Silver', 'White', 'Yellow'];
    return brightColors.includes(colorName);
  }

  areArraysEqual(arr1: any[], arr2: string | any[]) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
  }

  loadSizes() {
    this.productService.getSizesList().subscribe((sizes: string[]) => {
      this.sizeListOptions = sizes.map(size => ({ label: size, value: size }));
    });
  }

  onSizeFilterChange(event: any) {
    this.updateProductList();
  }

  toggleSelectAllSizes(event: any) {
    if (event.target.checked) {
      this.selectedSizes = this.sizeListOptions.map(option => option.value);
    } else {
      this.selectedSizes = [];
    }
    this.updateProductList();
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
    this.updateProductList();
  }

  loadBrands() {
    this.productService.getBrandList().subscribe((brands) => {
      this.brandList = brands;
    });
  }

  onSortChange(event: any) {
    this.selectedSortOption = event.value;
    this.updateProductList();
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
    console.log('Selected Price Range:', this.priceRange);
  }

  loadColors() {
    this.productService.getColorsList().subscribe((colors: Color[]) => {
      this.colorList = colors;
    });
  }

  onColorBoxClick(colorName: string) {
    const index = this.selectedColors.indexOf(colorName);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(colorName);
    }
    this.updateProductList();
  }

  loadMaxPrice() { 
    this.productService.getMaxPrice().subscribe((maxPrice) => {
      this.maxPrice = maxPrice;
      this.priceRange = [0, this.maxPrice];
    });
  }

  updateProductList() {
    const queryParams = {
      query: this.searchValue || '',
      brands: this.selectedBrands.join(','),
      genders: this.selectedGenders.join(','),
      category: this.selectedCategory,
      colors: this.selectedColors.join(','),
      sizes: this.selectedSizes.join(','),
      priceMin: this.priceRange[0],
      priceMax: this.priceRange[1],
      sort: this.selectedSortOption 
    };
  
    this.router.navigate(['/search-results'], { queryParams });
  
    this.productService.getInitialProductMetadata(
      10000, 
      undefined,
      this.searchValue,
      this.selectedBrands,
      this.selectedGenders,
      undefined,
      this.selectedCategory === 'All' ? [] : [this.selectedCategory],
      this.selectedColors,
      this.selectedSizes,
      this.priceRange,
      this.selectedSortOption 
    ).subscribe((products: any[]) => {
      this.filteredProducts = products;
    });
  }
  
}
