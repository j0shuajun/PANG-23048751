# Phase 12 설계 — Mission 2 난이도 적용 (초안)

`docs/PLAN.md`의 Phase 12 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**: `game/missionLevels.ts`에 `mission2` 데이터를 추가해, Mission 2를 선택하면 실제 Mission 2 전용 난이도로 플레이되도록 한다.
- **제외**: Mission 3~5 데이터(각각 Phase 13~15에서 처리)

## 2. 난이도 설계 방향

Mission 1(큰 Bubble 1개, Block 없음) 바로 다음 단계로, "Bubble이 2개로 늘어나면 어떻게 달라지는지"만 경험하게 하는 것이 목표다. Block은 아직 등장시키지 않는다.

## 3. 데이터

```ts
mission2: {
  bubbles: [
    { x: 250, y: 100, vx: 100, vy: 0, sizeLevel: 0 },
    { x: 550, y: 100, vx: -100, vy: 0, sizeLevel: 0 },
  ],
  blocks: [],
}
```

- 큰 Bubble(`sizeLevel: 0`) 2개를 화면 좌/우로 나눠 배치하고, 서로 반대 방향으로 튕겨나가게 해 겹치지 않게 한다.
- 수평 속도(`vx: ±100`)는 Mission 1(`±90`)보다 살짝 빠르게 해 체감 난이도를 조금 올린다.

## 4. 가정 및 향후 조정 여지

- Bubble 2개가 서로 부딪히는 경우(Bubble-Bubble 충돌)는 이번 KATA 규칙 범위에 포함되지 않으므로 별도 처리하지 않는다(서로 통과함).
- 수치는 초안이며, 플레이해보고 너무 쉽거나 어려우면 조정한다.
