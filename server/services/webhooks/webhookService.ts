// Webhook service for event notifications

export type WebhookEvent = 
  | 'dataset.created'
  | 'dataset.updated'
  | 'annotation.created'
  | 'annotation.updated'
  | 'training.started'
  | 'training.completed'
  | 'model.created'
  | 'inference.completed';

export interface Webhook {
  id: string;
  userId: number;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  createdAt: Date;
  lastTriggeredAt?: Date;
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: number;
  data: Record<string, any>;
}

export class WebhookService {
  private webhooks: Map<string, Webhook> = new Map();
  private userWebhooks: Map<number, string[]> = new Map();

  registerWebhook(
    userId: number,
    url: string,
    events: WebhookEvent[]
  ): Webhook {
    const id = `webhook_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const webhook: Webhook = {
      id,
      userId,
      url,
      events,
      active: true,
      createdAt: new Date(),
    };

    this.webhooks.set(id, webhook);

    if (!this.userWebhooks.has(userId)) {
      this.userWebhooks.set(userId, []);
    }
    this.userWebhooks.get(userId)!.push(id);

    return webhook;
  }

  getWebhook(id: string): Webhook | undefined {
    return this.webhooks.get(id);
  }

  getUserWebhooks(userId: number): Webhook[] {
    const webhookIds = this.userWebhooks.get(userId) || [];
    return webhookIds
      .map((id) => this.webhooks.get(id))
      .filter((w) => w !== undefined) as Webhook[];
  }

  updateWebhook(id: string, updates: Partial<Webhook>): void {
    const webhook = this.webhooks.get(id);
    if (webhook) {
      Object.assign(webhook, updates);
    }
  }

  deleteWebhook(id: string): boolean {
    const webhook = this.webhooks.get(id);
    if (!webhook) return false;

    const userWebhooks = this.userWebhooks.get(webhook.userId);
    if (userWebhooks) {
      const index = userWebhooks.indexOf(id);
      if (index > -1) {
        userWebhooks.splice(index, 1);
      }
    }

    return this.webhooks.delete(id);
  }

  async triggerEvent(event: WebhookEvent, data: Record<string, any>): Promise<void> {
    const payload: WebhookPayload = {
      event,
      timestamp: Date.now(),
      data,
    };

    const activeWebhooks = Array.from(this.webhooks.values()).filter(
      (w) => w.active && w.events.includes(event)
    );

    for (const webhook of activeWebhooks) {
      try {
        await this.sendWebhook(webhook, payload);
        webhook.lastTriggeredAt = new Date();
      } catch (error) {
        console.error(`Failed to trigger webhook ${webhook.id}:`, error);
      }
    }
  }

  private async sendWebhook(webhook: Webhook, payload: WebhookPayload): Promise<void> {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Event': payload.event,
        'X-Webhook-Timestamp': payload.timestamp.toString(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }
  }

  getWebhookStats(): {
    totalWebhooks: number;
    activeWebhooks: number;
    inactiveWebhooks: number;
  } {
    const webhooks = Array.from(this.webhooks.values());
    return {
      totalWebhooks: webhooks.length,
      activeWebhooks: webhooks.filter((w) => w.active).length,
      inactiveWebhooks: webhooks.filter((w) => !w.active).length,
    };
  }
}

export const webhookService = new WebhookService();
