import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TicketService } from '../../services/ticket.service';

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
export class SeatSelectionComponent implements OnInit, OnChanges {
  private readonly TOAST_COOLDOWN_DURATION = 2000;
  private toastCooldown = false;
  processedLayout: (Seat | null)[][] = [];
  selectedSeats: Seat[] = [];

  @Input() maxSeats: number = 0;
  @Input() layoutData!: SeatLayout;
  // New input property for reserved seat labels
  @Input() reservedSeats: string[] = [];
  
  @Output() selectionChange = new EventEmitter<Seat[]>();
  @Output() seatsSelected = new EventEmitter<string[]>();

  constructor(
    private messageService: MessageService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.initializeSeats();
    // Optionally mark reserved seats on init if reservedSeats is already set
    if (this.reservedSeats && this.reservedSeats.length > 0) {
      this.markSeatsAsReserved(this.reservedSeats);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservedSeats'] && this.reservedSeats) {
      this.markSeatsAsReserved(this.reservedSeats);
    }
  }

  initializeSeats(): void {
    const maxSeatsInRow = Math.max(...this.layoutData.seatsPerRow);
    this.processedLayout = this.layoutData.layout.map((row, rowIndex) => {
      const seatRow = row.map((seatData, seatIndex) => {
        if (seatData.type === 'space') {
          return null;
        }
        return {
          label: `Row ${String.fromCharCode(65 + rowIndex)} Seat ${seatIndex + 1}`,
          reserved: false,
          type: 'regular' as const,
        };
      });
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

  // Updated method to mark reserved seats
  markSeatsAsReserved(seatLabels: string[]): void {
    this.processedLayout.forEach((row) => {
      row.forEach((seat) => {
        if (seat && seatLabels.includes(seat.label)) {
          seat.reserved = true;
        }
      });
    });
  }
}
