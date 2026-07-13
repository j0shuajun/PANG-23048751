# Phase 14 설계 — Mission 4 난이도 적용 (초안)

`docs/PLAN.md`의 Phase 14 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**: `game/missionLevels.ts`에 `mission4` 데이터를 추가한다. Bubble 종류(크기)가 섞이고 Block이 2개로 늘어난다.
- **제외**: Mission 5 데이터(Phase 15)

## 2. 난이도 설계 방향

Mission 3까지는 큰 Bubble만 등장했다. Mission 4부터는 중간 크기 Bubble을 함께 배치해 "여러 크기가 섞여 있을 때도 분할 규칙이 각각 올바르게 동작하는지"를 확인하고, Block도 2개로 늘려 높이가 다른 장애물을 동시에 다루게 한다.

## 3. 데이터

```ts
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
}
```

- 큰 Bubble 2개(`sizeLevel: 0`) + 중간 Bubble 1개(`sizeLevel: 1`)로 구성한다.
- Block 2개를 서로 다른 높이(`y: 300`, `y: 220`)에 배치해 화면 좌/우 상단부를 각각 가로막는다.
- Bubble 수평 속도(`±120~130`)를 Mission 3(`±110`)보다 한 단계 더 올린다.

## 4. 가정 및 향후 조정 여지

- 중간 Bubble이 Wire에 맞으면 `docs/FEATURES/game_rule.md` 규칙대로 작은 Bubble 2개로 분할되는지는 이미 Phase 7에서 구현된 공용 로직(`resolveWireBubbleCollisions`)이 크기와 무관하게 동작하므로 별도 구현 없이 그대로 적용된다.
- Block 배치·Bubble 속도 수치는 초안이며, 플레이 후 조정될 수 있다.
