import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
    ProgressSpinnerModule
  ],
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  userInput = '';
  messages: ChatMessage[] = [];
  isLoading = false;
  
  constructor(private chatService: ChatService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) return;

    // 1) Add user's message locally
    this.messages.push({ role: 'user', content: this.userInput });
    
    // 2) Set loading state
    this.isLoading = true;
    
    // 3) Scroll to see the loading indicator
    setTimeout(() => this.scrollToBottom(), 100);

    // 4) Call ChatService
    this.chatService
      .chatWithAssistant(this.userInput)
      .then((reply) => {
        // Add assistant's reply
        this.messages.push({ role: 'assistant', content: reply });
      })
      .catch((error) => {
        console.error('Error in chatbot:', error);
        // Add error message
        this.messages.push({ 
          role: 'assistant', 
          content: 'Sorry, I encountered an error processing your request. Please try again.' 
        });
      })
      .finally(() => {
        this.isLoading = false;
      });

    // 5) Clear the input field
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
}