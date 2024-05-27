// import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { RouterModule } from '@angular/router';  // Import RouterModule
// import { CommonModule } from '@angular/common';  // Import CommonModule
// import { Product } from '../services/product';
// import { ProductService } from '../services/product.service';

// @Component({
//   selector: 'app-product-item',
//   templateUrl: './product-item.component.html',
//   styleUrls: ['./product-item.component.css'],
//   standalone: true,
//   imports: [CommonModule, RouterModule]  // Add RouterModule and CommonModule to imports
// })
// export class ProductItemComponent implements OnInit, OnChanges {
//   @Input() product!: Product;
//   @Input() selectedColors: string[] = [];
//   @Input() listViewMode: boolean = false;
//   productImage: string = '';

//   constructor(private productService: ProductService) {}

//   ngOnInit() {
//     this.updateProductImage();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['selectedColors'] || changes['product']) {
//       this.updateProductImage();
//     }
//   }

//   updateProductImage() {
//     if (this.selectedColors.length > 0) {
//       this.productImage = this.productService.getProductImageByColor(this.product, this.selectedColors);
//     } else if (this.product.colors.length > 0) {
//       // Show the first color initially if no color is selected
//       this.productImage = this.productService.getProductImageByColor(this.product, [this.product.colors[0].color_name]);
//     } else {
//       // Fallback to a default image
//       this.productImage = './assets/products/images/100009.jpg';
//     }
//   }
// }


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
  productImage: string = '';

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
      // Use the first selected color if multiple colors are selected
      const selectedColor = this.selectedColors[0];
      this.productImage = this.productService.getProductImageByColor(this.product, [selectedColor]);
    } else if (this.product.colors.length > 0) {
      // Show the first color initially if no color is selected
      this.productImage = this.productService.getProductImageByColor(this.product, [this.product.colors[0].color_name]);
    } else {
      // Fallback to a default image
      this.productImage = './assets/products/images/100009.jpg';
    }
  }
}
