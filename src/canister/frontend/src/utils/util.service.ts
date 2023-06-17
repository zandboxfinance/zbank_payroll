
// Angular imports
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})

export class UtilService {
  constructor(private notification: NzNotificationService) {}
  
  public  createNotification(type: string, content: string): void {
    this.notification.create(type, 'System Notification', content);
  }
}