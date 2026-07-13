import { useEffect, useRef } from 'react'
import type { Bubble, Player, Wire } from '../game/types'
import {
  BUBBLE_SIZE_CONFIG,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_START_X,
  PLAYER_WIDTH,
  PLAYER_Y,
  WIRE_SPEED,
  WIRE_WIDTH,
} from '../game/constants'
import { updateBubble } from '../game/update'
import './GameScreen.css'

function createPlayer(): Player {
  return { x: PLAYER_START_X, y: PLAYER_Y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }
}

// Phase 5 확인용 테스트 데이터. 실제 Mission 데이터 연결은 Phase 10에서 처리한다.
function createTestBubbles(): Bubble[] {
  return [{ x: 200, y: 100, vx: 90, vy: 0, sizeLevel: 0 }]
}

function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }

    const player = createPlayer()
    let wires: Wire[] = []
    let bubbles: Bubble[] = createTestBubbles()
    const pressedKeys = new Set<string>()
    let lastTimestamp: number | null = null
    let animationFrameId: number

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

    const update = (deltaTime: number) => {
      if (pressedKeys.has('ArrowLeft')) {
        player.x -= PLAYER_SPEED * deltaTime
      }
      if (pressedKeys.has('ArrowRight')) {
        player.x += PLAYER_SPEED * deltaTime
      }
      player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x))

      wires = wires
        .map((wire) => ({ ...wire, y: wire.y - WIRE_SPEED * deltaTime }))
        .filter((wire) => wire.y > 0)

      bubbles = bubbles.map((bubble) => updateBubble(bubble, deltaTime))
    }

    const draw = () => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

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

      update(deltaTime)
      draw()

      animationFrameId = requestAnimationFrame(loop)
    }
    animationFrameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="game-screen">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="game-screen__canvas" />
    </div>
  )
}

export default GameScreen
