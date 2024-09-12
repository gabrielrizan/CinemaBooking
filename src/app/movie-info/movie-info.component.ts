import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared.service';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';

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

  constructor(private route: ActivatedRoute, private shared: SharedService) {}

  ngOnInit(): void {
    this.resetComponentState();

    // Retrieve the movieId from the route params
    this.movieId = this.route.snapshot.paramMap.get('id');

    // Retrieve movie/TV details from the shared service
    this.shared.movieOrTvDetails$.subscribe((details) => {
      if (details) {
        this.movie = details;
        this.mediaType = details.media_type;
        console.log(
          'Retrieved movie/TV details from shared service:',
          this.movie
        );
      } else {
        console.log('No movie details available from shared service.');
      }
    });
  }

  resetComponentState(): void {
    this.movie = {};
    this.mediaType = '';
  }
}
