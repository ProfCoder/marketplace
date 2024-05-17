import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ProductWithRating extends Product {
  rating: number;
  ratingQuantity: number; // Add this field to the interface
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: ProductWithRating;
  selectedSize: string | null = null;
  selectedColor: { color_name: string; color_hex: string } | null = null;

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

  selectColor(color: { color_name: string; color_hex: string }): void {
    this.selectedColor = color;
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
