import { useEffect, useRef, useState } from 'react'
import type { Block, Bubble, Player, Wire } from '../game/types'
import {
  BUBBLE_SIZE_CONFIG,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
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

interface GameScreenProps {
  onLose: () => void
}

function GameScreen({ onLose }: GameScreenProps) {
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
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      context.fillStyle = '#8a6d3b'
      for (const block of blocks) {
        context.fillRect(block.x, block.y, block.width, block.height)
      }

      context.fillStyle = '#aa3bff'
      context.fillRect(player.x, player.y, player.width, player.height)

      context.strokeStyle = '#aa3bff'
      context.lineWidth = WIRE_WIDTH
      for (const wire of wires) {
        context.beginPath()
        context.moveTo(wire.x, player.y)
        context.lineTo(wire.x, wire.y)
        context.stroke()
      }

      context.fillStyle = '#3ba0ff'
      for (const bubble of bubbles) {
        const { radius } = BUBBLE_SIZE_CONFIG[bubble.sizeLevel]
        context.beginPath()
        context.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2)
        context.fill()
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
  }, [onLose])

  return (
    <div className="game-screen">
      <div className="game-screen__hud">목숨: {lives}</div>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="game-screen__canvas" />
    </div>
  )
}

export default GameScreen
