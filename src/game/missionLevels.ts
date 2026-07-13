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
}
