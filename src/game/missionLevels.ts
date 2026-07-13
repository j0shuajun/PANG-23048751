import type { Block, Bubble } from './types'

export interface MissionLevel {
  bubbles: Bubble[]
  blocks: Block[]
}

// docs/FEATURES/mission1.md 기준: 가장 쉬운 난이도(큰 Bubble 1개, Block 없음)
// Mission 2~5는 docs/design/phase12.md ~ phase15.md에서 정한 난이도 데이터다.
export const missionLevels: Record<string, MissionLevel> = {
  mission1: {
    bubbles: [{ x: 400, y: 100, vx: 90, vy: 0, sizeLevel: 0 }],
    blocks: [],
  },
  mission2: {
    bubbles: [
      { x: 250, y: 100, vx: 100, vy: 0, sizeLevel: 0 },
      { x: 550, y: 100, vx: -100, vy: 0, sizeLevel: 0 },
    ],
    blocks: [],
  },
  mission3: {
    bubbles: [
      { x: 220, y: 90, vx: 110, vy: 0, sizeLevel: 0 },
      { x: 580, y: 90, vx: -110, vy: 0, sizeLevel: 0 },
    ],
    blocks: [{ x: 325, y: 260, width: 150, height: 20 }],
  },
  mission4: {
    bubbles: [
      { x: 200, y: 90, vx: 130, vy: 0, sizeLevel: 0 },
      { x: 600, y: 90, vx: -130, vy: 0, sizeLevel: 0 },
      { x: 400, y: 150, vx: -120, vy: 0, sizeLevel: 1 },
    ],
    blocks: [
      { x: 150, y: 300, width: 130, height: 20 },
      { x: 520, y: 220, width: 130, height: 20 },
    ],
  },
  mission5: {
    bubbles: [
      { x: 180, y: 80, vx: 150, vy: 0, sizeLevel: 0 },
      { x: 620, y: 80, vx: -150, vy: 0, sizeLevel: 0 },
      { x: 350, y: 140, vx: -140, vy: 0, sizeLevel: 1 },
      { x: 450, y: 140, vx: 140, vy: 0, sizeLevel: 1 },
    ],
    blocks: [
      { x: 120, y: 320, width: 120, height: 20 },
      { x: 340, y: 240, width: 120, height: 20 },
      { x: 560, y: 320, width: 120, height: 20 },
    ],
  },
}
