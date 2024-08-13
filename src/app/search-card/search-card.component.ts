import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-search-card',
  standalone: true,
  imports: [
    PanelModule,
    FormsModule,
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.css',
})
export class SearchCardComponent {
  @Input() movie: any;
  searchTerm: string = '';
  searchResults: any[] = [];
  isSearchActive: boolean = false;
}
