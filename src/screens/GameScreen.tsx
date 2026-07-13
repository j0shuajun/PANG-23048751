import { useEffect, useRef, useState } from 'react'
import type { Block, Bubble, Player, Wire } from '../game/types'
import {
  BUBBLE_SIZE_CONFIG,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GROUND_HEIGHT,
  PLAYER_HEIGHT,
  PLAYER_INVULNERABLE_MS,
  PLAYER_SPEED,
  PLAYER_START_X,
  PLAYER_WIDTH,
  PLAYER_Y,
  STARTING_LIVES,
  WIRE_SPEED,
  WIRE_WIDTH,
} from '../game/constants'
import {
  isPlayerHitByBubble,
  isWireBlockedByBlock,
  resolveBubbleBlockCollision,
  resolveWireBubbleCollisions,
  updateBubble,
} from '../game/update'
import './GameScreen.css'

function createPlayer(): Player {
  return { x: PLAYER_START_X, y: PLAYER_Y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }
}

// Phase 5~6 확인용 테스트 데이터. 실제 Mission 데이터 연결은 Phase 10에서 처리한다.
function createTestBubbles(): Bubble[] {
  return [{ x: 200, y: 100, vx: 90, vy: 0, sizeLevel: 0 }]
}

function createTestBlocks(): Block[] {
  return [{ x: 500, y: 340, width: 150, height: 20 }]
}

function drawBackground(context: CanvasRenderingContext2D) {
  const sky = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  sky.addColorStop(0, '#4fb2e8')
  sky.addColorStop(0.75, '#bfe6f5')
  sky.addColorStop(1, '#eaf6e9')
  context.fillStyle = sky
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.fillStyle = '#d8c48a'
  context.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT)
}

function drawBlock(context: CanvasRenderingContext2D, block: Block) {
  context.fillStyle = '#b3803f'
  context.fillRect(block.x, block.y, block.width, block.height)

  context.strokeStyle = '#8a5f2c'
  context.lineWidth = 1
  const columns = Math.max(1, Math.round(block.width / 40))
  for (let i = 1; i < columns; i++) {
    const lineX = block.x + (block.width / columns) * i
    context.beginPath()
    context.moveTo(lineX, block.y)
    context.lineTo(lineX, block.y + block.height)
    context.stroke()
  }
  context.strokeRect(block.x, block.y, block.width, block.height)
}

