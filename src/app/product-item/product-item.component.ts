import { Component, Input } from '@angular/core';
import { Product } from '../services/product';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
  @Input() product!: Product;
  @Input() listViewMode = false;
  constructor(public productService: ProductService) {}
}

