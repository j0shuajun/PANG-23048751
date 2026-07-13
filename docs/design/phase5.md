# Phase 5 설계 — Bubble 기본 물리 (초안)

`docs/PLAN.md`의 Phase 5 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**
  - Bubble이 중력의 영향을 받아 포물선으로 튕기며 이동 (관찰용, 이 Phase에서는 Wire/Player와 충돌하지 않음)
  - 화면 좌/우/상단 경계에서 반사되고, 화면 밖으로 나가지 않음
- **제외**: Block/Wire/Player와의 충돌(Phase 6~8)

## 2. 모듈 구조

```
src/game/types.ts       (변경) Bubble 타입, 크기 단계(BubbleSizeLevel) 추가
src/game/constants.ts   (변경) GRAVITY, 크기별 반지름/반동 속도 추가
src/game/update.ts      (신규) Bubble 물리 갱신 함수 (순수 함수)
src/screens/GameScreen.tsx  (변경) 테스트용 Bubble 1~2개를 하드코딩해서 물리 확인
```

## 3. 상세 설계

- `Bubble` 타입: `{ x, y, vx, vy, sizeLevel }` (`sizeLevel`: `0`=큰 것, `1`=중간, `2`=작은 것)
- 크기별로 반지름과 "튕겨서 도달하는 높이"가 다르게 설정된다 — 큰 Bubble일수록 더 높이 튕긴다. (`docs/FEATURES/game_rule.md`가 정한 "튕길 때마다 같은 높이까지 올라간다"는 규칙을 크기별로 다른 고정 반동 속도로 구현)
- 매 프레임:
  1. `vy += GRAVITY * deltaTime` (중력 가속)
  2. `y += vy * deltaTime`, `x += vx * deltaTime`
  3. 바닥(화면 하단)에 닿으면 `vy = -bounceVelocity(sizeLevel)`로 반전 (같은 높이로 되튐)
  4. 좌/우 화면 경계에 닿으면 `vx`의 부호를 반전
  5. 화면 상단을 넘어가지 않도록 clamp (이론상 반동 속도가 화면 높이를 넘지 않게 설정하므로 발생 가능성은 낮지만 방어적으로 처리)
- 이 로직은 `src/game/update.ts`에 `updateBubble(bubble, deltaTime): Bubble` 순수 함수로 분리해, 이후 Phase(Block 충돌, Wire 충돌)에서 재사용/확장한다.
- Phase 5 시점에는 `GameScreen.tsx`에 테스트용 Bubble 배열(예: 큰 Bubble 1개)을 하드코딩해서 눈으로 물리 동작을 확인한다. 실제 미션 데이터 연결은 Phase 10에서 처리한다.

## 4. 가정 및 향후 조정 여지

- 중력 가속도, 크기별 반지름·반동 속도는 시각적으로 확인하며 조정할 임시값이다.
- 수평 속도(`vx`)는 크기와 무관하게 동일한 값으로 단순화한다.
