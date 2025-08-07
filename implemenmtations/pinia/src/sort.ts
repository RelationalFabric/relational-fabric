import type { EntityInterface } from '@relational-fabric/filament'
import type { QuerySortFn } from '@relational-fabric/weft/compat'
import type { FeatureConfig, ScoreFn } from './types/index.js'

export function isNormalized(config: FeatureConfig): config is FeatureConfig & { min: 0, max: 1 } {
  return config.min === 0 && config.max === 1
}

export function composeSortBy<T extends EntityInterface>(aSortFn: QuerySortFn<T>, bSortFn?: QuerySortFn<T>) {
  if (!bSortFn) {
    return aSortFn
  }
  return (a: T, b: T) => {
    const aResult = aSortFn(a, b)
    if (aResult !== 0) {
      return aResult
    }
    return bSortFn(a, b)
  }
}

export function invertSort<T extends EntityInterface>(sortFn: QuerySortFn<T>) {
  return (a: T, b: T) => {
    return -sortFn(a, b)
  }
}

export function complementScore<T extends EntityInterface>(sortFn: ScoreFn<T>): ScoreFn<T> {
  const { config } = sortFn
  const transform = isNormalized(config) ? (x: number) => 1 - x : (x: number) => -x
  const fn = (x: T) => {
    return transform(sortFn(x))
  }
  fn.config = {
    ...config,
    min: config.max ? transform(config.max) : undefined,
    max: config.min ? transform(config.min) : undefined,
  }
  return fn
}

export function inverseScore<T extends EntityInterface>(sortFn: ScoreFn<T>): ScoreFn<T> {
  const { config } = sortFn
  const transform = (x: number) => (x ? 1 / x : 1)
  const fn = (x: T) => {
    return transform(sortFn(x))
  }
  fn.config = {
    ...config,
    min: 0,
    max: 1,
  }
  return fn
}

export function inverseSquareScore<T extends EntityInterface>(sortFn: ScoreFn<T>): ScoreFn<T> {
  const { config } = sortFn
  const transform = (x: number) => (x ? 1 / x ** 2 : 1)
  const fn = (x: T) => {
    return transform(sortFn(x))
  }
  fn.config = {
    ...config,
    min: 0,
    max: 1,
  }
  return fn
}

export function decayScore<T extends EntityInterface>(sortFn: ScoreFn<T>): ScoreFn<T> {
  const { config } = sortFn
  const { options } = config
  const lambda = options?.lambda ?? 1
  if (lambda === 0) {
    throw new Error('decayScore: lambda must be greater than 0')
  }
  const transform = (x: number) => (x ? 1 - Math.exp(-x / lambda) : 0)
  const fn = (x: T) => {
    return transform(sortFn(x))
  }
  fn.config = {
    ...config,
    min: 0,
    max: 1,
  }
  return fn
}

export function normaliseScore<T extends EntityInterface>(sortFn: ScoreFn<T>): ScoreFn<T> {
  const { config } = sortFn
  const { max, min } = config
  if (typeof max !== 'number' || typeof min !== 'number') {
    console.error('normaliseScore: max and min must be defined', config)
    throw new Error('normaliseScore: max and min must be defined')
  }
  if (isNormalized(config)) {
    return sortFn
  }
  const transform = (x: number) => (max - min ? x / (max - min) : 0)
  const fn = (x: T) => {
    return transform(sortFn(x))
  }
  fn.config = { ...config, min: 0, max: 1 }
  return fn
}

export function clampScore<T extends EntityInterface>(score: number): ScoreFn<T> {
  const fn = () => {
    return Math.min(Math.max(score, 0), 1)
  }
  fn.config = { min: 0, max: 1, isNormalized: true }
  return fn
}
