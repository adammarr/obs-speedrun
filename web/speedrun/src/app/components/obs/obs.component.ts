import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-obs',
  templateUrl: './obs.component.html',
  styleUrls: ['./obs.component.scss']
})
export class ObsComponent {
  messages: any[] = [];
  private messagesSubscription!: Subscription;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.messagesSubscription = this.websocketService.messages$.subscribe(
      message => this.messages.push(message)
    );
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }
}
