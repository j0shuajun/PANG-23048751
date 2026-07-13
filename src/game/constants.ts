import type { BubbleSizeLevel } from './types'

export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 480

export const GROUND_HEIGHT = 56

export const PLAYER_WIDTH = 36
export const PLAYER_HEIGHT = 48
export const PLAYER_SPEED = 260 // px/s
export const PLAYER_START_X = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2
export const PLAYER_Y = CANVAS_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT

export const WIRE_SPEED = 480 // px/s
export const WIRE_WIDTH = 3

export const GRAVITY = 550 // px/s^2
export const BUBBLE_HORIZONTAL_SPEED = 140 // px/s

export const BUBBLE_SIZE_CONFIG: Record<BubbleSizeLevel, { radius: number; bounceVelocity: number }> = {
  0: { radius: 40, bounceVelocity: 510 },
  1: { radius: 26, bounceVelocity: 405 },
  2: { radius: 15, bounceVelocity: 315 },
}

export const STARTING_LIVES = 3
export const PLAYER_INVULNERABLE_MS = 1200
