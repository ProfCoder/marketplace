import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageModule } from 'primeng/image';

interface ProductWithRating extends Product {
  rating: number;
  ratingQuantity: number;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDetailComponent implements OnInit {
  product!: ProductWithRating;
  selectedSize: string | null = null;
  selectedColor: { color_id: string, color_name: string; color_hex: string } | null = null;
  productImageSrc: string | null = null;
  selectedQuantity: number = 1; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const productId = params['id'];
      console.log(`Product ID: ${productId}`);
      this.productService.getProductMetadata(productId).subscribe((product: Product) => {
        console.log(`Product Data: ${JSON.stringify(product)}`);
        const productWithRating: ProductWithRating = {
          ...product,
          rating: parseFloat((Math.random() * (5 - 1) + 1).toFixed(1)),
          ratingQuantity: this.getRandomInt(1500, 7500)
        };
        this.product = productWithRating;
        if (!this.product.description) {
          this.product.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        }
  
        this.route.queryParams.subscribe((queryParams) => {
          console.log('Query Params:', queryParams);
          const colorName = queryParams['color'];
          if (colorName) {
            this.selectColorByName(colorName);
          } else if (this.product.colors.length > 0) {
            this.selectedColor = this.product.colors[0]; 
          } else {
            this.selectedColor = null;
          }
  
          const sizeParam = queryParams['size'];
          console.log('Size Param:', sizeParam);
          if (sizeParam && this.product.sizes.includes(sizeParam)) {
            this.selectedSize = sizeParam;
          } else if (this.product.sizes && this.product.sizes.length > 0) {
            this.selectedSize = this.product.sizes[0]; 
          }
          console.log('Selected Size:', this.selectedSize);
          this.updateProductImage();
        });
      }, (error) => {
        console.error('Error loading product:', error);
      });
    });
  }
  
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  formatNumberWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.updateUrl();
  }
  
  selectColor(color: { color_id: string, color_name: string, color_hex: string }): void {
    this.selectedColor = color;
    this.updateUrl();
  }

  selectColorByName(colorName: string): void {
    const color = this.product.colors.find(c => c.color_name === colorName);
    if (color) {
      this.selectedColor = color;
    } else {
      this.selectedColor = null;
    }
  }

  onColorSelect(color: { color_id: string, color_name: string, color_hex: string }): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { color: color.color_name, size: this.selectedSize },
      queryParamsHandling: 'merge',
    });
  }

  navigateToProduct(): void {
    if (this.product) {
      this.router.navigate(['/product', this.product.id]);
    }
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  onSizeChange(event: any): void {
    const selectedSize = event.target.value;
    this.selectedSize = selectedSize;
    this.updateUrl();
  }

  updateUrl(): void {
    const queryParams: any = {};
    if (this.selectedColor) {
      queryParams.color = this.selectedColor.color_name;
    }
    if (this.selectedSize) {
      queryParams.size = this.selectedSize;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  updateProductImage(): void {
    if (this.selectedColor) {
      const color = this.product.colors.find(c => c.color_name === this.selectedColor?.color_name);
      if (color) {
        this.productImageSrc = this.productService.getProductImage(color.color_id);
      }
    } else {
      this.productImageSrc = this.productService.getProductImage(this.product.id);
    }
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity > 0) {
      this.selectedQuantity--;
    }
  }

  increaseQuantity(): void {
    if (this.selectedQuantity < 20) {
      this.selectedQuantity++;
    }
  }

  getTotalPrice(): number {
    if (this.product && this.product.price) {
      return this.product.price * this.selectedQuantity;
    }
    return 0;
  }
  
  addToBasket(): void {
    // Logic to add the product will be done for the next assigments 
  }

  buyNow(): void {
    // Logic to but product will be done for the next assigments 
  }
}
