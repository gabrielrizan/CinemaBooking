import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { KnobModule } from 'primeng/knob';
import { PanelModule } from 'primeng/panel';
import { MultiSearchService } from '../multi-search.service';

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
  styleUrl: './search-card.component.css',
})
export class SearchCardComponent implements OnInit {
  @Input() movie: any;
  searchTerm: string = '';
  searchResults: any[] = [];
  isSearchActive: boolean = false;
  @Input() genres: any[] = [];
  movieOrTvDetails: any;
  duration: any = '';
  private observer!: IntersectionObserver;

  constructor(
    private multiSearchService: MultiSearchService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // this.multiSearchService.getGenres().subscribe((data) => {
    //   this.genres = data.genres;
    // });
    this.setUpIntersectionObserver();
  }

  setUpIntersectionObserver() {
    // Create a new IntersectionObserver instance
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // The card is visible in the viewport, trigger the movie/TV details request
          this.getMovieOrTvDetails(this.movie.id, this.movie.media_type);
          // Once the details are loaded, we stop observing this element
          this.observer.disconnect();
        }
      });
    });

    // Start observing the component's root element
    this.observer.observe(this.elementRef.nativeElement);
  }

  get votePercentage(): number {
    return Math.floor(this.movie.vote_average * 10);
  }

  getKnobValueColor(vote: number): string {
    if (vote >= 8.5) {
      return '#50CD7B'; // Vibrant green for the best ratings (above 8.5)
    } else if (vote >= 8) {
      return '#66FF00'; // Light green for very good ratings (8 - 8.5)
    } else if (vote >= 7) {
      return '#FFFF00'; // Yellow for good ratings (7 - 8)
    } else if (vote >= 6) {
      return '#FFCC00'; // Orange-yellow for moderate ratings (6 - 7)
    } else if (vote >= 5) {
      return '#FF9900'; // Orange for average ratings (5 - 6)
    } else if (vote >= 4) {
      return '#FF6600'; // Darker orange for below average ratings (4 - 5)
    } else if (vote >= 3) {
      return '#FF3300'; // Red-orange for poor ratings (3 - 4)
    } else if (vote >= 2) {
      return '#FF0000'; // Vibrant red for bad ratings (2 - 3)
    } else {
      return '#990000'; // Dark red for very bad ratings (below 2)
    }
  }

  getKnobRangeColor(vote: number): string {
    return 'lightgray'; // Static color for the range (can also be dynamic)
  }

  getKnobTextColor(vote: number): string {
    return 'black'; // Static color for the text (can also be dynamic)
  }

  getReleaseYear(date: string): string {
    return this.movie.release_date.split('-')[0];
  }

  getGenres(genreIds: number[]) {
    return this.genres
      .filter((genre) => genreIds.includes(genre.id))
      .map((genre) => genre.name)
      .join(', ');
  }

  getMovieOrTvDetails(id: string, mediaType: string) {
    if (mediaType === 'movie') {
      this.multiSearchService.getMovieDetails(id).subscribe((data) => {
        this.duration = data.runtime ? `${data.runtime} min` : 'N/A'; // For movies
      });
    } else if (mediaType === 'tv') {
      this.multiSearchService.getTvDetails(id).subscribe((data) => {
        this.duration = data.last_episode_to_air.runtime
          ? `~${data.last_episode_to_air.runtime} min on average`
          : 'N/A';
        console.log(data.last_episode_to_air.runtime);
      });
    }
  }
}
