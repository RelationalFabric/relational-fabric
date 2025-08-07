import type { AnyThing } from '@relational-fabric/filament'
import { isNormalized } from './sort.js'

import type { Feature, FeatureConfig, ScoreFn, ScoreInterface, ScoreResult } from './types/index.js'

function nextMean(mean: number, count: number, value: number) {
  return (mean * count + value) / (count + 1)
}

function nextVariance(variance: number, count: number, mean: number, value: number) {
  return (variance * count + (value - mean) ** 2) / (count + 1)
}

function zScore(value: number, mean: number, variance: number) {
  if (variance === 0) {
    return 0
  }
  return (value - mean) / Math.sqrt(variance)
}

export class Score<T> implements ScoreInterface<T> {
  defaultWeights: Record<string, number> = {}
  scoreFns: Record<string, ScoreFn<T>> = {}
  features: Record<string, Feature> = {}

  constructor(defaultWeights: Record<string, number> = {}) {
    this.defaultWeights = defaultWeights
  }

  addFeature(name: string, fn: ScoreFn<T>, options: FeatureConfig = {}) {
    const { options: _, ...fnConfig } = fn.config
    const { options: __, ...config } = options
    this.scoreFns[name] = fn
    this.features[name] = {
      goal: false,
      weight: 1,
      mean: 0,
      variance: 0,
      count: 0,
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
      ...fnConfig,
      ...config,
    }
    this.recomputeWeights()
  }

  updateFeature(name: string, fn: ScoreFn<T>, config: FeatureConfig = {}) {
    if (!this.features[name]) {
      return this.addFeature(name, fn, config)
    }
    this.scoreFns[name] = fn
  }

  private recomputeWeights() {
    const sumWeights = Object.values(this.features).reduce(
      (acc, feature) => acc + feature.weight,
      0,
    )
    Object.values(this.features).forEach((feature) => {
      feature.weight = feature.weight / sumWeights
    })
  }

  score(item: T): ScoreResult<T> {
    const initalResult = {
      item,
      scores: {},
      value: 0,
    } as ScoreResult<T>
    const scoreResult = Object.entries(this.scoreFns).reduce((acc, [name, fn]) => {
      const value = fn(item)
      const { mean, variance, count, min, max } = this.features[name]
      this.features[name].mean = nextMean(mean, count, value)
      this.features[name].variance = nextVariance(variance, count, mean, value)
      this.features[name].count = count + 1
      this.features[name].min = Math.min(min, value)
      this.features[name].max = Math.max(max, value)
      acc.scores[name] = value
      return acc
    }, initalResult)
    const valueFn = (): number => {
      const normalisedScores = Object.entries(scoreResult.scores).map(([name, value]) => {
        const feature = this.features[name]
        if (feature.goal) {
          if (typeof feature.goal === 'function') {
            if (!feature.goal(value, feature)) {
              return Number.NaN
            }
          }
          else if (value === feature.min) {
            return Number.NaN
          }
        }

        if (isNormalized(feature)) {
          const score = value * feature.weight

          return score
        }
        const normalisedValue = zScore(value, feature.mean, feature.variance)
        const normalisedMin = zScore(feature.min, feature.mean, feature.variance)
        const normalisedMax = zScore(feature.max, feature.mean, feature.variance)
        const normalisedRange = normalisedMax - normalisedMin
        const scaledValue = (normalisedValue - normalisedMin) / normalisedRange
        const score = scaledValue * feature.weight

        return score
      })
      return normalisedScores.reduce((acc, value) => acc + value, 0)
    }

    return {
      ...scoreResult,
      get value(): number {
        return valueFn()
      },
    }
  }
}

export function isScorer<T extends AnyThing>(value: ScoreInterface<T> | unknown): value is ScoreInterface<T> {
  return value instanceof Score
}
