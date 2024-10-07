import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterState,
} from '@angular/router';
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
import { ApiMovie, MovieCredits } from '../models/movie.model';
import { Actor } from '../models/actor.model';
import { Review } from '../models/review.model';
import { SharedService } from '../shared.service';

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
  movie: ApiMovie = {};
  credits: MovieCredits = {};
  directorName: string = 'Unknown';
  actors: Actor[] = [];
  reviews: Review[] = [];
  recommendations: ApiMovie[] = [];
  blackBarsColor: string = '#000000';
  maxContentLength = 300;
  visibleReviews = 1;
  initialVisibleReviews = 1;
  reviewsExpanded: boolean = false;
  fullCast: Actor[] = [];
  isFullCastDialogVisible: boolean = false; // Whether to show the full cast modal
  private routeSub: Subscription = new Subscription();
  mediaType: string | null = null;
  darkenedBlackBarsColor: string = '#000000';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private multiSearchService: MultiSearchService,
    private colorExtract: ColorExtractionService,
    public sharedService: SharedService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load stored details from localStorage if available

    this.sharedService.loadStoredMovieOrTvDetails();
    this.sharedService.loadStoredMovieCredits();

    this.sharedService.movieOrTvDetails$.subscribe((details) => {
      if (details) {
        this.processMovieDetails(details);
      }
    });

    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.movieId = params.get('id');
      this.mediaType = params.get('mediaType');
      if (this.movieId) {
        this.fetchMovieDetails(this.movieId, this.mediaType);
        this.fetchMovieCredits(this.movieId);
        this.fetchMovieReviews(this.movieId);
        this.fetchMovieRecommendations(this.movieId);
      } else {
        console.error('Movie ID is missing in route parameters.');
      }
    });

    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  hexToRGBA(hex: string, alpha: number): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return (
        'rgba(' +
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
        ',' +
        alpha +
        ')'
      );
    }
    throw new Error('Invalid HEX color: ' + hex);
  }

  darkenColor(hexColor: string, alpha: number): string {
    // alpha is between 0 (no darkening) and 1 (fully black)
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)) {
      c = hexColor.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      let r = (c >> 16) & 255;
      let g = (c >> 8) & 255;
      let b = c & 255;

      // Apply blending with black
      r = Math.round(r * (1 - alpha));
      g = Math.round(g * (1 - alpha));
      b = Math.round(b * (1 - alpha));

      // Ensure values are within 0-255
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));

      // Convert back to hex
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    } else {
      throw new Error('Invalid HEX color: ' + hexColor);
    }
  }

  fetchMovieDetails(movieId: string, mediaType: string | null): void {
    if (mediaType === 'movie') {
      this.multiSearchService.getMovieDetails(movieId).subscribe(
        (details) => {
          this.processMovieDetails(details);
          // Store movie details
          this.sharedService.setMovieOrTvDetails(details);
        },
        (error) => {
          console.error('Error fetching movie details:', error);
        }
      );
    } else if (mediaType === 'tv') {
      this.multiSearchService.getTvDetails(movieId).subscribe(
        (details) => {
          this.processMovieDetails(details);
          // Store TV show details
          this.sharedService.setMovieOrTvDetails(details);
        },
        (error) => {
          console.error('Error fetching TV show details:', error);
        }
      );
    }
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
        this.reviews = data.results.map((review: Review) => ({
          ...review,
          showFullContent: false,
        }));
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
      },
      (error) => {
        console.error('Error fetching movie recommendations:', error);
      }
    );
  }

  processMovieDetails(details: ApiMovie): void {
    this.movie = details;

    const imageUrl = `https://image.tmdb.org/t/p/w1280${this.movie.backdrop_path}`;

    this.colorExtract
      .getDominantColor(imageUrl)
      .then((color) => {
        this.blackBarsColor = color;

        const overlayAlpha = 0.7;
        this.darkenedBlackBarsColor = this.darkenColor(
          this.blackBarsColor,
          overlayAlpha
        );
      })
      .catch((error) => {
        console.error('Error getting dominant color:', error);
        this.blackBarsColor = '#000000';
        this.darkenedBlackBarsColor = '#000000';
      });

    this.cd.detectChanges();
  }

  processMovieCredits(credits: MovieCredits): void {
    this.credits = credits;
    this.directorName =
      credits.crew?.find((crewMember) => crewMember.job === 'Director')?.name ||
      'Unknown';
    this.actors =
      credits.cast
        ?.filter((castMember) => castMember.known_for_department === 'Acting')
        .slice(0, 10) || [];
    this.fullCast =
      credits.cast?.filter(
        (castMember) => castMember.known_for_department === 'Acting'
      ) || [];

    console.log('Director:', this.directorName);
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

  toggleReviewContent(review: Review): void {
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
