export type ScoreFn<T> = { config: FeatureConfig } & ((x: T) => number)

export type GoalFn = (value: number, config: FeatureConfig) => boolean
export interface FeatureConfig {
  goal?: boolean | GoalFn
  weight?: number
  min?: number
  max?: number
  options?: {
    lambda?: number
    unitMagnitude?: number
  }
}

export interface Feature extends Required<Omit<FeatureConfig, 'options'>> {
  mean: number
  variance: number
  count: number
}

export interface ScoreResult<T> {
  item: T
  scores: Record<string, number>
  value: number
}
