import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ CommonModule, ProductItemComponent, ButtonModule, ProgressSpinnerModule ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [];
  listViewMode = false; // Initially set to grid view
  isLoading = false;
  chunkSize = 9;
  endOfList = false;
  @ViewChild('scrollingContainer') private scrollingContainer!: ElementRef;

  constructor(private productService: ProductService) {
    this.loadInitialProducts();
  }

  loadInitialProducts() {
    this.productService.getInitialProductMetadata(this.chunkSize).subscribe((products: Product[]) => {
      this.products = products;
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
          this.isLoading = false;
          return;
        }
  
        this.products = [...this.products, ...nextProducts];
  
        if (nextProducts.length < this.chunkSize) {
          this.endOfList = true;
        }
  
        this.isLoading = false;
      },
      error => {
        console.error('Loading products error:', error);
        this.isLoading = false;
      }
    );
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }
}
