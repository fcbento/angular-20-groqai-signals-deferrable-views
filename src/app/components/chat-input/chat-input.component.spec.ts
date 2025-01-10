import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatInputComponent } from './chat-input.component';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty initial message', () => {
    expect(component.message).toBe('');
  });

  it('should emit userInputMessage and clear message on sendMessage', () => {
    spyOn(component.userInputMessage, 'emit');
    component.message = 'Test message';
    component.sendMessage();
    expect(component.userInputMessage.emit).toHaveBeenCalledWith('Test message');
    expect(component.message).toBe('');
  });
});