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
  customQuantity?: boolean;
  colorName: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  products: ExtendedProduct[] = [];
  quantityOptions: number[] = Array.from({ length: 11 }, (_, i) => i); 

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
            colorName: item['colorName'],
            size: item.size,
            quantity: item.quantity,
            customQuantity: item.quantity > 10
          });
        }
      });
    });
  }

  changeQuantity(product: ExtendedProduct, event: any) {
    const newQuantity = parseInt(event.target.value);
    const index = this.products.findIndex(p => p.id === product.id && p.color === product.color && p.size === product.size);
    if (index > -1) {
      if (newQuantity === 0) {
        this.removeProduct(this.products[index]);
      } else if (newQuantity === 10) {
        this.products[index].customQuantity = true;
      } else {
        this.products[index].quantity = newQuantity;
        this.cartService.setCartItem(this.mapToCartItem(this.products[index]));
        this.products[index].customQuantity = false;
      }
    }
  }

  handleCustomQuantity(product: ExtendedProduct, event: any) {
    const newQuantity = parseInt(event.target.value);
    const index = this.products.findIndex(p => p.id === product.id && p.color === product.color && p.size === product.size);
    if (index > -1) {
      if (newQuantity > 0) {
        this.products[index].quantity = newQuantity;
        this.products[index].customQuantity = newQuantity > 10;
        this.cartService.setCartItem(this.mapToCartItem(this.products[index]));
      } else {
        this.products[index].customQuantity = false;
        this.removeProduct(this.products[index]);
      }
    }
  }

  calculateTotalPrice(quantity: number, price: number): string {
    return (quantity * price).toFixed(2);
  }

  removeProduct(product: ExtendedProduct) {
    this.products = this.products.filter(p => !(p.id === product.id && p.color === product.color && p.size === product.size));
    this.cartService.removeCartItem(this.mapToCartItem(product));
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.products = [];
  }

  trackByItems(index: number, item: ExtendedProduct): any {
    return item.id + item.color + item.size;
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

  private mapToCartItem(product: ExtendedProduct): CartItem {
    return {
      id: product.id,
      color: product.color,
      size: product.size,
      quantity: product.quantity,
      colorName: product.colorName
    };
  }
}
