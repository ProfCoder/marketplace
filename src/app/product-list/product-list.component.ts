// import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ProductService } from '../services/product.service';
// import { Product } from '../services/product';
// import { ProductItemComponent } from '../product-item/product-item.component';
// import { ButtonModule } from 'primeng/button';
// import { ProgressSpinnerModule } from 'primeng/progressspinner';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { SearchComponent } from '../search/search.component';
// import { CartService } from '../services/cart.service';
// import { RouterModule } from '@angular/router'; 
// import { NavigationEnd } from '@angular/router';


// @Component({
//   selector: 'app-product-list',
//   standalone: true,
//   imports: [CommonModule, ProductItemComponent, ButtonModule, ProgressSpinnerModule, FormsModule, SearchComponent, RouterModule],
//   templateUrl: './product-list.component.html',
//   styleUrls: ['./product-list.component.css']
// })
// export class ProductListComponent implements OnChanges {
//   @Input() searchValue: string = '';
//   @Input() selectedBrands: string[] = [];
//   @Input() products: Product[] = [];
//   @Input() selectedColors: string[] = [];
//   cartItemCount: number = 0; 
//   showScrollButton: boolean = false;
//   onSearchResultsPage = false;

//   listViewMode = false; // Initially set to grid view
//   isLoading = false;
//   chunkSize = 9;
//   endOfList = false;

//   @ViewChild('scrollingContainer') private scrollingContainer!: ElementRef;

//   constructor(private productService: ProductService, private router: Router, private cartService: CartService) { 
//     this.loadInitialProducts();
//     this.updateCartItemCount(); 
//   }

//   ngOnInit(): void {
//     this.router.events.subscribe(event => {
//       if (event instanceof NavigationEnd) {
//         this.onSearchResultsPage = this.router.url.includes('search-results');
//       }
//     });
//   }
  

//   ngOnChanges(changes: SimpleChanges): void {
//     console.log('Changes detected:', changes);
//     if (changes['searchValue'] || changes['selectedBrands']) {
//       this.loadInitialProducts();
//     }
//   }

//   updateCartItemCount() {
//     this.cartItemCount = this.cartService.getTotalCartItems();
//   }

//   loadInitialProducts() {
//     this.isLoading = true;
//     console.log('Loading initial products...');
//     this.productService.getInitialProductMetadata(
//       this.chunkSize,
//       undefined,
//       this.searchValue,
//       this.selectedBrands
//     ).subscribe((products: Product[]) => {
//       this.products = products;
//       this.isLoading = false;
//       this.endOfList = products.length < this.chunkSize;
//       console.log('Products loaded:', this.products);
//     }, error => {
//       this.isLoading = false;
//       console.error('Error loading initial products:', error);
//     });
//   }

//   loadMoreProducts() {
//     if (this.isLoading || this.endOfList) {
//       return;
//     }

//     this.isLoading = true;

//     this.productService.getNextProductMetadata(this.chunkSize).subscribe(
//       (nextProducts: Product[]) => {
//         if (nextProducts.length === 0) {
//           this.endOfList = true;
//         } else {
//           this.products = [...this.products, ...nextProducts];
//           this.endOfList = nextProducts.length < this.chunkSize;
//         }
//         this.isLoading = false;
//         console.log('More products loaded:', this.products);
//       },
//       error => {
//         console.error('Error loading more products:', error);
//         this.isLoading = false;
//       }
//     );
//   }

//   scrollToTop(): void {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   // onSearchClick() {
//   //   this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue } });
//   // }

//   onSearchClick() {
//     this.onSearchResultsPage = true;
//     this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue } });
//   }
  
//   isEmptyResults(): boolean {
//     return this.products.length === 0 && this.searchValue !== '';
//   }

//   @HostListener('window:scroll', ['$event'])
//   onWindowScroll(): void {
//     const scrollTop = window.scrollY;
//     const windowHeight = window.innerHeight;
//     const documentHeight = document.body.clientHeight;
  
//     let atBottom = (scrollTop + windowHeight + 100) >= documentHeight;
  
//     if (atBottom && !this.isLoading && !this.endOfList) {
//       this.loadMoreProducts();
//     }
  
//     this.showScrollButton = scrollTop > windowHeight / 2;
//   }
  
// }


import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { CartService } from '../services/cart.service';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent, ButtonModule, ProgressSpinnerModule, FormsModule, SearchComponent, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnChanges {
  @Input() searchValue: string = '';
  @Input() selectedBrands: string[] = [];
  @Input() products: Product[] = [];
  @Input() selectedColors: string[] = [];
  cartItemCount: number = 0; 
  showScrollButton: boolean = false;
  onSearchResultsPage = false;

  listViewMode = false; // Initially set to grid view
  isLoading = false;
  chunkSize = 9;
  endOfList = false;

  @ViewChild('scrollingContainer') private scrollingContainer!: ElementRef;

  constructor(private productService: ProductService, private router: Router, private cartService: CartService) { 
    this.loadInitialProducts();
    this.updateCartItemCount();
    
    // Detect route changes and update onSearchResultsPage
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.onSearchResultsPage = this.router.url.includes('search-results');
      }
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.onSearchResultsPage = this.router.url.includes('search-results');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes);
    if (changes['searchValue'] || changes['selectedBrands']) {
      this.loadInitialProducts();
    }
  }

  updateCartItemCount() {
    this.cartItemCount = this.cartService.getTotalCartItems();
  }

  loadInitialProducts() {
    this.isLoading = true;
    console.log('Loading initial products...');
    this.productService.getInitialProductMetadata(
      this.chunkSize,
      undefined,
      this.searchValue,
      this.selectedBrands
    ).subscribe((products: Product[]) => {
      this.products = products;
      this.isLoading = false;
      this.endOfList = products.length < this.chunkSize;
      console.log('Products loaded:', this.products);
    }, error => {
      this.isLoading = false;
      console.error('Error loading initial products:', error);
    });
  }

  loadMoreProducts() {
    if (this.isLoading || this.endOfList) {
      return;
    }

    this.isLoading = true;

    this.productService.getNextProductMetadata(this.chunkSize).subscribe(
      (nextProducts: Product[]) => {
        if (nextProducts.length === 0) {
          this.endOfList = true;
        } else {
          this.products = [...this.products, ...nextProducts];
          this.endOfList = nextProducts.length < this.chunkSize;
        }
        this.isLoading = false;
        console.log('More products loaded:', this.products);
      },
      error => {
        console.error('Error loading more products:', error);
        this.isLoading = false;
      }
    );
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearchClick() {
    this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue } });
  }

  isEmptyResults(): boolean {
    return this.products.length === 0 && this.searchValue !== '';
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.clientHeight;
  
    let atBottom = (scrollTop + windowHeight + 100) >= documentHeight;
  
    if (atBottom && !this.isLoading && !this.endOfList) {
      this.loadMoreProducts();
    }
  
    this.showScrollButton = scrollTop > windowHeight / 2;
  }
}
