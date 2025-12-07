import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
  AfterViewInit,
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
    MarkdownPipe,
  ],
})
export class ChatbotComponent implements OnInit, AfterViewInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  userInput = '';
  messages: ChatMessage[] = [];
  isLoading = false;
  private isNearBottom = true;

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.chatContainer.nativeElement.addEventListener('scroll', () => {
      const c = this.chatContainer.nativeElement;
      this.isNearBottom =
        c.scrollHeight - (c.scrollTop + c.clientHeight) <= 100;
    });
  }

  private scrollToBottom() {
    if (this.isNearBottom) {
      const c = this.chatContainer.nativeElement;
      c.scrollTop = c.scrollHeight;
    }
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text || this.isLoading) return;
    this.messages.push({ role: 'user', content: text, timestamp: new Date() });
    this.isLoading = true;
    const history = this.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    this.chatService
      .chatWithAssistant(history, text)
      .then((reply) => {
        this.messages.push({
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        });
        setTimeout(() => this.scrollToBottom(), 0);
      })
      .catch(() => {
        this.messages.push({
          role: 'assistant',
          content:
            'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        });
        setTimeout(() => this.scrollToBottom(), 0);
      })
      .finally(() => (this.isLoading = false));
    this.userInput = '';
  }

  onKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') this.sendMessage();
  }
  clearChat() {
    this.messages = [];
  }
  formatTime(d?: Date) {
    return d
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
  }
}
