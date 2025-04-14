import { Component, EventEmitter, Input, Output } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeComponent } from 'angularx-qrcode';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, QRCodeComponent],
  templateUrl: './ticket-modal.component.html',
})
export class TicketModalComponent {
  @Input() visible: boolean = false;
  @Input() ticketId!: string;
  @Input() title!: string;
  @Input() date!: string;
  @Input() time!: string;
  @Input() format!: string;
  @Input() poster!: string;
  @Input() cinema!: string;
  // New input for seat details:
  @Input() seats: string[] = [];
  @Output() hide = new EventEmitter<void>();

  // Compute the data to store inside the QR code.
  get qrData(): string {
    const data = {
      ticketId: this.ticketId,
      cinema: this.cinema,
      date: this.date,
      time: this.time,
      seats: this.seats,
      format: this.format,
    };
    return JSON.stringify(data);
  }

  groupSeatsByRow(seats: string[]): Array<{ row: string; seats: string[] }> {
    const grouped: { [row: string]: string[] } = {};
    seats.forEach((seatString) => {
      const match = seatString.match(/Row\s+([A-Za-z0-9]+)\s+Seat\s+(\d+)/i);
      if (match) {
        const row = match[1].toUpperCase();
        const seatNum = match[2];
        if (!grouped[row]) grouped[row] = [];
        grouped[row].push(seatNum);
      } else {
        if (!grouped['Unknown']) grouped['Unknown'] = [];
        grouped['Unknown'].push(seatString);
      }
    });
    return Object.keys(grouped).map((row) => ({ row, seats: grouped[row] }));
  }

  async downloadTicketAsPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let y = margin;

    pdf.setFontSize(22);
    pdf.text('Movie Ticket', pageWidth / 2, y, { align: 'center' });
    y += 10;

    try {
      const corsProxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(
        this.poster
      )}`;
      const response = await fetch(corsProxyUrl);
      const blob = await response.blob();

      const base64Poster = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const imgWidth = 60;
      const imgHeight = 90;
      const x = (pageWidth - imgWidth) / 2;
      pdf.addImage(base64Poster, 'PNG', x, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    } catch (err) {
      console.warn('Failed to load poster image:', err);
    }

    pdf.setFontSize(12);
    const details = [
      `Title: ${this.title}`,
      `Date: ${this.date}`,
      `Time: ${this.time}`,
      `Cinema: ${this.cinema}`,
      `Format: ${this.format}`,
      ...this.groupSeatsByRow(this.seats).map(
        (group) => `Row ${group.row}: seats ${group.seats.join(', ')}`
      ),
      `Ticket ID: ${this.ticketId}`,
    ];
    details.forEach((line) => {
      pdf.text(line, margin, y);
      y += 8;
    });

    const qrElement = document.querySelector(
      '.my-custom-qr canvas'
    ) as HTMLCanvasElement;
    if (qrElement) {
      const qrSize = 50;
      const qrX = (pageWidth - qrSize) / 2;
      const qrImg = qrElement.toDataURL('image/png');
      pdf.addImage(qrImg, 'PNG', qrX, y + 5, qrSize, qrSize);
      y += qrSize + 15;
      pdf.setFontSize(10);
      pdf.text('Scan this code at the entrance.', pageWidth / 2, y, {
        align: 'center',
      });
    }

    pdf.save(`ticket-${this.ticketId}.pdf`);
  }
}
