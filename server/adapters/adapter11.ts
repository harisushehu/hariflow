// Adapter i - Data transformation adapter

export interface AdapterInputi {
  source: string;
  data: any;
}

export interface AdapterOutputi {
  target: string;
  data: any;
  transformedAt: Date;
}

export class Adapteri {
  async transform(input: AdapterInputi): Promise<AdapterOutputi> {
    return {
      target: 'transformed',
      data: this.mapData(input.data),
      transformedAt: new Date(),
    };
  }

  private mapData(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.mapData(item));
    }

    if (typeof data === 'object' && data !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.mapData(value);
      }
      return result;
    }

    return data;
  }

  validate(data: any): boolean {
    return data !== null && data !== undefined;
  }
}

export const adapteri = new Adapteri();
