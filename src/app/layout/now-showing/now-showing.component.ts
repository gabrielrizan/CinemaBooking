import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { Router, RouterModule } from '@angular/router';
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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import {
  Cinema,
  Movie,
  ShowTime,
  NowShowingService,
} from '../../services/now-showing.service';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../shared.service';

import { AddShowingComponent } from '../../admin/add-showing/add-showing.component';
import { AddMovieComponent } from '../../admin/add-movie/add-movie.component';

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
    AddShowingComponent,
    AddMovieComponent,
    RouterModule,
    ToastModule,
  ],
  templateUrl: './now-showing.component.html',
  styleUrls: ['./now-showing.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService], // <-- Add the MessageService provider here
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
  isAdmin: boolean = false;
  allMovies: Movie[] = [];

  showAddShowing = false;
  showAddMovie = false;

  constructor(
    private nowShowingService: NowShowingService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService
  ) {
    // Set default min & max dates
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setDate(this.maxDate.getDate() + 20);
    this.maxDate.setHours(23, 59, 59, 999);

    // Initialize selected date & week start
    this.selectedDate.setHours(0, 0, 0, 0);
    this.weekStartDate = new Date(this.selectedDate);
    this.generateWeekDates(this.weekStartDate);
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    // Watch for admin changes
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
      console.log('Updated isAdmin value:', isAdmin);
      this.setMinDateBasedOnRole();
    });

    // Fetch initial data (cinemas, showtimes, movies)
    forkJoin({
      cinemas: this.nowShowingService.getCinemas(),
      showtimes: this.nowShowingService.getAllShowTimes(),
      movies: this.nowShowingService.getMovies(),
    }).subscribe({
      next: (result) => {
        this.cinemas = result.cinemas;
        this.allShowTimes = result.showtimes;
        this.allMovies = result.movies;

        if (this.cinemas.length > 0) {
          this.selectedCinema = this.cinemas[0];
          this.updateDisplayedMovies();
        }
      },
      error: (error) => console.error('Error fetching initial data:', error),
    });
  }

  private setMinDateBasedOnRole(): void {
    if (this.isAdmin) {
      // Admin can choose dates far in the past
      this.minDate = new Date(2000, 0, 1);
    } else {
      this.minDate = new Date();
      this.minDate.setHours(0, 0, 0, 0);
    }
  }

  selectDate(date: Date) {
    if (this.isDateInRange(date)) {
      this.selectedDate = new Date(date);
      console.log('Selected date:', this.selectedDate.toLocaleDateString());
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

  onCalendarSelect(date: Date): void {
    const selectedDate = new Date(date);
    this.selectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    this.weekStartDate = new Date(this.selectedDate);
    this.weekStartDate.setDate(
      this.selectedDate.getDate() - this.selectedDate.getDay()
    );
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
      case 'PG':
        return 'bg-green-500';
      case 'PG-13':
        return 'bg-yellow-500';
      case 'R':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  }

  getShowtimesForMovie(movie: Movie): { [format: string]: ShowTime[] } {
    const dateStr = this.selectedDate.toLocaleDateString('en-CA');
    const showtimesByFormat: { [format: string]: ShowTime[] } = {};

    const filteredShowtimes = this.showTimes.filter(
      (st) =>
        st.movie.id === movie.id &&
        st.date === dateStr &&
        st.cinema.id === this.selectedCinema.id
    );

    filteredShowtimes.forEach((st) => {
      if (!showtimesByFormat[st.format]) {
        showtimesByFormat[st.format] = [];
      }
      showtimesByFormat[st.format].push(st);
    });
    return showtimesByFormat;
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
    return true; // Adjust if you have logic limiting forward navigation
  }

  canSelectDate(date: Date): boolean {
    const startOfDate = new Date(date).setHours(0, 0, 0, 0);
    const minDateMs = this.minDate.setHours(0, 0, 0, 0);
    const maxDateMs = this.maxDate.setHours(0, 0, 0, 0);

    return startOfDate >= minDateMs && startOfDate <= maxDateMs;
  }

  onCinemaChange(cinema: Cinema): void {
    this.selectedCinema = cinema;
    this.updateDisplayedMovies();
  }

  isDateInRange(date: Date): boolean {
    const startOfDate = new Date(date).setHours(0, 0, 0, 0);
    const minDateMs = this.minDate.setHours(0, 0, 0, 0);
    const maxDateMs = this.maxDate.setHours(0, 0, 0, 0);

    return startOfDate >= minDateMs && startOfDate <= maxDateMs;
  }

  showAddShowingDialog(): void {
    this.showAddShowing = true;
  }

  hideAddShowingDialog(): void {
    this.showAddShowing = false;
  }

  showAddMovieDialog(): void {
    this.showAddMovie = true;
  }

  hideAddMovieDialog(): void {
    this.showAddMovie = false;
  }

  getMoviesForSelectedCinema(): Movie[] {
    if (!this.selectedCinema || !this.showTimes) return [];

    const dateStr = this.selectedDate.toLocaleDateString('en-CA');
    const relevantShowtimes = this.showTimes.filter(
      (showtime) =>
        showtime.cinema.id === this.selectedCinema.id &&
        showtime.date === dateStr
    );

    const uniqueMovies = new Map<number, Movie>();
    relevantShowtimes.forEach((st) => {
      if (st.movie.id !== undefined) {
        uniqueMovies.set(st.movie.id, st.movie);
      }
    });

    return Array.from(uniqueMovies.values());
  }

  updateDisplayedMovies(): void {
    const dateStr = this.selectedDate.toLocaleDateString('en-CA');
    this.showTimes = this.allShowTimes.filter(
      (showtime) =>
        showtime.cinema.id === this.selectedCinema.id &&
        showtime.date === dateStr
    );

    const uniqueMovies = new Map<number, Movie>();
    this.showTimes.forEach((st) => {
      if (st.movie.id !== undefined) {
        uniqueMovies.set(st.movie.id, st.movie);
      }
    });

    this.movies = Array.from(uniqueMovies.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  onShowingAdded(): void {
    // Refresh showtimes after adding
    this.nowShowingService.getAllShowTimes().subscribe((updatedShowtimes) => {
      this.allShowTimes = updatedShowtimes;
      this.updateDisplayedMovies();
    });
  }

  onMovieAdded(): void {
    // Refresh movies after adding
    this.nowShowingService.getMovies().subscribe({
      next: (movies) => {
        this.allMovies = movies;
        this.updateDisplayedMovies();
      },
      error: (error) => console.error('Error refreshing movies:', error),
    });
  }

  handleShowtimeClick(show: ShowTime, movie: Movie, format: string): void {
    // If not authenticated, prompt login
    if (!this.authService.isTokenValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Authentication Required',
        detail: 'Please log in or sign up to book tickets.',
        life: 3000,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.sharedService.showLoginPanel();
      return;
    }

    // Else navigate to ticket booking
    const queryParams = {
      title: movie.title,
      movieId: movie.id,
      format: format,
      poster: movie.poster,
      showtime: show.id,
      date: this.selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
      cinemaId: this.selectedCinema.id,
      hall: show.hall,
      time: show.time.slice(0, -3),
      cinemaName: this.selectedCinema.name,
    };

    this.router.navigate(['/select-tickets'], { queryParams });
  }
}
