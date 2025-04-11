import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  NowShowingService,
  SeatLayout,
} from '../../services/now-showing.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { Movie } from '../../services/now-showing.service';
import { Cinema } from '../../services/now-showing.service';
import { ShowTime } from '../../services/now-showing.service';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { format } from 'date-fns';

@Component({
  selector: 'app-add-showing',
  imports: [
    DialogModule,
    FormsModule,
    ButtonModule,
    CommonModule,
    SelectModule,
    DatePickerModule,
  ],
  templateUrl: './add-showing.component.html',
  styleUrls: ['./add-showing.component.css'],
})
export class AddShowingComponent implements OnInit {
  addShowingDialogVisible: boolean = false;
  minDate: Date = new Date();
  cinemaHalls: SeatLayout[] = [];
  @Input() visible: boolean = false;
  @Input() movies: Movie[] = [];
  @Input() cinemas: Cinema[] = [];
  @Output() showingAdded = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();
  newShowing = {
    movie: {} as Movie,
    cinema: {} as Cinema,
    date: new Date(),
    time: '',
    format: '',
    hall: '',
  };

  constructor(private nowShowingService: NowShowingService) {
    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit(): void {}

  showAddShowingDialog(): void {
    this.addShowingDialogVisible = true;
  }

  closeAddShowingDialog(): void {
    this.addShowingDialogVisible = false;
    this.closeDialog.emit();
  }

  saveNewShowing(): void {
    const showTimeToSave: ShowTime = {
      ...this.newShowing,
      date: format(this.newShowing.date, 'yyyy-MM-dd'),
    };
    console.log('showTimeToSave', showTimeToSave);
    this.nowShowingService.addShowtime(showTimeToSave).subscribe(() => {
      this.showingAdded.emit();
      this.closeAddShowingDialog();
    });
  }

  onCinemaChange(selectedCinema: Cinema): void {
    if (!selectedCinema) return;
    this.nowShowingService
      .getCinemaHallsByCinema(selectedCinema.id)
      .subscribe((halls) => {
        this.cinemaHalls = Object.values(halls);
        this.newShowing.hall = '';
      });
  }
}
