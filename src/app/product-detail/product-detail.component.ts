import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageModule } from 'primeng/image';


interface ProductWithRating extends Product {
  rating: number;
  ratingQuantity: number; // Add this field to the interface
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const productId = params['id'];
      const colorId = params['colorId'];
      console.log(`Product ID: ${productId}`);
      this.productService.getProductMetadata(productId).subscribe((product: Product) => {
        console.log(`Product Data: ${JSON.stringify(product)}`);
        // Adding random rating and rating quantity to each product
        const productWithRating: ProductWithRating = {
          ...product,
          rating: parseFloat((Math.random() * (5 - 1) + 1).toFixed(1)),
          ratingQuantity: this.getRandomInt(1500, 7500)
        };
        this.product = productWithRating;
        // Adding default description (Lorem Ipsum text) if there is no description in the product metadata
        if (!this.product.description) {
          this.product.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        }
        this.route.queryParams.subscribe((queryParams) => {
          const colorId = queryParams['color'];
          if (colorId) {
            this.selectColorById(colorId);
          } else {
            this.selectedColor = null;
          }
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
  }

  selectColor(color: { color_id: string, color_name: string, color_hex: string }): void {
    this.selectedColor = color;
  }

  selectColorById(colorId: string): void {
    const color = this.product.colors.find(c => c.color_id === colorId);
    if (color) {
      this.selectedColor = { color_id: color.color_id,color_name: color.color_name, color_hex: color.color_hex };
    } else {
      this.selectedColor = null;
    }
  }

  onColorSelect(color: { color_id: string, color_name: string, color_hex: string }): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { color: color.color_id },
      queryParamsHandling: 'merge', // keeps any other existing query parameters
    });
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
