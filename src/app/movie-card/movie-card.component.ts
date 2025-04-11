import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HomepageMovie } from '../models/movie.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// PrimeNG and Angular modules
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ImageModule,
    RouterModule,
    DialogModule,
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie!: HomepageMovie;

  wordLimit = 3000;
  isExpanded = true;
  showDetails = false;
  showTrailerDialog: boolean = false;

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

  watchTrailer() {
    console.log('Watch trailer clicked for', this.movie.title);
    this.showTrailerDialog = true;
  }

  buyTicket() {
    console.log('Buy ticket clicked for', this.movie.title);
    this.router.navigate(['/tickets', this.movie.title]);
  }

  seeTrailer(url: string) {
    window.open(url, '_blank');
  }

  bookNow(movieId: string) {
    console.log(`Booking tickets for movie ID: ${movieId}`);
  }

  showToggleText(): boolean {
    return this.movie.description.length > 100;
  }

  getStars(rating: number): number[] {
    return Array(10).fill(0).map((_, i) => i + 1);
  }

  getSanitizedTrailerUrl(): SafeResourceUrl {
    let url = this.movie.trailerUrl;
    if (url?.includes('youtube.com/watch')) {
      const videoIdPart = url.split('v=')[1];
      const videoId = videoIdPart ? videoIdPart.split('&')[0] : '';
      url = `https://www.youtube.com/embed/${videoId}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url || '');
  }
}
