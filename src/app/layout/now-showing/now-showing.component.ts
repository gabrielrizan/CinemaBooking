import { Component } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-now-showing',
  standalone: true,
  imports: [CardModule, DividerModule, BadgeModule, CommonModule],
  templateUrl: './now-showing.component.html',
  styleUrl: './now-showing.component.css',
})
export class NowShowingComponent {
  movies: Movie[] = [
    {
      title: '200% Wolf',
      poster:
        'https://www.cinemacity.ro/xmedia-cw/repo/feats/posters/6705D2R.jpg',
      showtimes: ['15:40', '18:00'],
      format: '2D',
      runtime: 98,
      genre: 'Animație',
      rating: 'AG',
      languageInfo: 'GR:(DUB :RO)',
    },
    {
      title: 'Anul Nou Care N-a Fost',
      poster: 'path/to/another-movie-poster.jpg',
      showtimes: ['18:20', '20:30'],
      format: '2D',
      runtime: 138,
      genre: 'Comedie, Dramă',
      rating: 'AP 12',
      languageInfo: 'Limba nativă:RO:(FĂRĂ SUBTITRĂRI)',
    },
  ];
}
