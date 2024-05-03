import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { ProductItemComponent } from '../product-item/product-item.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ CommonModule, ProductItemComponent ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [];
  
  constructor(private ProductService: ProductService){
    this.ProductService.getAllProductMetadata().subscribe((products: Product[]) => {
      this.products = products;
    });
  };
}
