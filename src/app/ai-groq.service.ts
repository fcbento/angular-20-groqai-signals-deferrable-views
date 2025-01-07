import { Injectable } from '@angular/core';
import Groq from "groq-sdk";
import { APIPromise } from 'groq-sdk/core.mjs';
import { defer, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { ChatCompletionMessage } from 'groq-sdk/resources/chat/completions.mjs';

const groq = new Groq({ 
  apiKey: environment.apiKey, 
  dangerouslyAllowBrowser: environment.dangerouslyAllowBrowser
});

@Injectable({
  providedIn: 'root'
})

export class AiGroqService {

  constructor() { }

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
   private getGroqChatCompletion(content: string): APIPromise<Groq.Chat.Completions.ChatCompletion> {
    return groq.chat.completions.create({
      messages: [
        {
          role: environment.role as ChatCompletionMessage['role'],
          content,
        },
      ],
      model: environment.model,
    })
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
