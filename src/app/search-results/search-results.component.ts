// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ProductService } from '../services/product.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DropdownModule } from 'primeng/dropdown';
// import { ProductListComponent } from '../product-list/product-list.component';
// import { SearchComponent } from '../search/search.component';

// @Component({
//   selector: 'app-search-results',
//   standalone: true,
//   imports: [CommonModule, FormsModule, DropdownModule, ProductListComponent, SearchComponent],
//   templateUrl: './search-results.component.html',
//   styleUrls: ['./search-results.component.css']
// })
// export class SearchResultsComponent implements OnInit {
//   searchValue: string = '';
//   selectedSortOption: any;
//   sortOptions = [
//     { label: 'Price: Low to high', value: 'priceAsc' },
//     { label: 'Price: High to low', value: 'priceDesc' },
//     { label: 'Avg. Customer Rate', value: 'customerRate' },
//     { label: 'Newest arrivals', value: 'newestArrivals' }
//   ];

//   includeSearchComponent: boolean = false;
//   brandList: string[] = [];
//   selectedBrands: string[] = [];
//   filteredProducts: any[] = [];

//   constructor(private router: Router, private productService: ProductService) {}

//   ngOnInit() {
//     this.includeSearchComponent = false;
//     this.loadBrands();
//   }

//   loadBrands() {
//     this.productService.getBrandList().subscribe((brands) => {
//       this.brandList = brands;
//     });
//   }

//   onSearchClick() {
//     this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue } });
//   }

//   onSortChange(event: any) {
//     console.log('Selected sort option:', this.selectedSortOption);
//   }

//   onBrandFilterChange(event: any) {
//     const brand = event.target.value;
//     if (event.target.checked) {
//       this.selectedBrands.push(brand);
//     } else {
//       const index = this.selectedBrands.indexOf(brand);
//       if (index > -1) {
//         this.selectedBrands.splice(index, 1);
//       }
//     }
//     // Trigger product list update
//     this.updateProductList();
//   }

//   // New method to update the product list
//   updateProductList() {
//     this.filteredProducts = [];
//     this.productService.getInitialProductMetadata(
//       9, // initial number of products to load
//       undefined,
//       this.searchValue,
//       this.selectedBrands
//     ).subscribe((products: any[]) => {
//       this.filteredProducts = products;
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ProductListComponent } from '../product-list/product-list.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ProductListComponent, SearchComponent],
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
  selectedBrands: string[] = [];
  filteredProducts: any[] = [];

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit() {
    this.includeSearchComponent = false;
    this.loadBrands();
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


  updateProductList() {
    this.filteredProducts = [];
    this.productService.getInitialProductMetadata(
      9, 
      undefined,
      this.searchValue,
      this.selectedBrands
    ).subscribe((products: any[]) => {
      this.filteredProducts = products;
    });
  }
}
