import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css'],
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