function drawPlayer(context: CanvasRenderingContext2D, player: Player) {
  const headRadius = player.width * 0.45
  const headCenterX = player.x + player.width / 2
  const headCenterY = player.y + headRadius

  context.fillStyle = 'rgba(0, 0, 0, 0.2)'
  context.beginPath()
  context.ellipse(headCenterX, player.y + player.height + 4, player.width * 0.55, 6, 0, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#2f6fed'
  context.fillRect(player.x + player.width * 0.1, player.y + player.height * 0.6, player.width * 0.8, player.height * 0.4)

  context.fillStyle = '#e6402f'
  context.fillRect(player.x, player.y + headRadius * 1.1, player.width, player.height * 0.5)

  context.fillStyle = '#f5c99b'
  context.beginPath()
  context.arc(headCenterX, headCenterY, headRadius * 0.7, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#e6402f'
  context.beginPath()
  context.arc(headCenterX, headCenterY - headRadius * 0.15, headRadius * 0.75, Math.PI, 0)
  context.fill()
}

function drawWire(context: CanvasRenderingContext2D, wire: Wire, playerY: number) {
  context.strokeStyle = '#8a8a8a'
  context.lineWidth = WIRE_WIDTH
  context.beginPath()
  context.moveTo(wire.x, playerY)
  context.lineTo(wire.x, wire.y)
  context.stroke()

  context.fillStyle = '#8a8a8a'
  context.beginPath()
  context.moveTo(wire.x, wire.y - 8)
  context.lineTo(wire.x - 5, wire.y + 4)
  context.lineTo(wire.x + 5, wire.y + 4)
  context.closePath()
  context.fill()
}

function drawBubble(context: CanvasRenderingContext2D, bubble: Bubble) {
  const { radius } = BUBBLE_SIZE_CONFIG[bubble.sizeLevel]

  const gradient = context.createRadialGradient(
    bubble.x - radius * 0.3,
    bubble.y - radius * 0.3,
    radius * 0.1,
    bubble.x,
    bubble.y,
    radius,
  )
  gradient.addColorStop(0, '#bfe9ff')
  gradient.addColorStop(0.5, '#4fa8e8')
  gradient.addColorStop(1, '#1f6fc2')

  context.fillStyle = gradient
  context.beginPath()
  context.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2)
  context.fill()

  context.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  context.lineWidth = 2
  context.stroke()

  context.fillStyle = 'rgba(255, 255, 255, 0.7)'
  context.beginPath()
  context.ellipse(bubble.x - radius * 0.35, bubble.y - radius * 0.35, radius * 0.25, radius * 0.15, -0.5, 0, Math.PI * 2)
  context.fill()
}

interface GameScreenProps {
  onWin: () => void
  onLose: () => void
}

function GameScreen({ onWin, onLose }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [lives, setLives] = useState(STARTING_LIVES)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }

    const player = createPlayer()
    let wires: Wire[] = []
    let bubbles: Bubble[] = createTestBubbles()
    const blocks: Block[] = createTestBlocks()
    const pressedKeys = new Set<string>()
    let lastTimestamp: number | null = null
    let animationFrameId: number

    let livesRemaining = STARTING_LIVES
    let invulnerableUntil = 0
    let hasEnded = false

    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.key)
      if (event.key === ' ' && wires.length === 0) {
        wires.push({ x: player.x + player.width / 2, y: player.y })
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const update = (deltaTime: number, timestamp: number) => {
      if (pressedKeys.has('ArrowLeft')) {
        player.x -= PLAYER_SPEED * deltaTime
      }
      if (pressedKeys.has('ArrowRight')) {
        player.x += PLAYER_SPEED * deltaTime
      }
      player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x))

      wires = wires
        .map((wire) => ({ ...wire, y: wire.y - WIRE_SPEED * deltaTime }))
        .filter((wire) => wire.y > 0 && !blocks.some((block) => isWireBlockedByBlock(wire, block)))

      bubbles = bubbles.map((bubble) => {
        const moved = updateBubble(bubble, deltaTime)
        return blocks.reduce((current, block) => resolveBubbleBlockCollision(current, block), moved)
      })

      const resolved = resolveWireBubbleCollisions(wires, bubbles)
      wires = resolved.wires
      bubbles = resolved.bubbles

      if (bubbles.length === 0) {
        hasEnded = true
        onWin()
        return
      }

      if (timestamp >= invulnerableUntil && bubbles.some((bubble) => isPlayerHitByBubble(player, bubble))) {
        livesRemaining -= 1
        setLives(livesRemaining)
        invulnerableUntil = timestamp + PLAYER_INVULNERABLE_MS

        if (livesRemaining <= 0) {
          hasEnded = true
          onLose()
        } else {
          player.x = PLAYER_START_X
        }
      }
    }

    const draw = () => {
      drawBackground(context)

      for (const block of blocks) {
        drawBlock(context, block)
      }

      drawPlayer(context, player)

      for (const wire of wires) {
        drawWire(context, wire, player.y)
      }

      for (const bubble of bubbles) {
        drawBubble(context, bubble)
      }
    }

    const loop = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp
      }
      const deltaTime = (timestamp - lastTimestamp) / 1000
      lastTimestamp = timestamp

      update(deltaTime, timestamp)
      if (hasEnded) {
        return
      }
      draw()

      animationFrameId = requestAnimationFrame(loop)
    }
    animationFrameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [onWin, onLose])

  return (
    <div className="game-screen">
      <div className="game-screen__hud">목숨: {lives}</div>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="game-screen__canvas" />
    </div>
  )
}

export default GameScreen
