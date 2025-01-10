import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { AiGroqService } from '../../services/ai-groq.service';
import { ChatCompletionService } from '../../services/chat-completion.service';
import { Subject, takeUntil } from 'rxjs';
import { ChatMessagesComponent } from '../chat-messages/chat-messages.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';

@Component({
  selector: 'app-chat-container',
  imports: [
    ChatInputComponent,
    ChatMessagesComponent,
    ChatHeaderComponent
  ],
  templateUrl: './chat-container.component.html'
})
export class ChatContainerComponent implements OnInit, OnDestroy {

  private groqService = inject(AiGroqService);
  private chatCompletionService = inject(ChatCompletionService);
  private destroy$ = new Subject<void>();

  public botMessage: string = '';
  public messages: any[] = [];

  public ngOnInit(): void {
    this.getChatCompletion();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getChatCompletion(): void {
    this.groqService.getResponse('hi')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.botMessage = this.chatCompletionService.chatCompletionSignal()?.message;
        this.setMessagesArray(this.botMessage, 'bot');
      }
    })
  }

  public getUserInputMessage(message: string): void {
    this.setMessagesArray(message, 'user');
    this.groqService.getResponse(message)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.setMessagesArray(this.chatCompletionService.chatCompletionSignal()?.message, 'bot');
      }
    })
  }

  private setMessagesArray(message: string, type: 'user' | 'bot'): void {
    this.messages.push({ message, type })
  }

}
