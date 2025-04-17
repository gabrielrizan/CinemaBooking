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

interface ChatMessage {
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
  ],
})
export class ChatbotComponent implements AfterViewChecked, OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  userInput = '';
  messages: ChatMessage[] = [];
  isLoading = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Optional: Add welcome message or load previous messages
  }

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
    if (!this.userInput.trim() || this.isLoading) return;

    // Add user's message with timestamp
    this.messages.push({
      role: 'user',
      content: this.userInput,
      timestamp: new Date(),
    });

    // Set loading state
    this.isLoading = true;

    // Scroll to see the loading indicator
    setTimeout(() => this.scrollToBottom(), 100);

    // Call ChatService
    this.chatService
      .chatWithAssistant(this.userInput)
      .then((reply) => {
        // Add assistant's reply with timestamp
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
        // Ensure we scroll to the bottom after new content is added
        setTimeout(() => this.scrollToBottom(), 100);
      });

    // Clear the input field
    this.userInput = '';
  }

  // Handle Enter key press
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  // Clear chat history
  clearChat(): void {
    this.messages = [];
  }

  // Optional: Add a method to format timestamps
  formatTime(date?: Date): string {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
