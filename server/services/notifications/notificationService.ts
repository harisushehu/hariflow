// Notification service for user notifications

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private userNotifications: Map<number, string[]> = new Map();

  createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    actionUrl?: string
  ): Notification {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const notification: Notification = {
      id,
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date(),
      actionUrl,
    };

    this.notifications.set(id, notification);

    if (!this.userNotifications.has(userId)) {
      this.userNotifications.set(userId, []);
    }
    this.userNotifications.get(userId)!.push(id);

    return notification;
  }

  getNotification(id: string): Notification | undefined {
    return this.notifications.get(id);
  }

  getUserNotifications(userId: number, unreadOnly: boolean = false): Notification[] {
    const notificationIds = this.userNotifications.get(userId) || [];
    const notifications = notificationIds
      .map((id) => this.notifications.get(id))
      .filter((n) => n !== undefined) as Notification[];

    if (unreadOnly) {
      return notifications.filter((n) => !n.read);
    }

    return notifications;
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead(userId: number): void {
    const notificationIds = this.userNotifications.get(userId) || [];
    notificationIds.forEach((id) => {
      const notification = this.notifications.get(id);
      if (notification) {
        notification.read = true;
      }
    });
  }

  deleteNotification(id: string): boolean {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    const userNotifications = this.userNotifications.get(notification.userId);
    if (userNotifications) {
      const index = userNotifications.indexOf(id);
      if (index > -1) {
        userNotifications.splice(index, 1);
      }
    }

    return this.notifications.delete(id);
  }

  deleteUserNotifications(userId: number): number {
    const notificationIds = this.userNotifications.get(userId) || [];
    let deleted = 0;

    notificationIds.forEach((id) => {
      if (this.notifications.delete(id)) {
        deleted++;
      }
    });

    this.userNotifications.delete(userId);
    return deleted;
  }

  getUnreadCount(userId: number): number {
    return this.getUserNotifications(userId, true).length;
  }
}

export const notificationService = new NotificationService();
