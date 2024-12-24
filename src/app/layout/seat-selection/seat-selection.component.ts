import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-seat-selection',
    imports: [CommonModule, ProgressBarModule, ToastModule],
    templateUrl: './seat-selection.component.html',
    styleUrls: ['./seat-selection.component.css'],
    providers: [MessageService]
})
export class SeatSelectionComponent {
  private toastCooldown = false; // Cooldown state to prevent spamming
  seatRows: any[][] = [];
  selectedSeats: any[] = [];
  @Input() maxSeats: number = 0; // Maximum seats allowed to select
  @Output() selectionChange = new EventEmitter<any[]>(); // Emit selected seats
  @Output() seatsSelected = new EventEmitter<string[]>();

  constructor(private messageService: MessageService) {
    // Inject MessageService here
    this.initializeSeats();
  }

  initializeSeats(): void {
    const rows = 8; // Number of rows
    const seatsPerRow = 16; // Seats per row
    const middleRowsForWheelchairs = [
      Math.floor(rows / 2) - 1,
      Math.floor(rows / 2),
    ]; // Middle rows for wheelchair seats

    for (let i = 0; i < rows; i++) {
      const row: any[] = [];
      for (let j = 0; j < seatsPerRow; j++) {
        // Skip stairs for the last row
        if (
          i < rows - 1 &&
          (j === Math.floor(seatsPerRow / 2) ||
            j === Math.floor(seatsPerRow / 2) - 1)
        ) {
          row.push(null); // Gap for stairs
        } else {
          // Add seat with default properties
          const seat = {
            label: `Row ${String.fromCharCode(65 + i)} Seat ${j + 1}`,
            reserved: Math.random() < 0.2, // Randomly reserve some seats
            vip: false,
            wheelchair: false,
          };

          // Assign VIP seats (center of penultimate and last rows)
          if (
            (i === rows - 2 || i === rows - 1) &&
            j >= seatsPerRow / 2 - 1 &&
            j <= seatsPerRow / 2
          ) {
            seat.vip = true;
          }

          // Assign wheelchair seats near the stairs in middle rows
          if (
            middleRowsForWheelchairs.includes(i) &&
            (j === Math.floor(seatsPerRow / 2) - 2 ||
              j === Math.floor(seatsPerRow / 2) + 1)
          ) {
            seat.wheelchair = true;
          }

          row.push(seat);
        }
      }
      this.seatRows.push(row);
    }
  }

  toggleSeatSelection(seat: any): void {
    if (
      this.selectedSeats.length < this.maxSeats ||
      this.selectedSeats.includes(seat)
    ) {
      const index = this.selectedSeats.indexOf(seat);
      if (index === -1) {
        this.selectedSeats.push(seat);
      } else {
        this.selectedSeats.splice(index, 1);
      }

      // Emit both events
      this.selectionChange.emit(this.selectedSeats);
      this.seatsSelected.emit(this.selectedSeats.map((seat) => seat.label));
    } else {
      this.showLimitReachedToast();
    }
  }

  showLimitReachedToast(): void {
    if (!this.toastCooldown) {
      this.toastCooldown = true; // Set cooldown to true
      this.messageService.add({
        severity: 'warn',
        summary: 'Selection Limit Reached',
        detail: `You can only select up to ${this.maxSeats} tickets.`,
      });

      // Reset cooldown after 2 seconds
      setTimeout(() => {
        this.toastCooldown = false;
      }, 2000);
    }
  }

  getRowLabel(index: number): string {
    return String.fromCharCode(65 + index); // Convert index to A, B, C, ...
  }

  isSeatSelected(seat: any): boolean {
    return this.selectedSeats.includes(seat);
  }
}
