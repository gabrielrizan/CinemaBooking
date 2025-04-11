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
import { AddShowingComponent } from '../../admin/add-showing/add-showing.component';
import { AuthService } from '../../services/auth.service';
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
    AddShowingComponent,
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
  isAdmin: boolean = false;
  allMovies: Movie[] = [];

  constructor(
    private nowShowingService: NowShowingService,
    private authService: AuthService
  ) {
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setDate(this.maxDate.getDate() + 20);
    this.maxDate.setHours(23, 59, 59, 999);
    this.selectedDate.setHours(0, 0, 0, 0);
    this.weekStartDate = new Date(this.selectedDate);
    this.generateWeekDates(this.weekStartDate);
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
      console.log('Updated isAdmin value:', isAdmin); 
      this.setMinDateBasedOnRole();
    });

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

  setMinDateBasedOnRole(): void {
    if (this.isAdmin) {
      this.minDate = new Date(2000, 0, 1);
    } else {
      this.minDate = new Date();
      this.minDate.setHours(0, 0, 0, 0);
    }
  }

  selectDate(date: Date) {
    if (this.isDateInRange(date)) {
      this.selectedDate = new Date(date);
      let tempDate: string = this.selectedDate.toLocaleDateString();
      console.log('Selected date:', tempDate);
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
    const showtimes: { [format: string]: ShowTime[] } = {};
    const filteredShowtimes = this.showTimes.filter(
      (st) =>
        st.movie.id === movie.id &&
        st.date === dateStr &&
        st.cinema.id === this.selectedCinema.id
    );

    filteredShowtimes.forEach((st) => {
      if (!showtimes[st.format]) {
        showtimes[st.format] = [];
      }
      showtimes[st.format].push(st);
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

  showAddShowing = false; 

  showAddShowingDialog(): void {
    this.showAddShowing = true; 
  }

  hideAddShowingDialog(): void {
    this.showAddShowing = false; 
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
    relevantShowtimes.forEach((st) => uniqueMovies.set(st.movie.id, st.movie));

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
    this.showTimes.forEach((st) => uniqueMovies.set(st.movie.id, st.movie));

    this.movies = Array.from(uniqueMovies.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  // refreshes the showtimes when a new showing is added WITHOUT page refresh
  onShowingAdded(): void {
    this.nowShowingService.getAllShowTimes().subscribe((updatedShowtimes) => {
      this.allShowTimes = updatedShowtimes;
      this.updateDisplayedMovies();
    });
  }
}
