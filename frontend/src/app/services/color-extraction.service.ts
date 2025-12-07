import { Injectable } from '@angular/core';
import { FastAverageColor } from 'fast-average-color';

@Injectable({
  providedIn: 'root',
})
export class ColorExtractionService {
  private fac = new FastAverageColor();

  constructor() {}

  async getDominantColor(imageUrl: string): Promise<string> {
    try {
      // Create an off-screen image element
      const img = new Image();

      // Set crossOrigin to 'Anonymous' to attempt CORS-enabled image loading
      img.crossOrigin = 'Anonymous';

      img.src = imageUrl;

      // Wait for the image to load
      await img.decode();

      // Get the average color
      const color = await this.fac.getColorAsync(img);

      // Clean up the image element
      img.remove();

      return color.hex;
    } catch (error) {
      console.error('Error extracting color:', error);
      // Return a default color in case of error
      return '#000000';
    }
  }
}
