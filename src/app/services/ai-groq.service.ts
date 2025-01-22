
/**
 * This service interacts with the Groq SDK to create chat completions.
 * 
 * @author Felipe C. Bento
 * @version 0.0.1
 * @see ChatCompletionService
 * @see https://console.groq.com/docs/quickstart
 * @public
*/

import { Injectable, inject } from '@angular/core';
import Groq from "groq-sdk";
import { defer, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ChatCompletionMessage } from 'groq-sdk/resources/chat/completions.mjs';
import { ChatCompletionService } from './chat-completion.service';

/**
 * Provides methods to interact with the Groq SDK.
 * 
 * @param apiKey - API key to authenticate with the Groq service.
 * @param dangerouslyAllowBrowser - Allows the Groq SDK to run in the browser.
 * @see https://groq.com/
 */
const groq = new Groq({
  apiKey: environment.groq.apiKey,
  dangerouslyAllowBrowser: true
});

@Injectable({
  providedIn: 'root'
})

export class AiGroqService {

  /**
   * Injects the chat completion service to set the chat completion state.
  */
  private signalService = inject(ChatCompletionService)

  /**
   * Sends a user input to the Groq service and retrieves a promise with the response containing the message to be displayed.
   * 
   * This method interacts with the Groq SDK to create a chat completion request. It sends the user-provided
   * input as a message with the role of "user" and specifies the model to be used for generating the response.
   * The promise returned by this function can be used directly or wrapped in an observable for reactive handling.
   * 
   * @param content - The input string to be processed by the Groq service.
   * @returns A promise containing the chat completion result from the Groq service.
  */
  private async getGroqChatCompletion(content: string): Promise<Groq.Chat.Completions.ChatCompletion> {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: environment.groq.role as ChatCompletionMessage['role'],
          content,
        },
      ],
      model: environment.groq.model,
    })

    this.signalService.setChatCompletionState(chatCompletion)

    return chatCompletion
  }

  /** 
   * Creates an observable to get chat completions from the Groq service by passing an input string provided by the user.
   * 
   * This method wraps the promise returned by getGroqChatCompletion in an RxJS observable
   * using the `defer` operator. This ensures that the underlying promise is executed
   * only when the observable is subscribed to. Read me more about the defer method: https://rxjs.dev/api/index/function/defer  
   * 
   * @param content - The input string to be processed by the Groq service.
   * @returns An observable that emits the chat completion result or errors.
   * @see getGroqChatCompletion
  */
  public getResponse(content: string): Observable<Groq.Chat.Completions.ChatCompletion> {
    return defer(() => {
      return this.getGroqChatCompletion(content)
    })
  }
}
