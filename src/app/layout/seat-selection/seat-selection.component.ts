import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

interface Seat {
  label: string;
  reserved: boolean;
  type: 'regular' | 'vip' | 'space';
}

interface SeatLayout {
  id: string;
  name: string;
  rows: number;
  layout: Array<Array<{ type: 'seat' | 'space' }>>;
  seatsPerRow: number[];
  createdAt: string;
}

@Component({
  selector: 'app-seat-selection',
  imports: [CommonModule, ProgressBarModule, ToastModule],
  templateUrl: './seat-selection.component.html',
  providers: [MessageService],
})
export class SeatSelectionComponent implements OnInit {
  private readonly TOAST_COOLDOWN_DURATION = 2000; // Cooldown duration in ms
  private toastCooldown = false;

  processedLayout: (Seat | null)[][] = [];
  selectedSeats: Seat[] = [];

  @Input() maxSeats: number = 0;
  @Input() layoutData!: SeatLayout;
  @Output() selectionChange = new EventEmitter<Seat[]>();
  @Output() seatsSelected = new EventEmitter<string[]>();

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.initializeSeats();
  }

  initializeSeats(): void {
    const maxSeatsInRow = Math.max(...this.layoutData.seatsPerRow); // Find the maximum number of seats in any row

    this.processedLayout = this.layoutData.layout.map((row, rowIndex) => {
      const seatRow = row.map((seatData, seatIndex) => {
        if (seatData.type === 'space') {
          return null; // Spaces are non-selectable placeholders
        }

        return {
          label: `Row ${String.fromCharCode(65 + rowIndex)} Seat ${
            seatIndex + 1
          }`,
          reserved: false, // Replace with actual reserved data if available
          type: 'regular' as const, // Explicitly set the type to a valid value
        };
      });

      // Add null placeholders to the right of the row to ensure alignment
      while (seatRow.length < maxSeatsInRow) {
        seatRow.push(null);
      }

      return seatRow;
    });
  }

  toggleSeatSelection(seat: Seat): void {
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

      this.selectionChange.emit(this.selectedSeats);
      this.seatsSelected.emit(this.selectedSeats.map((s) => s.label));
    } else {
      this.showLimitReachedToast();
    }
  }

  showLimitReachedToast(): void {
    if (!this.toastCooldown) {
      this.toastCooldown = true;
      this.messageService.add({
        severity: 'warn',
        summary: 'Selection Limit Reached',
        detail: `You can only select up to ${this.maxSeats} tickets.`,
      });

      setTimeout(() => {
        this.toastCooldown = false;
      }, this.TOAST_COOLDOWN_DURATION);
    }
  }

  getRowLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeats.includes(seat);
  }
}
