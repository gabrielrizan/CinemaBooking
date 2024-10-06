import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { TruncatePipe } from '../truncate.pipe';
import { RouterModule, Router } from '@angular/router';
import { HomepageMovie } from '../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ImageModule,
    TruncatePipe,
    RouterModule,
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
})
export class MovieCardComponent {
  constructor(private router: Router) {
    this.router = router;
  }

  wordLimit = 3000;
  isExpanded = true;
  showDetails = false;

  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

  watchTrailer() {
    // Implement watch trailer logic here
    console.log('Watch trailer clicked for', this.movie.title);
  }

  buyTicket() {
    // Implement buy ticket logic here
    console.log('Buy ticket clicked for', this.movie.title);
    // Redirect to ticket booking page
    this.router.navigate(['/tickets', this.movie.title]);
  }

  @Input() movie!: HomepageMovie;

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
    return Array(10)
      .fill(0)
      .map((x, i) => i + 1);
  }
}
