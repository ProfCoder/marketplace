// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { InputTextModule } from 'primeng/inputtext';
// import { ButtonModule } from 'primeng/button';
// import { ProductService } from '../services/product.service';

// @Component({
//   selector: 'app-search',
//   standalone: true,
//   imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
//   templateUrl: './search.component.html',
//   styleUrls: ['./search.component.css']
// })
// export class SearchComponent {
//   searchValue: string = '';

//   constructor(private router: Router, private productService: ProductService) {}

//   onSearchClick() {
    
//     if (!this.searchValue.trim()) {
//       console.log('No search input provided.');
//       return;
//     }
//     console.log('Navigating with search:', this.searchValue);
//     this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue || '' } });
//   }
// }
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchValue: string = '';

  constructor(private router: Router, private productService: ProductService) {}

  onSearchClick() {
    if (!this.searchValue.trim()) {
      console.log('No search input provided.');
      return;
    }
    console.log('Navigating with search:', this.searchValue);
    this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue || '' } });
  }

  onInput(event: Event) {
    const inputEvent = event as InputEvent;
    const input = event.target as HTMLInputElement;
    if (input.value.trim() && inputEvent.inputType === 'insertText') {
      this.onSearchClick();
    }
  }
}
