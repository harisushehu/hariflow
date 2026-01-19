// Service 2

export interface Service2Config {
  enabled: boolean;
  timeout: number;
}

export class Service2 {
  private config: Service2Config;

  constructor(config: Service2Config) {
    this.config = config;
  }

  async execute(data: any): Promise<any> {
    if (!this.config.enabled) {
      throw new Error('Service 2 is disabled');
    }
    return { success: true, data };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}

export const service2 = new Service2({ enabled: true, timeout: 5000 });
