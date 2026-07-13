import { useEffect, useRef } from 'react'
import type { Player, Wire } from '../game/types'
import {
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
import './GameScreen.css'

function createPlayer(): Player {
  return { x: PLAYER_START_X, y: PLAYER_Y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }
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
