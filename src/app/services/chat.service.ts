import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Update base URL or endpoint as needed
  private apiUrl = 'http://127.0.0.1:8000/api/chatbot/ask/';

  constructor(private http: HttpClient) {}

  chatWithAssistant(message: string): Promise<string> {
    const body = { message };

    // Wrap the Observable in a Promise
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.apiUrl, body).subscribe({
        next: (response) => {
          const replyText = response?.reply || '(No response)';
          resolve(replyText);
        },
        error: (error) => {
          console.error('Chatbot error:', error);
          reject(error);
        },
      });
    });
  }
}
