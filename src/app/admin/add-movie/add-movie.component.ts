import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NowShowingService } from '../../services/now-showing.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { format } from 'date-fns'; // <-- Import date-fns here

interface AgeRatingOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    FormsModule,
    CommonModule,
    InputNumberModule,
    RatingModule,
    ChipModule,
    DropdownModule,
  ],
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css'],
})
export class AddMovieComponent {
  @Input() visible: boolean = false;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() movieAdded = new EventEmitter<void>();

  movieData = {
    title: '',
    poster: '',
    runtime: 0,
    genre: '',
    rating: '',
    ageRating: 'PG-13',
    synopsis: '',
    director: '',
    cast: '',
    trailer: 'https://www.youtube.com/watch?v=BpJYNVhGf1s',
    nowPlaying: false,
    release_date: '',
  };

  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private movieService: NowShowingService
  ) {}

  ageRatingOptions: AgeRatingOption[] = [
    { label: 'PG', value: 'PG' },
    { label: 'PG-13', value: 'PG-13' },
    { label: 'R', value: 'R' },
  ];

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.movieData.release_date) {
      this.movieData.release_date = format(
        new Date(this.movieData.release_date),
        'yyyy-MM-dd'
      );
    }

    this.isSubmitting = true;
    const payload = { ...this.movieData };

    this.movieService.addMovie(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.movieAdded.emit();
        this.onClose();
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to add movie. Please try again.';
      },
    });
  }

  onClose() {
    this.closeDialog.emit();
  }
}
