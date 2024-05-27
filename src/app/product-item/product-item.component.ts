import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../services/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProductItemComponent implements OnInit, OnChanges {
  @Input() product!: Product;
  @Input() selectedColors: string[] = [];
  @Input() listViewMode: boolean = false;
  productImages: string[] = []; 

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.updateProductImage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedColors'] || changes['product']) {
      this.updateProductImage();
    }
  }

  updateProductImage() {
    if (this.selectedColors.length > 0) {
      this.productImages = this.selectedColors.map(color => 
        this.productService.getProductImageByColor(this.product, [color])
      );
    } else if (this.product.colors.length > 0) {
      this.productImages = [this.productService.getProductImageByColor(this.product, [this.product.colors[0].color_name])];
    } else {
      this.productImages = ['./assets/products/images/10009.jpg'];
    }
  }
}
