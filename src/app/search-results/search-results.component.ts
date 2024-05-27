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
import { ActivatedRoute } from '@angular/router';
import { FilterStateService } from '../services/filter-state.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ProductListComponent, SearchComponent, SliderModule, MultiSelectModule],
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private filterStateService: FilterStateService,
  ) {
    this.selectedCategory = 'All';
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchValue = params['query'] || "";
      this.selectedBrands = params['brands'] ? params['brands'].split(',') : [];
      this.selectedGenders = params['genders'] ? params['genders'].split(',') : [];
      this.selectedCategory = params['category'] || 'All';
      this.selectedColors = params['colors'] ? params['colors'].split(',') : [];
      this.selectedSizes = params['sizes'] ? params['sizes'].split(',') : [];
      this.priceRange = [params['priceMin'] ? +params['priceMin'] : 0, params['priceMax'] ? +params['priceMax'] : 1000];
      this.updateProductList();
  })

    this.includeSearchComponent = false;
    this.loadBrands();
    this.loadCategories();
    this.loadGenders();
    this.loadMaxPrice(); 
    this.loadSizes();
    this.loadColors();
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
    // Sorting logic here
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
    this.filterStateService.updateFilters({
      brands: this.selectedBrands,
      genders: this.selectedGenders,
      category: this.selectedCategory,
      colors: this.selectedColors,
      sizes: this.selectedSizes,
      priceMin: this.priceRange[0],
      priceMax: this.priceRange[1]
    });

    const queryParams = {
      query: this.searchValue || '',
      brands: this.selectedBrands.join(','),
      genders: this.selectedGenders.join(','),
      category: this.selectedCategory,
      colors: this.selectedColors.join(','),
      sizes: this.selectedSizes.join(','),
      priceMin: this.priceRange[0],
      priceMax: this.priceRange[1]
    };

    this.router.navigate(['/search-results'], { queryParams });

    this.productService.getInitialProductMetadata(
      9,
      undefined,
      this.searchValue,
      this.selectedBrands,
      this.selectedGenders,
      undefined,
      this.selectedCategory === 'All' ? [] : [this.selectedCategory],
      this.selectedColors,
      this.selectedSizes,
      this.priceRange
    ).subscribe((products: any[]) => {
      this.filteredProducts = products;
    });
  }
}
