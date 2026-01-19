// Service 1

export interface Service1Config {
  enabled: boolean;
  timeout: number;
}

export class Service1 {
  private config: Service1Config;

  constructor(config: Service1Config) {
    this.config = config;
  }

  async execute(data: any): Promise<any> {
    if (!this.config.enabled) {
      throw new Error('Service 1 is disabled');
    }
    return { success: true, data };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}

export const service1 = new Service1({ enabled: true, timeout: 5000 });
