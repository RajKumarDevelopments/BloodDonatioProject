import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationcountService {

  private notificationCountSource = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSource.asObservable();
  notificationCount: number = 0;
  private baseUrl = '/api/BG/Crud_Notifications';
  HomeUrl: any;
  constructor(private http: HttpClient) {
    this.HomeUrl = localStorage.getItem("URL");
  }



  updateNotificationCount(count: number) {
    this.notificationCountSource.next(count);
  }

  getnotificationCount(): number {
    return this.notificationCountSource.value;
  }




  incrementNotificationCount() {
    this.notificationCountSource.next(this.notificationCountSource.value + 1);
  }
  getNotifications(UserID: number): Observable<any[]> {
    
    const formData = new FormData();
    formData.append('Param', JSON.stringify([{ RegID: UserID }]));
    formData.append('Flag', '4');

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<any[]>(`${this.HomeUrl + this.baseUrl}`, formData, { headers });
  }

  markNotificationsAsRead(notifications: any[]): Observable<any> {
    
    const formData = new FormData();
    formData.append('Param', JSON.stringify(notifications));
    formData.append('Flag', '2');

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<any>(`${this.HomeUrl + this.baseUrl}`, formData, { headers });
  }
  // Add a new method to get the updated count
  getUpdatedNotificationCount(userId: number): Observable<number> {
    
    return this.getNotifications(userId).pipe(
      tap((notifications: any[]) => {
        
        console.log('All notifications:', notifications);
      }),
      map((notifications: any[]) => notifications.filter(notification => notification.Status === false)),
      tap((filteredNotifications: any[]) => {
        
        console.log('Filtered notifications:', filteredNotifications);
      }),
      map((filteredNotifications: any[]) => filteredNotifications.length)
    );
  }


  async scheduleWeeklyNotification() {
    const currentDate = new Date();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Weekly Notification',
          body: 'This is your weekly reminder!',
          schedule: {
            every: 'week', // Weekly notification
            repeats: true,
            at: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          },
          //sound: null,
         // smallIcon: 'ic_launcher',
         // led: 'FF0000',
        },
      ],
    });

    console.log('Weekly Notification Scheduled');
  }


  async scheduleTwiceWeeklyNotification() {
    const currentDate = new Date();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 2,
          title: 'Twice-Weekly Notification',
          body: 'This is your twice-weekly reminder!',
          schedule: {
            every: 'day', // Setting daily but we schedule for 3.5 days interval
            repeats: true,
            at: new Date(currentDate.getTime() + 3.5 * 24 * 60 * 60 * 1000), // 3.5 days from now
          },
          //sound: null,
         // smallIcon: 'ic_launcher',
          //led: 'FF0000',
        },
      ],
    });

    console.log('Twice-Weekly Notification Scheduled');
  }

  async scheduleDailyNotification() {
    const currentDate = new Date();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Daily Notification',
          body: 'This is your daily reminder!',
          schedule: {
            every: 'day', // Triggers every day
            repeats: true,
            at: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // 1 day from now
          },
          //sound: null,
          //smallIcon: 'ic_launcher',
          //led: 'FF0000',
        },
      ],
    });

    console.log('Daily Notification Scheduled');
  }

  // Schedule flexible weekly notification (7 days from the current time)
  async scheduleWeeklyNotification2() {
    const currentDate = new Date();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 2,
          title: 'Weekly Notification',
          body: 'This is your weekly reminder!',
          schedule: {
            every: 'day', // Setting daily but we schedule 7 days ahead
            repeats: true,
            at: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          },
          //sound: null,
          //smallIcon: 'ic_launcher',
          //led: 'FF0000',
        },
      ],
    });

    console.log('Weekly Notification Scheduled');
  }

  // Schedule monthly notification
  async scheduleMonthlyNotification() {
    const currentDate = new Date();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 3,
          title: 'Monthly Notification',
          body: 'This is your monthly reminder!',
          schedule: {
            every: 'month', // Every month
            repeats: true,
            at: new Date(currentDate.setMonth(currentDate.getMonth() + 1)), // 1 month from now
          },
          //sound: null,
          //smallIcon: 'ic_launcher',
          //led: 'FF0000',
        },
      ],
    });

    console.log('Monthly Notification Scheduled');
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications() {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] });
    console.log('All notifications cancelled');
  }


}
