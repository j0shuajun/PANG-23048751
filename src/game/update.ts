import type { Block, Bubble, BubbleSizeLevel, Player, Wire } from './types'
import { BUBBLE_HORIZONTAL_SPEED, BUBBLE_SIZE_CONFIG, CANVAS_WIDTH, GRAVITY, GROUND_HEIGHT, CANVAS_HEIGHT } from './constants'

const FLOOR_Y = CANVAS_HEIGHT - GROUND_HEIGHT

export function updateBubble(bubble: Bubble, deltaTime: number): Bubble {
  const { radius, bounceVelocity } = BUBBLE_SIZE_CONFIG[bubble.sizeLevel]

  let { x, y, vx, vy } = bubble
  vy += GRAVITY * deltaTime
  x += vx * deltaTime
  y += vy * deltaTime

  if (y + radius >= FLOOR_Y) {
    y = FLOOR_Y - radius
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

function isWireInsideBubble(wire: Wire, bubble: Bubble): boolean {
  const { radius } = BUBBLE_SIZE_CONFIG[bubble.sizeLevel]
  const dx = wire.x - bubble.x
  const dy = wire.y - bubble.y
  return dx * dx + dy * dy <= radius * radius
}

/**
 * Wire가 Bubble에 맞으면 규칙대로 분할/소멸시킨다.
 * 맞은 Wire는 제거되고, 각 Wire는 한 프레임에 최대 하나의 Bubble만 맞힌다.
 */
export function resolveWireBubbleCollisions(
  wires: Wire[],
  bubbles: Bubble[],
): { wires: Wire[]; bubbles: Bubble[] } {
  const survivingWires: Wire[] = []
  const remainingBubbles = [...bubbles]

  for (const wire of wires) {
    const hitIndex = remainingBubbles.findIndex((bubble) => isWireInsideBubble(wire, bubble))

    if (hitIndex === -1) {
      survivingWires.push(wire)
      continue
    }

    const hitBubble = remainingBubbles[hitIndex]
    remainingBubbles.splice(hitIndex, 1)

    if (hitBubble.sizeLevel < 2) {
      const childLevel = (hitBubble.sizeLevel + 1) as BubbleSizeLevel
      remainingBubbles.push(
        { ...hitBubble, sizeLevel: childLevel, vx: -BUBBLE_HORIZONTAL_SPEED, vy: -260 },
        { ...hitBubble, sizeLevel: childLevel, vx: BUBBLE_HORIZONTAL_SPEED, vy: -260 },
      )
    }
  }

  return { wires: survivingWires, bubbles: remainingBubbles }
}

export function isPlayerHitByBubble(player: Player, bubble: Bubble): boolean {
  const { radius } = BUBBLE_SIZE_CONFIG[bubble.sizeLevel]

  const closestX = Math.max(player.x, Math.min(bubble.x, player.x + player.width))
  const closestY = Math.max(player.y, Math.min(bubble.y, player.y + player.height))
  const dx = bubble.x - closestX
  const dy = bubble.y - closestY

  return dx * dx + dy * dy <= radius * radius
}
