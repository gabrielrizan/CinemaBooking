import { Component, ViewEncapsulation, OnInit } from '@angular/core';
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
import {
  Cinema,
  Movie,
  ShowTime,
  NowShowingService,
} from '../../services/now-showing.service';
import { forkJoin } from 'rxjs';

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
export class NowShowingComponent implements OnInit {
  selectedDate: Date = new Date();
  minDate: Date = new Date();
  maxDate: Date = new Date();
  dialogVisible: boolean = false;
  selectedMovie: Movie | null = null;
  selectedCinema!: Cinema;
  weekDates: Date[] = [];
  weekStartDate: Date = new Date();
  cinemas: Cinema[] = [];
  movies: Movie[] = [];
  showTimes: ShowTime[] = [];
  allShowTimes: ShowTime[] = [];

  constructor(private nowShowingService: NowShowingService) {
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setDate(this.maxDate.getDate() + 20);
    this.maxDate.setHours(23, 59, 59, 999);
    this.selectedDate.setHours(0, 0, 0, 0);
    this.weekStartDate = new Date(this.selectedDate);
    this.generateWeekDates(this.weekStartDate);
  }

  ngOnInit(): void {
    forkJoin({
      cinemas: this.nowShowingService.getCinemas(),
      showtimes: this.nowShowingService.getAllShowTimes(),
    }).subscribe({
      next: (result) => {
        this.cinemas = result.cinemas;
        this.allShowTimes = result.showtimes;
        if (this.cinemas.length > 0) {
          this.selectedCinema = this.cinemas[0];
          this.updateDisplayedMovies();
        }
      },
      error: (error) => console.error('Error fetching initial data:', error),
    });
  }

  selectDate(date: Date) {
    if (this.isDateInRange(date)) {
      this.selectedDate = new Date(date);
      this.selectedDate.setHours(0, 0, 0, 0);
      this.updateDisplayedMovies();
    }
  }

  generateWeekDates(startDate: Date) {
    this.weekDates = [];
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      date.setHours(0, 0, 0, 0);
      this.weekDates.push(date);
    }
  }

  previousWeek() {
    const newStart = new Date(this.weekStartDate);
    newStart.setDate(newStart.getDate() - 7);
    newStart.setHours(0, 0, 0, 0);
    if (newStart >= this.minDate) {
      this.weekStartDate = newStart;
      this.generateWeekDates(newStart);
    }
  }

  nextWeek() {
    const newStart = new Date(this.weekStartDate);
    newStart.setDate(newStart.getDate() + 7);
    this.weekStartDate = newStart;
    this.generateWeekDates(newStart);
  }

  onCalendarSelect(date: Date) {
    this.selectedDate = date;
    this.weekStartDate = new Date(date);
    this.weekStartDate.setDate(date.getDate() - date.getDay());
    this.generateWeekDates(this.weekStartDate);
  }

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

  getShowtimesForMovie(movie: Movie): { [format: string]: string[] } {
    const dateStr = this.selectedDate.toISOString().split('T')[0];
    const showtimes: { [format: string]: string[] } = {};

    // Filter showtimes for selected movie, date, and cinema
    const filteredShowtimes = this.showTimes.filter(
      (st) =>
        st.movie.id === movie.id &&
        st.date === dateStr &&
        st.cinema.id === this.selectedCinema.id
    );

    // Group by format
    filteredShowtimes.forEach((st) => {
      if (!showtimes[st.format]) {
        showtimes[st.format] = [];
      }
      showtimes[st.format].push(st.time);
    });

    return showtimes;
  }

  getMovieFormats(movie: Movie): string[] {
    const formats = new Set<string>();
    this.showTimes
      .filter((st) => st.movie.id === movie.id)
      .forEach((st) => formats.add(st.format));
    return Array.from(formats);
  }

  isSelectedDate(date: Date): boolean {
    return (
      date.getFullYear() === this.selectedDate.getFullYear() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getDate() === this.selectedDate.getDate()
    );
  }

  canGoBack(): boolean {
    const newStart = new Date(this.weekStartDate);
    newStart.setDate(newStart.getDate() - 7);
    newStart.setHours(0, 0, 0, 0);
    return newStart >= this.minDate;
  }

  canGoForward(): boolean {
    return true;
  }

  canSelectDate(date: Date): boolean {
    const startOfDate = new Date(date);
    startOfDate.setHours(0, 0, 0, 0);

    const startOfMinDate = new Date(this.minDate);
    startOfMinDate.setHours(0, 0, 0, 0);

    const startOfMaxDate = new Date(this.maxDate);
    startOfMaxDate.setHours(0, 0, 0, 0);

    return startOfDate >= startOfMinDate && startOfDate <= startOfMaxDate;
  }

  onCinemaChange(cinema: Cinema): void {
    this.selectedCinema = cinema;
    this.updateDisplayedMovies();
  }

  isDateInRange(date: Date): boolean {
    const startOfDate = new Date(date);
    startOfDate.setHours(0, 0, 0, 0);

    const startOfMinDate = new Date(this.minDate);
    startOfMinDate.setHours(0, 0, 0, 0);

    const startOfMaxDate = new Date(this.maxDate);
    startOfMaxDate.setHours(0, 0, 0, 0);

    return startOfDate >= startOfMinDate && startOfDate <= startOfMaxDate;
  }

  getMoviesForSelectedCinema(): Movie[] {
    if (!this.selectedCinema || !this.showTimes) return [];

    const dateStr = this.selectedDate.toISOString().split('T')[0];

    // Filter showtimes for selected date and cinema
    const relevantShowtimes = this.showTimes.filter(
      (showtime) =>
        showtime.cinema.id === this.selectedCinema.id &&
        showtime.date === dateStr
    );

    // Get unique movies from filtered showtimes
    const uniqueMovies = new Map<number, Movie>();
    relevantShowtimes.forEach((st) => uniqueMovies.set(st.movie.id, st.movie));

    return Array.from(uniqueMovies.values());
  }

  updateDisplayedMovies(): void {
    const dateStr = this.selectedDate.toISOString().split('T')[0];

    // Filter showtimes for selected date and cinema
    this.showTimes = this.allShowTimes.filter(
      (showtime) =>
        showtime.cinema.id === this.selectedCinema.id &&
        showtime.date === dateStr
    );

    // Get unique movies from filtered showtimes
    const uniqueMovies = new Map<number, Movie>();
    this.showTimes.forEach((st) => uniqueMovies.set(st.movie.id, st.movie));
    this.movies = Array.from(uniqueMovies.values());
  }
}
