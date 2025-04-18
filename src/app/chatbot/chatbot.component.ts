import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MarkdownPipe } from '../services/markdown.pipe';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    CardModule,
    DividerModule,
    AvatarModule,
    TooltipModule,
    ProgressSpinnerModule,
    MarkdownPipe
  ],
})
export class ChatbotComponent implements AfterViewChecked, OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  userInput = '';
  messages: ChatMessage[] = [];
  isLoading = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  sendMessage(): void {
    const trimmedMessage = this.userInput.trim();
    if (!trimmedMessage || this.isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date(),
    };
    this.messages.push(userMsg);

    this.isLoading = true;
    setTimeout(() => this.scrollToBottom(), 100);

    const history = this.messages.map(({ role, content }) => ({
      role,
      content,
    }));

    this.chatService
      .chatWithAssistant(history, trimmedMessage)
      .then((reply) => {
        this.messages.push({
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        });
      })
      .catch((error) => {
        console.error('Error in chatbot:', error);
        this.messages.push({
          role: 'assistant',
          content:
            'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        });
      })
      .finally(() => {
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      });

    this.userInput = '';
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [];
  }

  formatTime(date?: Date): string {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
