import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.asObservable();
  private readonly WS_URL = 'ws://localhost:3000/ws';
  private reconnectInterval = 2000; // 2 seconds

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket$ = webSocket(this.WS_URL);
    const observer = {
      next: (message: any) => {
        console.log('WebSocket message received:', message);
        this.messagesSubject$.next(message);
      },
      error: (err: any) => {
        console.error('WebSocket error:', err);
        setTimeout(() => this.connect(), this.reconnectInterval);
      },
      complete: () => console.warn('WebSocket connection closed')
    };
    this.socket$.subscribe(observer);
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  public close(): void {
    this.socket$.complete();
  }
}
