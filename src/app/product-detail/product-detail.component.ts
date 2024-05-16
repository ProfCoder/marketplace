import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']  
})
export class ProductDetailComponent implements OnInit { 
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    console.log(`Product ID: ${productId}`);
    this.productService.getProductMetadata(productId).subscribe((product: Product) => {
      console.log(`Product Data: ${JSON.stringify(product)}`); 
      this.product = product;
      if (!this.product.description) {
        this.product.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      }
    }, (error) => {
      console.error('Error loading product:', error);
    });
  }
}
