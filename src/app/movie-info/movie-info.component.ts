import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared.service';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { ColorExtractionService } from '../services/color-extraction.service';
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
  credits: any = {};
  director: any[] = [];
  actors: any[] = [];
  blackBarsColor: string = '#000000'; // Default color

  constructor(
    private route: ActivatedRoute,
    private multiSearchService: MultiSearchService,
    private colorExtract: ColorExtractionService
  ) {}

  ngOnInit(): void {
    this.resetComponentState();

    // Retrieve the movieId from the route params
    this.movieId = this.route.snapshot.paramMap.get('id');
    console.log('Movie ID from route:', this.movieId);

    if (this.movieId) {
      // Fetch movie details and credits from the API
      this.fetchMovieDetails(this.movieId);
      this.fetchMovieCredits(this.movieId);
    } else {
      console.error('Movie ID is missing in route parameters.');
    }
  }

  resetComponentState(): void {
    this.movie = {};
    this.credits = {};
    this.director = [];
    this.actors = [];
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
    console.log('Actors:', this.actors);
  }
}
