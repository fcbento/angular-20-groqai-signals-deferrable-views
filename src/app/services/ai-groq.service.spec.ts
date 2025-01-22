import { TestBed } from '@angular/core/testing';
import { AiGroqService } from './ai-groq.service';
import { defer } from 'rxjs';
import { ChatCompletion } from 'groq-sdk/resources/chat/completions.mjs';
import { environment } from '../../environments/environment.development';

describe('AiGroqService', () => {
  let service: AiGroqService;

  const mockResponse: ChatCompletion = {
    id: 'test-id',
    object: 'chat.completion',
    created: Date.now(),
    model: environment.groq.model,
    choices: [
      {
        message: {
          role: 'assistant',
          content: 'Mock response content',
        },
        finish_reason: 'stop' as 'stop',
        index: 0,
        logprobs: null,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiGroqService],
    });
    service = TestBed.inject(AiGroqService);

    spyOn(service as any, 'getGroqChatCompletion').and.callFake(
      () => {
        return defer(() => Promise.resolve(mockResponse));
      }
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a mock chat completion response', (done) => {
    const inputContent = 'Test input';

    service.getResponse(inputContent).subscribe({
      next: (response) => {
        expect(response).toEqual(mockResponse);
        done();
      },
      error: () => {
        fail('Observable should not emit an error');
        done();
      },
    });
  });
});
