import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MultiSearchService } from '../multi-search.service';
import { ColorExtractionService } from '../services/color-extraction.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';
import { TooltipModule } from 'primeng/tooltip';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';

@Component({
  standalone: true,
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css'],
  imports: [
    ButtonModule,
    ChipModule,
    CommonModule,
    AccordionModule,
    CarouselModule,
    TooltipModule,
    RouterModule,
    FieldsetModule,
    AvatarModule,
    CardModule,
    PanelModule,
    DialogModule,
  ],
})
export class MovieInfoComponent implements OnInit, OnDestroy {
  movieId: string | null = '';
  movie: any = {};
  credits: any = {};
  director: any[] = [];
  actors: any[] = [];
  reviews: any[] = [];
  recommendations: any[] = [];
  blackBarsColor: string = '#000000'; // Default color
  maxContentLength = 300; // Maximum length of truncated review content
  visibleReviews = 1; // Number of reviews to display by default
  initialVisibleReviews = 1; // Initial number of reviews to display
  reviewsExpanded: boolean = false; // Whether all reviews are expanded or not
  fullCast: any[] = [];
  isFullCastDialogVisible: boolean = false; // Whether to show the full cast modal
  private routeSub: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private multiSearchService: MultiSearchService,
    private colorExtract: ColorExtractionService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.movieId = params.get('id');
      console.log('Movie ID from route:', this.movieId);

      if (this.movieId) {
        this.resetComponentState();
        this.fetchMovieDetails(this.movieId);
        this.fetchMovieCredits(this.movieId);
        this.fetchMovieReviews(this.movieId);
        this.fetchMovieRecommendations(this.movieId);
      } else {
        console.error('Movie ID is missing in route parameters.');
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  resetComponentState(): void {
    this.movie = {};
    this.credits = {};
    this.director = [];
    this.actors = [];
    this.reviews = [];
    this.recommendations = [];
    this.blackBarsColor = '#000000';
    this.visibleReviews = 1;
  }

  fetchMovieDetails(movieId: string): void {
    this.multiSearchService.getMovieDetails(movieId).subscribe(
      (details) => {
        this.processMovieDetails(details);
      },
      (error) => {
        console.error('Error fetching movie details:', error);
      }
    );
  }

  fetchMovieCredits(movieId: string): void {
    this.multiSearchService.getMovieCredits(movieId).subscribe(
      (credits) => {
        this.processMovieCredits(credits);
      },
      (error) => {
        console.error('Error fetching movie credits:', error);
      }
    );
  }

  fetchMovieReviews(movieId: string): void {
    this.multiSearchService.getMovieReviews(movieId).subscribe(
      (data) => {
        // Add 'showFullContent' property to each review
        this.reviews = data.results.map((review: any) => ({
          ...review,
          showFullContent: false,
        }));
        console.log('Reviews:', this.reviews);
      },
      (error) => {
        console.error('Error fetching movie reviews:', error);
      }
    );
  }

  fetchMovieRecommendations(movieId: string): void {
    this.multiSearchService.getMovieRecommendations(movieId).subscribe(
      (data) => {
        this.recommendations = data.results;
        console.log('Recommendations:', this.recommendations);
      },
      (error) => {
        console.error('Error fetching movie recommendations:', error);
      }
    );
  }

  processMovieDetails(details: any): void {
    this.movie = details;

    // Construct the full image URL
    const imageUrl = `https://image.tmdb.org/t/p/w1280${this.movie.backdrop_path}`;

    // Extract the dominant color
    this.colorExtract
      .getDominantColor(imageUrl)
      .then((color) => {
        this.blackBarsColor = color;
        console.log('Dominant color:', this.blackBarsColor);
      })
      .catch((error) => {
        console.error('Error getting dominant color:', error);
        // Fallback color
        this.blackBarsColor = '#000000';
      });
  }

  processMovieCredits(credits: any): void {
    this.credits = credits;
    this.director = credits.crew.filter((crew: any) => crew.job === 'Director');
    this.actors = credits.cast
      .filter((cast: any) => cast.known_for_department === 'Acting')
      .slice(0, 10);
    this.fullCast = credits.cast.filter(
      (cast: any) => cast.known_for_department === 'Acting'
    );
    console.log('Actors:', this.actors);
  }

  getVoteColor(voteAverage: number): string {
    if (voteAverage >= 8.5) {
      return '#50CD7B'; // Vibrant green
    } else if (voteAverage >= 7) {
      return '#66FF00'; // Light green
    } else if (voteAverage >= 5) {
      return '#FFFF00'; // Yellow
    } else {
      return '#FF0000'; // Red
    }
  }

  getTruncatedContent(content: string, showFullContent: boolean): string {
    if (showFullContent || content.length <= this.maxContentLength) {
      return content;
    } else {
      return content.slice(0, this.maxContentLength) + '...';
    }
  }

  loadMoreReviews(): void {
    this.visibleReviews = this.reviews.length; // Show all reviews
    this.reviewsExpanded = true;
  }

  showLessReviews(): void {
    this.visibleReviews = this.initialVisibleReviews; // Show initial number of reviews
    this.reviewsExpanded = false;
  }

  toggleReviewContent(review: any): void {
    review.showFullContent = !review.showFullContent;
  }

  getAvatarUrl(avatarPath: string | null): string | undefined {
    if (!avatarPath) {
      return undefined;
    }

    let url: string;

    if (
      avatarPath.startsWith('/https://') ||
      avatarPath.startsWith('/http://')
    ) {
      // Remove the leading '/' and return the URL
      url = avatarPath.substring(1);
    } else {
      // Return the full URL to the TMDb image
      url = `https://image.tmdb.org/t/p/original${avatarPath}`;
    }

    return url;
  }

  showFullCastDialog(): void {
    this.isFullCastDialogVisible = true;
  }

  hideFullCastDialog(): void {
    this.isFullCastDialogVisible = false;
  }

  getInitials(name: string): string {
    if (!name) return '';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    else
      return (
        names[0].charAt(0).toUpperCase() +
        names[names.length - 1].charAt(0).toUpperCase()
      );
  }

  getVotePercentage(voteAverage: number): number {
    return Math.round(voteAverage * 10); // Convert score to percentage
  }

  formatNumber(value: number): string {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1) + 'B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    }
    return value.toLocaleString(); // For numbers below 1M
  }
}
