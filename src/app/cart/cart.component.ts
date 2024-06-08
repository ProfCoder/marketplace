import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartItem } from '../services/cart-item';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { RouterModule } from '@angular/router';

interface ExtendedProduct extends Product {
  color: string;
  size: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})


export class CartComponent implements OnInit {
[x: string]: any;
  cartItems: CartItem[] = [];
  products: any[] = [];
  

  constructor(private cartService: CartService, private productService: ProductService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getAllCartItems();
    this.loadProductDetails();
  }

 loadProductDetails() {
    this.productService.getAllProductMetadata().subscribe(products => {
      this.cartItems.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          this.products.push({
            ...product,
            color: item.color,
            colorName: item.colorName,
            size: item.size,
            quantity: item.quantity
          } as ExtendedProduct);
        }
      });
    });
  }

  changeQuantity(product: any, change: number, event: MouseEvent) {
    event.stopPropagation();

    const index = this.products.findIndex(p => p.id === product.id && p.color === product.color);
    if (index > -1) {
      this.products[index].quantity += change;
      if (this.products[index].quantity < 1) {
        this.removeProduct(this.products[index]);
      } else {
        this.cartService.setCartItem(this.products[index]);
      }
    }
  }

  calculateTotalPrice(quantity: number, price: number): string {
    return (quantity * price).toFixed(2);
  }

  removeProduct(product: any) {
    this.products = this.products.filter(p => !(p.id === product.id && p.color === product.color && p.size === product.size));
    // this.products = [...this.products];
    this.cartService.removeCartItem(product);
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeCartItem(item);
    this.cartItems = this.cartService.getAllCartItems();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.products = [];
  }

  trackByItems(index: number, item: CartItem): any {
    return item.id + item.color;
  }

  getTotalPrice(): number {
    const total = this.products.reduce((total, product) => total + (product.quantity * product.price), 0);
    return parseFloat(total.toFixed(2));
  }

  getProductImage(product: Product): string {
    const color = product.colors.find(c => c.color_id === product['color']);
    return color ? `./assets/products/images/${color.color_id}.jpg` : './assets/images/default.jpg';
  }

  navigateToProduct(id: string) {
    window.location.href = `/product/${id}`;
  }


}