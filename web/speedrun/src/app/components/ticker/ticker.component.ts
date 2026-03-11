import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss']
})
export class TickerComponent implements OnInit, OnDestroy {
  private messagesSubscription!: Subscription;

  runData: any;

  customLines: string[] = [
    'Welcome to Speedrun Marathon 2025',
    'Follow the schedule at speedrun.local',
    'Thank you for supporting the runners'
  ];

  ngOnInit(): void {
    this.messagesSubscription = this.websocketService.messages$.subscribe(message => {
      this.handleMessage(message);
    });
  }

  constructor(private websocketService: WebsocketService) {}

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  get linesToDisplay(): string[] {
    return this.buildLines();
  }

  private handleMessage(message: any): void {
    switch (message.action) {
      case 'run':
        this.runData = message.data;
        break;
      case 'tickerLines':
        this.updateCustomLines(message.data?.lines);
        break;
      default:
        break;
    }
  }

  private updateCustomLines(lines: any): void {
    if (!Array.isArray(lines)) {
      return;
    }

    const sanitized = lines
      .slice(0, 3)
      .map(line => typeof line === 'string' ? line.trim() : '')
      .map(line => line.length ? line : ' ');

    if (sanitized.length === 3) {
      this.customLines = sanitized;
    }
  }

  private buildLines(): string[] {
    const gameName = this.runData?.nextRun?.data?.[1] || 'TBD';
    return [
      `Next run: ${gameName}`,
      this.customLines[0],
      this.customLines[1],
      this.customLines[2]
    ];
  }
}
