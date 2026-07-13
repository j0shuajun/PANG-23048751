import type { Block, Bubble } from './types'

export interface MissionLevel {
  bubbles: Bubble[]
  blocks: Block[]
}

// docs/FEATURES/mission1.md 기준: 가장 쉬운 난이도(큰 Bubble 1개, Block 없음)
export const missionLevels: Record<string, MissionLevel> = {
  mission1: {
    bubbles: [{ x: 400, y: 100, vx: 90, vy: 0, sizeLevel: 0 }],
    blocks: [],
  },
}
