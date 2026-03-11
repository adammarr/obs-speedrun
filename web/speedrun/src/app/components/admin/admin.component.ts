import { Component } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  scheduleData: any;
  currentRun = 0;
  maxRun = 0;
  tickerLines: string[] = [
    'Welcome to Gamers Against Cancer 2026',
    'Follow the schedule at gamersforhope.com',
    'Thank you for supporting the runners'
  ];
  startTimerValue: string = '';
  timer: any;
  startTime: number = 0;
  stopTime: number = 0;
  timerValue: string = '';
  timerStatus: string = 'Reset';


  constructor(private websocketService: WebsocketService, private scheduleService: ScheduleService) {
    this.scheduleData = this.scheduleService.schedule.schedule.items;
    this.maxRun = this.scheduleData.length;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  sync(): void {
    // Logic to load the previous run
    console.log('Sync All clicked');
    this.websocketService.sendMessage({ action: 'run', data: {
      current: this.scheduleData[this.currentRun],
      previousRun: this.currentRun > 0 ? this.scheduleData[this.currentRun - 1] : null,
      nextRun: this.currentRun < this.maxRun - 1 ? this.scheduleData[this.currentRun + 1] : null,
      nextRun2: this.currentRun < this.maxRun - 2 ? this.scheduleData[this.currentRun + 2] : null
    }});
    this.publishTickerLines();
    if (this.timerStatus === 'Running') {
      this.websocketService.sendMessage({ action: 'startTimer', data: { startTime: this.startTime } });
    } else if (this.timerStatus === 'Stopped') {
      this.websocketService.sendMessage({ action: 'stopTimer', data: { startTime: this.startTime, stopTime: this.stopTime } });
    } else if (this.timerStatus === 'Reset') {
      this.websocketService.sendMessage({ action: 'resetTimer', data: {} });
    }
  }

  updateTickerLines(): void {
    this.publishTickerLines();
  }

  previousRun(): void {
    // Logic to load the previous run
    console.log('Previous Run clicked');
    this.currentRun = Math.max(0, this.currentRun - 1);
    this.websocketService.sendMessage({ action: 'run', data: {
      current: this.scheduleData[this.currentRun],
      previousRun: this.currentRun > 0 ? this.scheduleData[this.currentRun - 1] : null,
      nextRun: this.currentRun < this.maxRun - 1 ? this.scheduleData[this.currentRun + 1] : null,
      nextRun2: this.currentRun < this.maxRun - 2 ? this.scheduleData[this.currentRun + 2] : null
    }});
  }

  nextRun(): void {
    // Logic to load the next run
    console.log('Next Run clicked');
    this.currentRun = Math.min(this.maxRun - 1, this.currentRun + 1);
    this.websocketService.sendMessage({ action: 'run', data: {
      current: this.scheduleData[this.currentRun],
      previousRun: this.currentRun > 0 ? this.scheduleData[this.currentRun - 1] : null,
      nextRun: this.currentRun < this.maxRun - 1 ? this.scheduleData[this.currentRun + 1] : null,
      nextRun2: this.currentRun < this.maxRun - 2 ? this.scheduleData[this.currentRun + 2] : null
    }});
  }

  startTimer(): void {
    // Logic to start the timer
    console.log('Start Timer clicked');
    this.startTime = Date.now();
    if (this.startTimerValue) {
      const [minutes, seconds] = this.startTimerValue.split(':').map(Number);
      this.startTime -= (minutes * 60000 + seconds * 1000);
    }
    this.websocketService.sendMessage({ action: 'startTimer', data: { startTime: this.startTime } });
    this.timerStatus = 'Running';
    this.clearTimer();
    this.timer = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.updateTimerDisplay(elapsedTime);
    }, 1000);
  }

  stopTimer(): void {
    // Logic to stop the timer
    console.log('Stop Timer clicked');
    this.stopTime = Date.now();
    this.websocketService.sendMessage({ action: 'stopTimer', data: { startTime: this.startTime, stopTime: this.stopTime } });
    this.timerStatus = 'Stopped';
    this.clearTimer();
  }

  restartTimer(): void {
    // Logic to restart the timer
    console.log('Restart Timer clicked');
    // calculate the new start time based on the stop time
    this.startTime = Date.now() - (this.stopTime - this.startTime);
    this.websocketService.sendMessage({ action: 'restartTimer', data: { startTime: this.startTime } });
    this.timerStatus = 'Running';
    this.timer = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.updateTimerDisplay(elapsedTime);
    }, 1000);
  }


  resetTimer(): void {
    // Logic to reset the timer
    console.log('Reset Timer clicked');
    this.websocketService.sendMessage({ action: 'resetTimer', data: {} });
    this.timerStatus = 'Reset';
    this.clearTimer();
    this.timerValue = '';
    this.startTimerValue = '';
  }

  clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateTimerDisplay(elapsedTime: number): void {
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    this.timerValue = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private publishTickerLines(): void {
    this.websocketService.sendMessage({ action: 'tickerLines', data: { lines: this.tickerLines } });
  }
}
