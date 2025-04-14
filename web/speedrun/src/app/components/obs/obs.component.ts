import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-obs',
  templateUrl: './obs.component.html',
  styleUrls: ['./obs.component.scss']
})
export class ObsComponent implements OnInit, OnDestroy {
  private messagesSubscription!: Subscription;
  type: string | null = null;
  runData: any;
  timer: any;
  startTime: number = 0;
  stopTime: number = 0;
  timerValue: string = '';

  constructor(private route: ActivatedRoute, private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.messagesSubscription = this.websocketService.messages$.subscribe(
      message => {
        this.handleMessage(message);
      }
    );

    // Access the 'type' query parameter
    this.route.queryParamMap.subscribe(params => {
      this.type = params.get('type');
      console.log('Type query parameter:', this.type);
    });
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }

  private handleMessage(message: any): void {
    switch (message.action) {
      case 'run':
        this.runData = message.data;
        break;
      case 'startTimer':
        this.startTime = message.data.startTime;
        this.startTimer();
        break;
      case 'stopTimer':
        this.startTime = message.data.startTime;
        this.stopTime = message.data.stopTime;
        this.stopTimer();
        break;
      case 'restartTimer':
        this.startTime = message.data.startTime;
        this.restartTimer();
        break;
      case 'resetTimer':
        this.resetTimer();
        break;
      default:
        console.error('Unknown action:', message.action);
    }
  }

  private startTimer(): void {
    this.clearTimer();
    this.timer = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.updateTimerDisplay(elapsedTime);
    }, 1000);
  }

  private stopTimer(): void {
    this.clearTimer();
    const elapsedTime = this.stopTime - this.startTime;
    this.updateTimerDisplay(elapsedTime, true);
  }

  private restartTimer(): void {
    this.clearTimer();
    this.timer = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.updateTimerDisplay(elapsedTime);
    }, 1000);
  }

  private resetTimer(): void {
    this.clearTimer();
    this.timerValue = '00:00:00';
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private updateTimerDisplay(elapsedTime: number, includeMills?: boolean): void {
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    if (includeMills) {
      const milliseconds = Math.floor(elapsedTime % 1000);
      this.timerValue = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}.${this.pad(milliseconds)}`;
    } else {
      this.timerValue = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    };
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
