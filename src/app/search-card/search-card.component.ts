import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { KnobModule } from 'primeng/knob';
import { PanelModule } from 'primeng/panel';
import { MultiSearchService } from '../multi-search.service';
import { SharedService } from '../shared.service';

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
    KnobModule,
  ],
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.css'],
})
export class SearchCardComponent implements OnInit {
  @Input() movie: any;
  @Input() movieGenres: any[] = [];
  @Input() tvGenres: any[] = [];
  credits: any = {};
  duration: string = '';
  movieDetails: any = {};
  tvDetails: any = {};
  private observer!: IntersectionObserver;

  constructor(
    private multiSearchService: MultiSearchService,
    private elementRef: ElementRef,
    private router: Router,
    private shared: SharedService
  ) {}

  ngOnInit(): void {
    this.setUpIntersectionObserver();
  }

  setUpIntersectionObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.getMovieOrTvDetails(this.movie.id, this.movie.media_type);
          this.observer.disconnect(); // Stop observing after data is fetched
        }
      });
    });

    // Start observing the component's root element
    this.observer.observe(this.elementRef.nativeElement);
  }

  getMovieOrTvDetails(id: string, mediaType: string): void {
    if (mediaType === 'movie') {
      this.multiSearchService.getMovieDetails(id).subscribe((data) => {
        this.duration = data.runtime ? `${data.runtime} min` : 'N/A';
        this.movieDetails = data;
      });
      this.multiSearchService.getMovieCredits(id).subscribe((credits) => {
        this.credits = credits;
      });
    } else if (mediaType === 'tv') {
      this.multiSearchService.getTvDetails(id).subscribe((data) => {
        this.duration = data.last_episode_to_air?.runtime
          ? `~${data.last_episode_to_air.runtime} min on average`
          : 'N/A';
        this.tvDetails = data;
      });
    }
  }

  goToMovieDetails(movieId: string): void {
    // overly complicated code because this.tvDetails || this.movieDetails doesnt work for some reason
    // this basically checks if either of the two objects is not empty
    let details = null;

    if (this.tvDetails && Object.keys(this.tvDetails).length > 0) {
      details = this.tvDetails;
    } else if (this.movieDetails && Object.keys(this.movieDetails).length > 0) {
      details = this.movieDetails;
    }

    if (!details) {
      console.log('No valid details available for navigation.');
      return;
    }

    this.shared.setCredits(this.credits); // Set the movie credits
    this.shared.setMovieOrTvDetails(details); // Set the movie/TV details
    this.router.navigate(['/movie-info', this.movie.media_type, movieId]);
    this.shared.triggerSearchBlur(); // Trigger the search blur event
  }

  get votePercentage(): number {
    return Math.floor(this.movie.vote_average * 10);
  }

  getKnobValueColor(vote: number): string {
    if (vote >= 8.5) {
      return '#50CD7B';
    } else if (vote >= 8) {
      return '#66FF00';
    } else if (vote >= 7) {
      return '#FFFF00';
    } else if (vote >= 6) {
      return '#FFCC00';
    } else if (vote >= 5) {
      return '#FF9900';
    } else if (vote >= 4) {
      return '#FF6600';
    } else if (vote >= 3) {
      return '#FF3300';
    } else if (vote >= 2) {
      return '#FF0000';
    } else {
      return '#990000';
    }
  }

  getKnobRangeColor(vote: number): string {
    return 'lightgray'; // Static color for the range (can also be dynamic)
  }

  getKnobTextColor(vote: number): string {
    return 'black'; // Static color for the text (can also be dynamic)
  }

  getReleaseYear(date: string): string {
    return this.movie.release_date ? this.movie.release_date.split('-')[0] : '';
  }

  getGenres(genreIds: number[] = []): string {
    const genres =
      this.movie.media_type === 'movie' ? this.movieGenres : this.tvGenres;

    if (!genreIds || genreIds.length === 0 || !genres) {
      return 'Unknown';
    }

    return genres
      .filter((genre) => genreIds.includes(genre.id))
      .map((genre) => genre.name)
      .join(', ');
  }
}
