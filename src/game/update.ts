import type { Bubble } from './types'
import { BUBBLE_SIZE_CONFIG, CANVAS_HEIGHT, CANVAS_WIDTH, GRAVITY } from './constants'

export function updateBubble(bubble: Bubble, deltaTime: number): Bubble {
  const { radius, bounceVelocity } = BUBBLE_SIZE_CONFIG[bubble.sizeLevel]

  let { x, y, vx, vy } = bubble
  vy += GRAVITY * deltaTime
  x += vx * deltaTime
  y += vy * deltaTime

  if (y + radius >= CANVAS_HEIGHT) {
    y = CANVAS_HEIGHT - radius
    vy = -bounceVelocity
  }
  if (y - radius <= 0) {
    y = radius
    vy = -vy
  }

  if (x - radius <= 0) {
    x = radius
    vx = -vx
  } else if (x + radius >= CANVAS_WIDTH) {
    x = CANVAS_WIDTH - radius
    vx = -vx
  }

  return { ...bubble, x, y, vx, vy }
}
