// Queue service for managing async jobs

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job<T = any> {
  id: string;
  type: string;
  data: T;
  status: JobStatus;
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  retries: number;
  maxRetries: number;
}

export type JobHandler<T = any> = (data: T) => Promise<any>;

export class QueueService {
  private jobs: Map<string, Job> = new Map();
  private handlers: Map<string, JobHandler> = new Map();
  private queue: string[] = [];
  private processing: boolean = false;

  registerHandler(type: string, handler: JobHandler): void {
    this.handlers.set(type, handler);
  }

  async enqueue<T>(type: string, data: T, maxRetries: number = 3): Promise<string> {
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const job: Job<T> = {
      id,
      type,
      data,
      status: 'pending',
      createdAt: new Date(),
      retries: 0,
      maxRetries,
    };

    this.jobs.set(id, job);
    this.queue.push(id);

    this.processQueue();

    return id;
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const jobId = this.queue.shift();
      if (!jobId) break;

      const job = this.jobs.get(jobId);
      if (!job) continue;

      try {
        job.status = 'processing';
        job.startedAt = new Date();

        const handler = this.handlers.get(job.type);
        if (!handler) {
          throw new Error(`No handler registered for job type: ${job.type}`);
        }

        job.result = await handler(job.data);
        job.status = 'completed';
        job.completedAt = new Date();
      } catch (error) {
        job.error = error instanceof Error ? error.message : String(error);

        if (job.retries < job.maxRetries) {
          job.retries++;
          job.status = 'pending';
          this.queue.push(jobId);
        } else {
          job.status = 'failed';
          job.completedAt = new Date();
        }
      }
    }

    this.processing = false;
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  getJobsByStatus(status: JobStatus): Job[] {
    return Array.from(this.jobs.values()).filter((job) => job.status === status);
  }

  clearCompleted(): number {
    let removed = 0;
    const idsToDelete: string[] = [];

    this.jobs.forEach((job, id) => {
      if (job.status === 'completed' || job.status === 'failed') {
        idsToDelete.push(id);
      }
    });

    idsToDelete.forEach((id) => {
      this.jobs.delete(id);
      removed++;
    });

    return removed;
  }

  clear(): void {
    this.jobs.clear();
    this.queue = [];
  }
}

export const queueService = new QueueService();
