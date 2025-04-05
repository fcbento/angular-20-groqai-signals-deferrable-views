import { Component, EventEmitter, Output, } from '@angular/core';
import { FormsModule, } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  imports: [
    FormsModule
  ],
  templateUrl: './chat-input.component.html'
})
export class ChatInputComponent {

  @Output() userInputMessage = new EventEmitter<string>();
  message = '';

  public sendMessage(): void {
    if (this.message) {
      this.userInputMessage.emit(this.message);
      this.message = '';
    }
  }
}
