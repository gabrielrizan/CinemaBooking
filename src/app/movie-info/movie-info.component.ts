import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared.service';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { MultiSearchService } from '../multi-search.service';

@Component({
  standalone: true,
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css'],
  imports: [ButtonModule, ChipModule, CommonModule],
})
export class MovieInfoComponent implements OnInit {
  movieId: string | null = '';
  movie: any = {};
  mediaType: string = '';
  credits: any = {};
  director: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private shared: SharedService,
    private multiSearchService: MultiSearchService
  ) {}

  ngOnInit(): void {
    this.resetComponentState();

    // Retrieve the movieId from the route params
    this.movieId = this.route.snapshot.paramMap.get('id');
    console.log('Movie ID from route:', this.movieId);

    // Retrieve movie/TV details from the shared service
    this.shared.movieOrTvDetails$.subscribe((details) => {
      if (details) {
        this.movie = details;
        this.mediaType = details.media_type;
      } else {
        console.log('No movie details available from shared service.');
      }
    });
    this.shared.movieCredits$.subscribe((credits) => {
      if (credits) {
        this.credits = credits;
        this.director = credits.crew.filter(
          (crew: any) => crew.job === 'Director'
        );
      } else {
        console.log('No movie credits available from shared service.');
      }
    });
    // this.multiSearchService
    //   .getMovieCredits(this.movieId ?? '')
    //   .subscribe((credits) => {
    //     this.credits = credits;
    //     // console.log('Movie credits:', this.credits);
    //     this.director = credits.crew.filter(
    //       (crew: any) => crew.job === 'Director'
    //     );
    //   });
  }

  resetComponentState(): void {
    this.movie = {};
    this.mediaType = '';
    this.credits = {};
    this.director = [];
  }
}
