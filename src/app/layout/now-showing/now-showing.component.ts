import { Component } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-now-showing',
  standalone: true,
  imports: [CardModule, DividerModule, BadgeModule, CommonModule, ImageModule, RouterModule],
  templateUrl: './now-showing.component.html',
  styleUrls: ['./now-showing.component.css'],
})
export class NowShowingComponent {
  movies: Movie[] = [
    {
      title: '200% Wolf',
      poster:
        'https://www.cinemacity.ro/xmedia-cw/repo/feats/posters/6705D2R.jpg',
      showtimes: { '2D': ['15:40', '18:00'], '3D': ['16:30', '19:30'] },
      format: ['2D', '3D'],
      runtime: 98,
      genre: 'Animație',
      rating: 'AG',
      languageInfo: 'GR:(DUB :RO)',
    },
    {
      title: 'Anul Nou Care N-a Fost',
      poster: 'https://path/to/another-movie-poster.jpg',
      showtimes: { '2D': ['18:20', '20:30'], '3D': ['19:00', '21:30'] },
      format: ['2D', '3D'],
      runtime: 138,
      genre: 'Comedie, Dramă',
      rating: 'AP 12',
      languageInfo: 'Limba nativă:RO:(FĂRĂ SUBTITRĂRI)',
    },
    {
      title: 'The Great Adventure',
      poster: 'https://path/to/great-adventure-poster.jpg',
      showtimes: { '2D': ['13:00', '15:00'], '3D': ['14:30', '17:00'] },
      format: ['2D', '3D'],
      runtime: 120,
      genre: 'Aventură, Familie',
      rating: 'AP 6',
      languageInfo: 'EN:(SUB :RO)',
    },
    {
      title: 'Mystery of the Unknown',
      poster: 'https://path/to/mystery-movie-poster.jpg',
      showtimes: { '2D': ['16:00', '18:30'], '3D': ['17:45', '20:15'] },
      format: ['2D', '3D'],
      runtime: 110,
      genre: 'Mister, Thriller',
      rating: 'N-15',
      languageInfo: 'EN:(SUB :RO)',
    },
  ];
}
