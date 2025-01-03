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
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';

interface Cinema {
  id: string;
  name: string;
  city: string;
  address: string;
}

interface Movie {
  title: string;
  poster: string;
  showtimes: {
    [cinemaId: string]: {
      [date: string]: {
        [format: string]: string[];
      };
    };
  };
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
    MessageModule,
    PanelModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    OverlayPanelModule,
  ],
  templateUrl: './now-showing.component.html',
  styleUrls: ['./now-showing.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NowShowingComponent {
  selectedDate: Date = new Date();
  minDate: Date = new Date();
  maxDate: Date = new Date();
  dialogVisible: boolean = false;
  selectedMovie: Movie | null = null;
  selectedCinema: Cinema;
  weekDates: Date[] = [];
  weekStartDate: Date = new Date();

  cinemas: Cinema[] = [
    {
      id: 'buc-1',
      name: 'Bucharest Mall',
      city: 'Bucharest',
      address: 'Bucharest Mall, Str. Mihai Bravu 2-4',
    },
    {
      id: 'cluj-1',
      name: 'Cluj Iulius',
      city: 'Cluj-Napoca',
      address: 'Iulius Mall, Str. Alexandru Vaida Voevod 53B',
    },
  ];

  constructor() {
    this.minDate = new Date(); // Today
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 15);
    this.selectedDate = new Date();
    this.selectedCinema = this.cinemas[0];
    this.generateWeekDates(new Date());
  }

  selectDate(date: Date) {
    this.selectedDate = date;
  }

  generateWeekDates(startDate: Date) {
    this.weekDates = [];
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      this.weekDates.push(date);
    }
  }

  previousWeek() {
    const newStart = new Date(this.weekStartDate);
    newStart.setDate(newStart.getDate() - 7);
    if (newStart >= this.minDate) {
      this.weekStartDate = newStart;
      this.generateWeekDates(newStart);
    }
  }

  nextWeek() {
    const newStart = new Date(this.weekStartDate);
    newStart.setDate(newStart.getDate() + 7);
    const weekEnd = new Date(newStart);
    weekEnd.setDate(newStart.getDate() + 6);

    if (weekEnd <= this.maxDate) {
      this.weekStartDate = newStart;
      this.generateWeekDates(newStart);
    }
  }

  onCalendarSelect(date: Date) {
    this.selectedDate = date;
    this.weekStartDate = new Date(date);
    this.weekStartDate.setDate(date.getDate() - date.getDay());
    this.generateWeekDates(this.weekStartDate);
  }

  isSelectedDate(date: Date): boolean {
    return date.toDateString() === this.selectedDate.toDateString();
  }

  canGoBack(): boolean {
    const newStart = new Date(this.weekStartDate);
    newStart.setDate(newStart.getDate() - 7);
    return newStart >= this.minDate;
  }

  canGoForward(): boolean {
    const lastDayOfNextWeek = new Date(this.weekStartDate);
    lastDayOfNextWeek.setDate(lastDayOfNextWeek.getDate() + 13); // Current week end + 7 days
    return lastDayOfNextWeek <= this.maxDate;
  }

  movies: Movie[] = [
    {
      title: '200% Wolf',
      poster:
        'https://www.cinemacity.ro/xmedia-cw/repo/feats/posters/6705D2R.jpg',
      showtimes: {
        'buc-1': {
          [new Date().toISOString().split('T')[0]]: {
            '2D': ['10:30', '13:00', '15:30'],
            '3D': ['12:00', '14:30', '17:00'],
          },
          '2024-03-20': {
            '2D': ['11:30', '14:00', '16:30'],
            '3D': ['13:00', '15:30', '18:00'],
          },
        },
        'cluj-1': {
          [new Date().toISOString().split('T')[0]]: {
            '2D': ['11:00', '13:30', '16:00'],
            '3D': ['12:30', '15:00', '17:30'],
          },
          '2024-03-20': {
            '2D': ['10:00', '12:30', '15:00'],
            '3D': ['11:30', '14:00', '16:30'],
          },
        },
      },
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
      showtimes: {
        'buc-1': {
          '2024-01-01': {
            '2D': ['10:00', '12:30', '15:00'],
            '3D': ['11:30', '14:00', '16:30'],
          },
          '2024-12-31': {
            '2D': ['10:30', '14:00', '17:30', '21:00'],
            '3D': ['12:00', '15:30', '19:00'],
          },
        },
      },
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
      showtimes: {
        'buc-1': {
          '2024-03-19': {
            '2D': ['10:30', '13:00', '15:30'],
            '3D': ['12:00', '14:30', '17:00'],
          },
          '2024-03-20': {
            '2D': ['11:30', '14:00', '16:30'],
            '3D': ['13:00', '15:30', '18:00'],
          },
        },
      },
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
      showtimes: {
        'buc-1': {
          '2024-03-19': {
            '2D': ['10:30', '13:00', '15:30'],
            '3D': ['12:00', '14:30', '17:00'],
          },
          '2024-03-20': {
            '2D': ['11:30', '14:00', '16:30'],
            '3D': ['13:00', '15:30', '18:00'],
          },
        },
      },
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
      showtimes: {
        'buc-1': {
          '2024-03-19': {
            '2D': ['10:30', '13:00', '15:30'],
            '3D': ['12:00', '14:30', '17:00'],
          },
          '2024-03-20': {
            '2D': ['11:30', '14:00', '16:30'],
            '3D': ['13:00', '15:30', '18:00'],
          },
        },
      },
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

  getShowtimesForDate(movie: Movie, date: Date): { [key: string]: string[] } {
    const dateStr = date.toISOString().split('T')[0];

    // Check if showtimes exist for selected cinema and date
    if (!movie.showtimes[this.selectedCinema.id]?.[dateStr]) {
      const emptyShowtimes: { [key: string]: string[] } = {};
      movie.format.forEach((format) => {
        emptyShowtimes[format] = [];
      });
      return emptyShowtimes;
    }

    return movie.showtimes[this.selectedCinema.id][dateStr];
  }

  onCinemaChange(cinema: Cinema) {
    this.selectedCinema = cinema;
  }
}
