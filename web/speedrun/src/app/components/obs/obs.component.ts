import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const CSV = `3/10/2026 6:34:06,itzpaige__,Job Simulator,Howlin_Mad_Mike,Host2,HostMeUp3
3/9/2026 23:32:44,Clagnarok,Neopets: The Darkest Faerie,NoHost,NoHost,NoHost
3/9/2026 23:33:49,Soulcloset2,Barbie Horse Trails,Pinkynoice,pink s'mores,NoHost
3/9/2026 23:35:04,ExclamationMarkYT,Cuphead,taylz,NoHost,NoHost
3/9/2026 23:36:28,organMike,Planet Diver,nohost,nohost,nohost
3/9/2026 23:36:51,organMike,Sentinels of The Multiverse,nohost,nohost,nohost
3/9/2026 23:38:35,KingXavier & DerrickGNC & kiebsgaming,Archipelago,NoHost,NoHost,NoHost
3/9/2026 23:40:45,ProPokeNoob,Pokémon Crystal,KuritasKRT,NoHost,NoHost
3/9/2026 23:42:10,ItsBringr,Project Zomboid,NoHost,NoHost,NoHost
3/10/2026 0:22:05,Spectral,Mr. Bones,NoHost,NoHost,NoHost
3/10/2026 0:24:10,Mathias4595,Skylanders: Spyro's Adventure,OzoneNeutral,NoHost,NoHost
3/10/2026 4:24:45,howlin_mad_mike,Prince of Persia,NoHost,NoHost,NoHost
3/10/2026 5:00:08,craZy_y0,craZy_y0,Leah,NoHost,NoHost
3/10/2026 5:04:32,Virtual QSO,Crash Team Racing Nitro Fueled,NoHost,NoHost,NoHost
3/10/2026 6:34:06,itzpaige__,Job Simulator,Howlin_Mad_Mike,NoHost,NoHost
3/10/2026 6:34:39,itzpaige__,PRAGMATA Sketchbook DEMO,NoHost,NoHost,NoHost
3/10/2026 6:35:26,itzpaige__,The Last Of Us: Left Behind,NoHost,NoHost,NoHost
3/10/2026 6:54:13,ILikeBaguette25,Duck Life Battle,NoHost,NoHost,NoHost
3/10/2026 7:16:03,Celestrick,The Legend of Zelda: Breath Of The Wild,NoHost,NoHost,NoHost
3/10/2026 8:50:07,juesto,LEGO Builder's Journey,Sonic7,NoHost,NoHost
3/10/2026 11:27:23,pbb8,Ollie-Oop,NoHost,NoHost,NoHost
3/10/2026 11:27:36,pbb8,Bad Way,NoHost,NoHost,NoHost
3/10/2026 13:34:37,juesto,Flower,Asuka424,NoHost,NoHost
3/10/2026 16:55:43,kiebsgaming,The Legend Of Zelda: A Link To The Past,NoHost,NoHost,NoHost
3/10/2026 17:15:59,auclairdelalyn,Donut County,NoHost,NoHost,NoHost
3/10/2026 17:16:22,auclairdelalyn,Hyperbolica,NoHost,NoHost,NoHost
3/10/2026 17:17:00,auclairdelalyn,What The Car,NoHost,NoHost,NoHost
3/10/2026 17:53:10, BlitZK & Josef733,Greece Rally Series,NoHost,NoHost,NoHost`;

const CSV_ROWS = CSV.split('\n')
  .map(line => line.split(',').map(value => value.trim()))
  .filter(columns => columns.length >= 3);

type CouchInfo = {
  host1: string;
  host2: string;
  host3: string;
};

@Component({
  selector: 'app-obs',
  templateUrl: './obs.component.html',
  styleUrls: ['./obs.component.scss']
})
export class ObsComponent implements OnInit, OnDestroy {
  private messagesSubscription!: Subscription;
  type: string | null = null;
  runData: any;
  couchInfo: CouchInfo = {
    host1: '',
    host2: '',
    host3: ''
  };
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
        this.setRunInfo(message.data);
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

  private setRunInfo(runData: any): void {
    this.runData = runData;
    const gameName = String(this.runData?.current?.data?.[1] || '').trim().toLowerCase();
    const matchedRow = CSV_ROWS.find(columns => columns[2].toLowerCase() === gameName);

    this.couchInfo = {
      host1: this.normalizeHost(matchedRow?.[3]),
      host2: this.normalizeHost(matchedRow?.[4]),
      host3: this.normalizeHost(matchedRow?.[5])
    };
  }

  private normalizeHost(value: string | undefined): string {
    const host = String(value || '').trim();
    return host.toLowerCase() === 'nohost' ? '' : host;
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
