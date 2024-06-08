import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { CartService } from '../services/cart.service'; 
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'app-menubar',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, SearchComponent, BadgeModule],
    templateUrl: './menubar.component.html',
    styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent implements OnInit {
    cartItemCount: number = 0; 

    constructor(private router: Router, private cartService: CartService) { } 

    ngOnInit(): void {
        // This code runs after the component's been constructed.
        // The constructor (see above) should only perform lightweight operations.
        // Everything else goes here. Component needs to implement OnInit interface.
        // See https://angular.io/guide/lifecycle-hooks for more info about the component lifecycle
        this.updateCartItemCount(); 
    }

    updateCartItemCount(): void {
        this.cartItemCount = this.cartService.getTotalCartItems();   
        this.cartService.cartItemsChanged.subscribe(() => {
            this.cartItemCount = this.cartService.getTotalCartItems();
        });
    }
}
