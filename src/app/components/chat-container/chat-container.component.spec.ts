import { TestBed } from '@angular/core/testing';
import { ChatContainerComponent } from './chat-container.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessagesComponent } from '../chat-messages/chat-messages.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { AiGroqService } from '../../services/ai-groq.service';
import { ChatCompletionService } from '../../services/chat-completion.service';
import { of } from 'rxjs';

describe('ChatContainerComponent', () => {
  let component: ChatContainerComponent;
  let groqServiceSpy: jasmine.SpyObj<AiGroqService>;
  let chatCompletionServiceSpy: jasmine.SpyObj<ChatCompletionService>;

  beforeEach(() => {
    groqServiceSpy = jasmine.createSpyObj('AiGroqService', ['getResponse']);
    chatCompletionServiceSpy = jasmine.createSpyObj('ChatCompletionService', ['chatCompletionSignal']);

    TestBed.configureTestingModule({
      imports: [
        ChatInputComponent, 
        ChatMessagesComponent,
        ChatHeaderComponent
      ],
      providers: [
        { provide: AiGroqService, useValue: groqServiceSpy },
        { provide: ChatCompletionService, useValue: chatCompletionServiceSpy },
      ]
    });

    const fixture = TestBed.createComponent(ChatContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getChatCompletion on init', () => {
    const spy = spyOn(component, 'getChatCompletion');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = spyOn(component['destroy$'], 'next').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle bot message in getChatCompletion', () => {
    const botMessage = 'Hello from bot';
    chatCompletionServiceSpy.chatCompletionSignal.and.returnValue({ message: botMessage });
    groqServiceSpy.getResponse.and.returnValue(of({
      id: 'test-id',
      object: 'chat.completion',
      created: Date.now(),
      model: 'test-model',
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'Mock response content',
          },
          finish_reason: 'stop',
          index: 0,
          logprobs: null,
        },
      ],
    }));

    component.getChatCompletion();

    expect(groqServiceSpy.getResponse).toHaveBeenCalledWith('hi');
    expect(component.botMessage).toBe(botMessage);
    expect(component.messages).toContain({ message: botMessage, type: 'bot' });
  });

  it('should add user and bot messages in getUserInputMessage', () => {
    const userMessage = 'User input';
    const botMessage = 'Bot response';
    chatCompletionServiceSpy.chatCompletionSignal.and.returnValue({ message: botMessage });
    groqServiceSpy.getResponse.and.returnValue(of({
      id: 'test-id',
      object: 'chat.completion',
      created: Date.now(),
      model: 'test-model',
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'Mock response content',
          },
          finish_reason: 'stop',
          index: 0,
          logprobs: null,
        },
      ],
    }));

    component.getUserInputMessage(userMessage);

    expect(component.messages).toContain({ message: userMessage, type: 'user' });
    expect(groqServiceSpy.getResponse).toHaveBeenCalledWith(userMessage);

    expect(component.messages).toContain({ message: botMessage, type: 'bot' });
  });

  it('should add messages to the array with setMessagesArray', () => {
    const testMessage = 'Test message';
    const testType: 'user' | 'bot' = 'user';

    component['setMessagesArray'](testMessage, testType);

    expect(component.messages).toContain({ message: testMessage, type: testType });
  });
});
