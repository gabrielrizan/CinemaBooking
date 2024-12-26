import { Component, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { RouterModule } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';

interface Movie {
  title: string;
  poster: string;
  showtimes: { [key: string]: string[] };
  format: string[];
  runtime: number;
  genre: string;
  rating: string;
  languageInfo: string;
  synopsis?: string;
  director?: string;
  cast?: string[];
  releaseDate?: string;
}

@Component({
  selector: 'app-now-showing',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    BadgeModule,
    CommonModule,
    ImageModule,
    RouterModule,
    ChipModule,
    DialogModule,
    ButtonModule,
    AccordionModule,
    TagModule,
  ],
  templateUrl: './now-showing.component.html',
  styleUrls: ['./now-showing.component.css'],
  encapsulation: ViewEncapsulation.None,
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
      synopsis:
        'A young wolf must prove himself to be 200% wolf in this animated adventure.',
      director: 'John Director',
      cast: ['Voice Actor 1', 'Voice Actor 2'],
      releaseDate: '2024-01-15',
    },
    {
      title: 'The Marvels',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/a/a9/The_Marvels_poster.jpeg',
      showtimes: { '2D': ['14:30', '17:50'], '3D': ['15:20', '18:40'] },
      format: ['2D', '3D'],
      runtime: 130,
      genre: 'Action, Sci-Fi',
      rating: 'PG-13',
      languageInfo: 'EN:(DUB :RO)',
      synopsis:
        'Carol Danvers, Monica Rambeau, and Kamala Khan team up to save the universe.',
      director: 'Nia DaCosta',
      cast: ['Brie Larson', 'Iman Vellani', 'Teyonah Parris'],
      releaseDate: '2024-02-10',
    },
    {
      title: 'Barbie',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/3/39/Barbie_2023_film_poster.jpg',
      showtimes: { '2D': ['13:00', '16:10'], '3D': ['14:50', '18:30'] },
      format: ['2D', '3D'],
      runtime: 114,
      genre: 'Comedy, Fantasy',
      rating: 'PG-13',
      languageInfo: 'EN:(DUB :RO)',
      synopsis:
        'Barbie embarks on a journey of self-discovery in the real world.',
      director: 'Greta Gerwig',
      cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera'],
      releaseDate: '2024-03-01',
    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/f/f7/Spider-Man_Across_the_Spider-Verse_poster.png',
      showtimes: { '2D': ['12:30', '16:00'], '3D': ['13:50', '17:40'] },
      format: ['2D', '3D'],
      runtime: 140,
      genre: 'Animation, Action',
      rating: 'PG',
      languageInfo: 'EN:(DUB :RO)',
      synopsis:
        'Miles Morales goes on an epic journey through the multiverse with Gwen Stacy.',
      director: 'Joaquim Dos Santos, Kemp Powers',
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
      releaseDate: '2024-03-15',
    },
    {
      title: 'Oppenheimer',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/3/32/Oppenheimer_%282023%29.png',
      showtimes: { '2D': ['16:20', '20:10'] },
      format: ['2D'],
      runtime: 180,
      genre: 'Biography, Drama',
      rating: 'R',
      languageInfo: 'EN:(SUB :RO)',
      synopsis:
        'The story of J. Robert Oppenheimer and his role in the Manhattan Project.',
      director: 'Christopher Nolan',
      cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
      releaseDate: '2024-04-05',
    },
  ];

  selectedMovie: Movie | null = null;

  showTimes(movie: Movie): string[] {
    return [...new Set(Object.values(movie.showtimes).flat())].sort();
  }

  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  dialogVisible: boolean = false;

  // methods to show/hide
  showDialog(movie: Movie) {
    this.selectedMovie = movie;
    this.dialogVisible = true;
  }

  hideDialog() {
    this.selectedMovie = null;
    this.dialogVisible = false;
  }

  getRatingClass(rating: string): string {
    switch (rating) {
      case 'AG':
        return 'bg-green-500';
      case 'AP 12':
        return 'bg-yellow-500';
      case 'N-15':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  }

  getRatingSeverity(
    rating: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (rating) {
      case 'G':
        return 'success';
      case 'PG':
        return 'info';
      case 'PG-13':
        return 'warn';
      case 'R':
        return 'danger';
      case 'NC-17':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
