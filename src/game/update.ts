import type { Block, Bubble, Wire } from './types'
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

export function resolveBubbleBlockCollision(bubble: Bubble, block: Block): Bubble {
  const { radius, bounceVelocity } = BUBBLE_SIZE_CONFIG[bubble.sizeLevel]

  const withinX = bubble.x + radius > block.x && bubble.x - radius < block.x + block.width
  const hittingTop = bubble.vy > 0 && bubble.y + radius >= block.y && bubble.y - radius < block.y

  if (withinX && hittingTop) {
    return { ...bubble, y: block.y - radius, vy: -bounceVelocity }
  }
  return bubble
}

export function isWireBlockedByBlock(wire: Wire, block: Block): boolean {
  const withinX = wire.x > block.x && wire.x < block.x + block.width
  const hittingBlock = wire.y <= block.y + block.height && wire.y >= block.y
  return withinX && hittingBlock
}
