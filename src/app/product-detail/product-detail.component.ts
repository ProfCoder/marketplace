import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { CartItem } from '../services/cart-item';
import { CartService } from '../services/cart.service';

interface ProductWithRating extends Product {
  rating: number;
  ratingQuantity: number;
}

interface Feedback {
  comment: string;
  rating: number;
  stars: number[];
  userName: string;
  userId?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageModule, ButtonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent implements OnInit {
  product!: ProductWithRating;
  selectedSize: string | null = null;
  selectedColor: { color_id: string; color_name: string; color_hex: string } | null = null;
  productImageSrc: string | null = null;
  selectedQuantity: number = 1;
  recommendedProducts: Product[] = [];
  feedbacks: Feedback[] = [];
  showScrollButton: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private cartService: CartService
  ) {
    const lastTenPresidents = [
      'Joe Biden',
      'Donald Trump',
      'Barack Obama',
      'George W. Bush',
      'Bill Clinton',
      'George H. W. Bush',
      'Ronald Reagan',
      'Jimmy Carter',
      'Gerald Ford',
      'Richard Nixon',
      'Jimmy Carter'
    ];
    // Generate 10 feedbacks
    for (let i = 1; i < 11; i++) {
      const rating = Math.ceil(Math.random() * 10);
      const comment =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      const starRating = +(rating / 2).toFixed(1);
      const stars = Array.from({ length: 5 }, (_, index) => (index < starRating ? 1 : 0));
      const userName = lastTenPresidents[i];
      const userId = `${i}`;
      this.feedbacks.push({ comment, rating, stars, userName, userId });
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const productId = params['id'];
      console.log(`Product ID: ${productId}`);
      this.productService.getProductMetadata(productId).subscribe(
        (product: Product) => {
          console.log(`Product Data: ${JSON.stringify(product)}`);
          const productWithRating: ProductWithRating = {
            ...product,
            rating: parseFloat((Math.random() * (5 - 1) + 1).toFixed(1)),
            ratingQuantity: this.getRandomInt(1500, 7500),
          };
          this.product = productWithRating;
          if (!this.product.description) {
            this.product.description =
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
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

            this.loadRecommendedProducts();
          });
        },
        (error) => {
          console.error('Error loading product:', error);
        }
      );
    });
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 0;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getUserImage(userId: string) {
    if (userId) {
      return `./assets/products/images/users/${userId}.png`;
    }
    return './assets/products/images/users/1.png';
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

  selectColor(color: { color_id: string; color_name: string; color_hex: string }): void {
    this.selectedColor = color;
    this.updateUrl();
  }

  selectColorByName(colorName: string): void {
    const color = this.product.colors.find((c) => c.color_name === colorName);
    if (color) {
      this.selectedColor = color;
    } else {
      this.selectedColor = null;
    }
  }

  onColorSelect(color: { color_id: string; color_name: string; color_hex: string }): void {
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
      const color = this.product.colors.find((c) => c.color_name === this.selectedColor?.color_name);
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
    if (!this.selectedSize || !this.selectedColor) {
      alert('Please select a size and color.');
      return;
    }
    
    const cartItem: CartItem = {
      id: this.product.id,
      color: this.selectedColor.color_id,
      colorName: this.selectedColor.color_name,
      size: this.selectedSize,
      quantity: this.selectedQuantity
    };
    
    this.cartService.addCartItem(cartItem);
    alert('Product added to cart!');
  }

  buyNow(): void {
    // Logic to buy product will be done for the next assignments
  }

  // Method to load recommended products
  loadRecommendedProducts(): void {
    const { type, category, id } = this.product;
  
    this.productService.getRecommendedProducts(type, category, id).subscribe(
      (recommendedProducts: Product[]) => {
        this.recommendedProducts = recommendedProducts.slice(0, 6);
      },
      (error) => {
        console.error('Error loading recommended products:', error);
      }
    );
  }
  

  onRecommendedProductClick(recommendedProduct: Product): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/products', recommendedProduct.id]);
  }
}
