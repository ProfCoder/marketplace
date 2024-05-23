import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  searchValue: string = '';

  constructor(private router: Router) {}

  onSearchClick() {
    this.router.navigate(['/search-results'], { queryParams: { query: this.searchValue } });
  }
}
