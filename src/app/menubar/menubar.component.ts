import { Component, OnInit, HostListener } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { CartService } from '../services/cart.service'; 
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'app-menubar',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, SearchComponent, BadgeModule,  OverlayPanelModule],
    templateUrl: './menubar.component.html',
    styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent implements OnInit {
    cartItemCount: number = 0; 
    itemsRemoved: boolean = false;
    overlayVisible: boolean = false;

    constructor(private router: Router, private cartService: CartService) { } 

    toggleOverlay() {
        this.overlayVisible = !this.overlayVisible;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        const isClickInsidePopup = target.closest('.popup-container');
        if (!isClickInsidePopup) {
            this.overlayVisible = false;
        }
    }

    ngOnInit(): void {
        this.updateCartItemCount(); 

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.itemsRemoved = this.cartService.wereItemsRemoved();
                this.cartService.resetItemsRemovedFlag();
                this.overlayVisible = false; // Close overlay on navigation end
            }
        });
    }

    updateCartItemCount(): void {
        this.cartItemCount = this.cartService.getTotalCartItems();   
        this.cartService.cartItemsChanged.subscribe(() => {
            const previousCount = this.cartItemCount;
            this.cartItemCount = this.cartService.getTotalCartItems();

            if (this.cartItemCount === 0 && previousCount > 0) {
                this.itemsRemoved = true;
            } else {
                this.itemsRemoved = false;
            }
        });
    }
}
