export interface Player {
  x: number
  y: number
  width: number
  height: number
}

export interface Wire {
  x: number
  y: number
}

export type BubbleSizeLevel = 0 | 1 | 2

export interface Bubble {
  x: number
  y: number
  vx: number
  vy: number
  sizeLevel: BubbleSizeLevel
}
