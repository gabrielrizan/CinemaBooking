import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { KnobModule } from 'primeng/knob';
import { MultiSearchService } from '../multi-search.service';
import { MovieInfoService } from '../movie-info.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [CardModule, KnobModule],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.css',
})
export class MovieInfoComponent implements OnInit {
  movieId: string | null = '';
  movie: any = {};

  constructor(
    private searchService: MultiSearchService,
    private movieInfo: MovieInfoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.movieId = params.get('id');
      if (this.movieId) {
        this.searchService.getMovieDetails(this.movieId).subscribe((data) => {
          this.movie = data;
          console.log('Movie data:', this.movie); // Log the movie object to the console
        });
      }
    });
  }
}
