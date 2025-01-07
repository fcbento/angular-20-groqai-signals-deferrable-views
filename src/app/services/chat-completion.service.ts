/**
 * Service to manage the chat completion state and provide it to the components.
 * 
 * @author Felipe C. Bento
 * @version 0.0.1
 * @see ChatCompletionService
 * @public
*/

import { computed, Injectable, signal } from '@angular/core';
import Groq from 'groq-sdk';

/**
 * Defines the chat completion object.
 */

interface ChatCompletion {
  message: string
}

@Injectable({
  providedIn: 'root'
})

export class ChatCompletionService {

  /**
   * Signal to store the chat completion state and emit changes to subscribers.
  */
  public chatCompletionState = signal<ChatCompletion>({
    message: ''
  });


  /**
   * Computed property to get the chat completion signal and be consumed by subscribers.
  */
  public chatCompletionSignal = computed(() => this.chatCompletionState());

  /**
   * Sets the chat completion state with the provided completion object.
   * 
   * @param completion - The chat completion object to set the state with.bngçs]~x
  */  
  public setChatCompletionState(completion: Groq.Chat.Completions.ChatCompletion) {
    this.chatCompletionState.set({
      message: completion.choices[0]?.message?.content as string
    })
  }
}
