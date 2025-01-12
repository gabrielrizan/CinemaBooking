import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { NowShowingService } from '../../services/now-showing.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { Movie } from '../../services/now-showing.service';
import { Cinema } from '../../services/now-showing.service';
import { ShowTime } from '../../services/now-showing.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-add-showing',
  imports: [
    DialogModule,
    FormsModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './add-showing.component.html',
  styleUrl: './add-showing.component.css',
})
export class AddShowingComponent implements OnInit {
  addShowingDialogVisible: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  @Input() visible: boolean = false; // <-- link from parent
  @Input() movies: Movie[] = []; // <-- link from parent
  @Input() cinemas: Cinema[] = []; // <-- link from parent
  @Output() closeDialog = new EventEmitter<void>(); // <-- to notify parent

  newShowing = {
    movie: {} as Movie,
    cinema: {} as Cinema,
    date: new Date(),
    time: '',
    format: '',
  };

  constructor(private nowShowingService: NowShowingService) {}

  ngOnInit(): void {}

  showAddShowingDialog(): void {
    this.addShowingDialogVisible = true;
  }

  closeAddShowingDialog(): void {
    this.addShowingDialogVisible = false;
    this.closeDialog.emit(); // <-- notify parent
  }

  saveNewShowing(): void {
    const showTimeToSave: ShowTime = {
      ...this.newShowing,
      date: this.newShowing.date.toISOString().split('T')[0],
    };
    this.nowShowingService.addShowtime(showTimeToSave).subscribe(() => {
      this.closeAddShowingDialog();
    });
  }
}
