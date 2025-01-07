import { TestBed } from '@angular/core/testing';

import { ChatCompletionService } from './chat-completion.service';
import Groq from 'groq-sdk';

describe('ChatCompletionService', () => {
  let service: ChatCompletionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatCompletionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial chat completion state', () => {
    expect(service.chatCompletionState().message).toBe('');
  });

  it('should set chat completion state', () => {
    const mockCompletion: Groq.Chat.Completions.ChatCompletion = {
      choices: [
        {
          message: {
            content: 'Test message',
            role: 'assistant'
          },
          finish_reason: 'stop',
          index: 0,
          logprobs: null,
        }
      ],
      id: 'test-id',
      created: 0,
      model: 'test-model',
      object: 'chat.completion',
    };

    service.setChatCompletionState(mockCompletion);
    expect(service.chatCompletionState().message).toBe('Test message')
  });

  it('should compute chat completion signal', () => {
    const mockCompletion: Groq.Chat.Completions.ChatCompletion = {
      choices: [
        {
          message: {
            content: 'Another test message',
            role: 'assistant'
          },
          finish_reason: 'stop',
          index: 0,
          logprobs: null
        }
      ],
      id: 'test-id',
      created: 0,
      model: 'test-model',
      object: 'chat.completion',
    };

    service.setChatCompletionState(mockCompletion);
    expect(service.chatCompletionSignal()).toEqual({ message: 'Another test message' })
  });
});
