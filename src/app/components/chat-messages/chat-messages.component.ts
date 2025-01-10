import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-messages',
  imports: [],
  templateUrl: './chat-messages.component.html'
})
export class ChatMessagesComponent {
  
  @Input() messages: any[] = [];

  public formatMessage(message: string): string {
    return message
      ?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      ?.replace(/\n/g, '<br>') // Replaces \n with <br>
      ?.replace(/###\s?(.*?)(\n|$)/g, '<h1>$1</h1>'); // Replaces ### with <h1> 
  }
}
