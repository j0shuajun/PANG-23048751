# Phase 13 설계 — Mission 3 난이도 적용 (초안)

`docs/PLAN.md`의 Phase 13 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**: `game/missionLevels.ts`에 `mission3` 데이터를 추가한다. Mission 3에서 Block(장애물)이 처음 등장한다.
- **제외**: Mission 4~5 데이터(Phase 14~15)

## 2. 난이도 설계 방향

Mission 2와 같은 Bubble 구성에 Block 1개를 화면 중간 높이에 추가해, Bubble의 튕기는 경로와 Wire 사거리에 실제로 영향을 주는 장애물을 처음 경험하게 한다.

## 3. 데이터

```ts
mission3: {
  bubbles: [
    { x: 220, y: 90, vx: 110, vy: 0, sizeLevel: 0 },
    { x: 580, y: 90, vx: -110, vy: 0, sizeLevel: 0 },
  ],
  blocks: [
    { x: 325, y: 260, width: 150, height: 20 },
  ],
}
```

- Block을 화면 정중앙(`x: 325~475`), 높이 `y: 260` 지점에 배치한다. Player가 서 있는 바닥(`y ≈ 376`)보다 위, Bubble 시작 높이(`y: 90`)보다 아래에 위치해 Bubble이 떨어지다 이 Block 위에서 튕기거나, Player가 Block 바로 아래에서 Wire를 쏘면 Block에 막히는 상황이 실제로 발생하도록 한다.
- Bubble 수평 속도(`±110`)는 Mission 2(`±100`)보다 소폭 증가시킨다.

## 4. 가정 및 향후 조정 여지

- Block의 정확한 위치는 "Bubble 경로에 실제로 영향을 준다"는 목적에 맞춰 임시로 정한 값이며, 플레이 후 조정될 수 있다.
