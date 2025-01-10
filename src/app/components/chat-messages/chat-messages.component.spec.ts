import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMessagesComponent } from './chat-messages.component';
import { Component, Input } from '@angular/core';

describe('ChatMessagesComponent', () => {
  let component: ChatMessagesComponent;
  let fixture: ComponentFixture<ChatMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(ChatMessagesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should format message with bold text', () => {
    const inputMessage = 'This is **bold** text.';
    const formattedMessage = component.formatMessage(inputMessage);
    expect(formattedMessage).toBe('This is <strong>bold</strong> text.');
  });

  it('should replace newline characters with <br>', () => {
    const inputMessage = 'Line one.\nLine two.';
    const formattedMessage = component.formatMessage(inputMessage);
    expect(formattedMessage).toBe('Line one.<br>Line two.');
  });

  it('should replace ### with <h1> tags', () => {
    const inputMessage = '### Header text';
    const formattedMessage = component.formatMessage(inputMessage);
    expect(formattedMessage).toBe('<h1>Header text</h1>');
  });

  it('should handle empty messages gracefully', () => {
    const inputMessage = '';
    const formattedMessage = component.formatMessage(inputMessage);
    expect(formattedMessage).toBe('');
  });

  it('should return empty string for empty input', () => {
    const inputMessage: string | undefined = undefined;
    const formattedMessage = component.formatMessage(inputMessage ?? '');
    expect(formattedMessage).toBe('');
  });

  it('should render messages properly in the template', () => {
    // Test the rendering of messages passed as @Input()
    component.messages = [
      { message: '### Header', type: 'bot' },
      { message: 'This is **bold** text.', type: 'user' },
      { message: 'Line one.\nLine two.', type: 'bot' },
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const renderedMessages = compiled.querySelectorAll('p');

    expect(renderedMessages.length).toBe(3);
    expect(renderedMessages[0].innerHTML).toContain('<h1>Header</h1>');
    //expect(renderedMessages[1].innerHTML).toContain('<strong>bold</strong>');
    expect(renderedMessages[2].innerHTML).toContain('Line one.<br>Line two.');
  });
});
