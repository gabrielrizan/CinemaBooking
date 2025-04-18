import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ChatMessage } from '../chatbot/chatbot.component';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000/api/chatbot/ask/'; // Your backend endpoint

  constructor(private http: HttpClient) {}

  chatWithAssistant(
    messages: { role: string; content: string }[],
    newMessage: string
  ): Promise<string> {
    const body = { messages, newMessage };
    return firstValueFrom(this.http.post<any>(this.apiUrl, body)).then(
      (response) => response?.reply || '(No response)'
    );
  }
}

