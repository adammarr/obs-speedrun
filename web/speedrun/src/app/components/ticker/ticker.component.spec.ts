import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TickerComponent } from './ticker.component';
import { WebsocketService } from '../../services/websocket.service';

describe('TickerComponent', () => {
  let component: TickerComponent;
  let fixture: ComponentFixture<TickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TickerComponent],
      providers: [
        {
          provide: WebsocketService,
          useValue: { messages$: of() }
        }
      ]
    });
    fixture = TestBed.createComponent(TickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
