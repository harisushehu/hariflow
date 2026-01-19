// Type definitions module

export interface Entity {
  id: number;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityInput {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface EntityOutput extends Entity {
  status: 'active' | 'inactive' | 'archived';
}

export interface EntityFilter {
  id?: number;
  name?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface EntityPagination {
  page: number;
  limit: number;
  total: number;
  items: EntityOutput[];
}

export type EntityResult = EntityOutput | null;

export interface EntityService {
  create(input: EntityInput): Promise<EntityOutput>;
  get(id: number): Promise<EntityResult>;
  list(filter?: EntityFilter): Promise<EntityOutput[]>;
  update(id: number, input: Partial<EntityInput>): Promise<EntityOutput>;
  delete(id: number): Promise<boolean>;
}
