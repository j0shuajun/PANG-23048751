# Phase 15 설계 — Mission 5 난이도 적용 (초안, 최종 난이도)

`docs/PLAN.md`의 Phase 15 범위를 어떻게 구현할지 정리한 설계 문서다. 이 Phase가 끝나면 Mission 1~5 전체 난이도 구성이 완료된다.

## 1. 범위

- **포함**: `game/missionLevels.ts`에 `mission5` 데이터를 추가한다. 이번 KATA 범위 내 가장 어려운 구성이다.
- **제외**: 없음(마지막 난이도)

## 2. 난이도 설계 방향

Mission 4보다 Bubble 개수(4개)와 Block 개수(3개)를 한 단계 더 늘리고, Bubble 수평 속도도 가장 빠르게 해 지금까지 쌓아온 난이도 곡선의 정점으로 삼는다. 다만 "클리어 불가능"하게 느껴지지 않도록 Block 배치는 Player의 이동 동선을 완전히 막지 않는 선에서 구성한다.

## 3. 데이터

```ts
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
}
```

- 큰 Bubble 2개 + 중간 Bubble 2개, 총 4개로 구성한다.
- Block 3개를 좌/중앙/우로 나눠 배치하되, 중앙 Block만 더 높게(`y: 240`) 두어 층이 다른 장애물 구성을 만든다.
- Bubble 수평 속도(`±140~150`)는 Mission 4(`±120~130`)보다 한 단계 더 빠르게 한다.

## 4. 가정 및 향후 조정 여지

- Block 3개 중 어느 것도 화면 바닥의 Player 이동 가능 구간(`x: 0~800`, 바닥 근처)을 가리지 않도록 모두 `y ≤ 320`(바닥보다 충분히 위)에 배치했다. Player가 좌우로 움직이지 못해 막히는 상황은 없다고 가정한다.
- Mission 1→5 난이도 곡선(수평 속도, Bubble 개수/크기, Block 개수)이 완만하게 올라가는지는 실제 플레이 후 사람이 확인해 조정한다.
