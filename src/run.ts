import chalk from 'chalk'

import Queue from './index' // <- implement this
import { sleep } from './utils'

import type { SafeResult } from './types'


const processor = (tasks: number[]): Promise<SafeResult<string>[]> => {
  console.log(chalk.grey('Processer obtained tasks:'), chalk.grey(tasks.length))
  if (Math.random() > 0.5) {
    throw new Error('Something really bad happend')
  }
  const results = tasks.map(async (task): Promise<SafeResult<string>> => {
    await sleep(1000)
    if (Math.random() > 0.5) {
      return {
        error: null,
        value: String(task)
      }
    }
    return {
      error: new Error('Not found!'),
      value: undefined
    }
  })
  return Promise.all(results)
}

const queue = new Queue({
  name: 'my queue',
  parallels: 5, // how many tasks we can execute in parallel
  drainLimit: 3, // how many tasks we can group from awaiting ones if possible
  processor // processing function
})


setInterval(async () => {
  const id = Math.floor(Math.random() * 100)
  console.log(chalk.grey('Adding new task:'), chalk.grey(id))
  try {
    const result = await queue.exec(id)
    console.log(chalk.green(`Task ${id} resolved correctly with "${result}"`))
  } catch (err) {
    console.log(chalk.red(`Task ${id} failed with "${err.message}"`))
  }
}, 50)

setInterval(() => {
  console.error(queue.status)
}, 1000)