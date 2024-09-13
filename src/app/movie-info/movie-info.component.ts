import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared.service';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { ColorExtractionService } from '../services/color-extraction.service';

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
  blackBarsColor: string = '#000000'; // Default color

  constructor(
    private route: ActivatedRoute,
    private shared: SharedService,
    private colorExtract: ColorExtractionService
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
      } else {
        console.log('No movie details available from shared service.');
      }
    });

    // Retrieve movie credits
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
  }

  resetComponentState(): void {
    this.movie = {};
    this.mediaType = '';
    this.credits = {};
    this.director = [];
  }
}
