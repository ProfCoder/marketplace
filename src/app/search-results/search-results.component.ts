import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { debounceTime, switchMap } from 'rxjs/operators';
import { FilterService } from '../services/filter.service';

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
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to high', value: 'priceAsc' },
    { label: 'Price: High to low', value: 'priceDesc' }
  ];

  includeSearchComponent: boolean = false;
  brandList: string[] = [];
  categoryList: string[] = [];
  selectedBrands: string[] = [];
  selectedCategory: string = 'All';
  filteredProducts: any[] = [];
  priceRange: number[] = [0, 1000];
  maxPrice: number = 1000;
  minPrice: number = 0;
  genderList: string[] = [];
  selectedGenders: string[] = [];
  colorList: Color[] = [];
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  sizeList: string[] = [];
  sizeListOptions: SelectItem[] = [];
  selectedSortOption: string = 'featured';
  isLoading: boolean = false;
  listViewMode: boolean = false;
  showFilters: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private filterService: FilterService // Inject the FilterService
  ) {
    this.selectedCategory = 'All';
  }

  ngOnInit() {
    this.route.queryParams.pipe(debounceTime(300), switchMap(params => {
      const newSearchValue = params['query'] || "";
      const newBrands = params['brands'] ? params['brands'].split(',') : [];
      const newGenders = params['genders'] ? params['genders'].split(',') : [];
      const newCategory = params['category'] || 'All';
      const newColors = params['colors'] ? params['colors'].split(',') : [];
      const newSizes = params['sizes'] ? params['sizes'].split(',') : [];
      const newPriceRange = [params['priceMin'] ? +params['priceMin'] : this.minPrice, params['priceMax'] ? +params['priceMax'] : this.maxPrice];
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

      return this.productService.productMetadata;
    })
    ).subscribe(() => {
      this.updateProductList();
    });

    this.includeSearchComponent = false;
    this.loadBrands();
    this.loadCategories();
    this.loadGenders();
    this.loadMaxPrice();
    this.loadSizes();
    this.loadColors();

    this.filterService.filterVisibilityChanged$.subscribe(visible => {
      this.showFilters = visible;
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    this.filterService.setFilterVisibility(this.showFilters);
  }

  updateUrlParams() {
    const queryParams = {
      query: this.searchValue || null,
      brands: this.selectedBrands.length ? this.selectedBrands.join(',') : null,
      genders: this.selectedGenders.length ? this.selectedGenders.join(',') : null,
      category: this.selectedCategory !== 'All' ? this.selectedCategory : null,
      colors: this.selectedColors.length ? this.selectedColors.join(',') : null,
      sizes: this.selectedSizes.length ? this.selectedSizes.join(',') : null,
      priceMin: this.priceRange[0] !== this.minPrice ? this.priceRange[0] : null,
      priceMax: this.priceRange[1] !== this.maxPrice ? this.priceRange[1] : null,
      sort: this.selectedSortOption !== 'featured' ? this.selectedSortOption : null
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
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
    this.updateUrlParams();
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
    this.updateUrlParams();
    this.updateProductList();
  }

  loadBrands() {
    this.productService.getBrandList().subscribe((brands) => {
      this.brandList = brands;
    });
  }

  onSortChange(event: any) {
    this.selectedSortOption = event.value;
    this.updateUrlParams();
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
    this.updateUrlParams();
    this.updateProductList();
  }

  onPriceFilterChange() {
    this.updateUrlParams();
    this.updateProductList();
  }

  loadCategories() {
    this.productService.getCategoryList().subscribe((categories) => {
      this.categoryList = ['All', ...categories];
    });
  }

  onCategoryFilterChange(event: any) {
    this.updateUrlParams();
    this.updateProductList();
  }

  loadColors() {
    this.productService.getColorsList().subscribe((colors: Color[]) => {
      this.colorList = colors;
    });
  }

  resetFilters() {
    this.selectedBrands = [];
    this.selectedCategory = 'All';
    this.selectedGenders = [];
    this.selectedColors = [];
    this.selectedSizes = [];
    this.priceRange = [0, this.maxPrice];
    this.selectedSortOption = 'featured';

    this.updateUrlParams();
    this.updateProductList();
  }

  onColorBoxClick(colorName: string) {
    const index = this.selectedColors.indexOf(colorName);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(colorName);
    }
    this.updateUrlParams();
    this.updateProductList();
  }


  loadMaxPrice() {
    this.productService.getMaxPrice().subscribe((maxPrice) => {
      this.maxPrice = Math.ceil(maxPrice);
      this.priceRange = [this.minPrice, this.maxPrice];
      this.updateProductList();
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

    this.isLoading = true;

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
      this.priceRange,
      this.selectedSortOption
    ).subscribe((products: any[]) => {
      this.filteredProducts = products;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }
}
