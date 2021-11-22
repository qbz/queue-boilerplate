export type SafeResult<T> = { error: null, value: T } | { error: Error, value: void }

export type QueueOptions<T, U> = {
  name: string
  parallels: number
  drainLimit: number
  processor: (tasks: T[]) => Promise<SafeResult<U>[]>
}

export type TaskControl<T> = { task: T, resolve: Function, reject: Function }

export interface IQueue<T, U> {
  exec(task: T): Promise<U>
  readonly status: {
    name: string,
    available: number,
    working: number,
    enqueued: number
  }
}
