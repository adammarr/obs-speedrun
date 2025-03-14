import { Component } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  jsonData = {
    runId: 1,
    runner: 'John Doe',
    time: '00:45:30',
    date: '2023-10-01'
  };

  constructor(private websocketService: WebsocketService) {}

  previousRun(): void {
    // Logic to load the previous run
    console.log('Previous Run clicked');
    this.websocketService.sendMessage({ action: 'previousRun', data: this.jsonData });
  }

  nextRun(): void {
    // Logic to load the next run
    console.log('Next Run clicked');
    this.websocketService.sendMessage({ action: 'nextRun', data: this.jsonData });
  }

  startTimer(): void {
    // Logic to start the timer
    console.log('Start Timer clicked');
    this.websocketService.sendMessage({ action: 'startTimer', data: this.jsonData });
  }
}
