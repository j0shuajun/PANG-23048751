# Phase 4 설계 — Wire 발사 (초안)

`docs/PLAN.md`의 Phase 4 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**
  - Space 키 입력 시 Player 위치에서 수직 위 방향으로 Wire 발사
  - Wire가 화면 상단에 닿으면 사라짐
- **제외**: Bubble/Block과의 충돌(Phase 6~7)

## 2. 모듈 구조

```
src/game/types.ts        (변경) Wire 타입 추가
src/game/constants.ts    (변경) WIRE_SPEED 등 상수 추가
src/screens/GameScreen.tsx  (변경) Wire 발사/이동/소멸 로직 추가
```

## 3. 상세 설계

- `Wire` 타입: `{ x, y, active }` — `x`는 발사 시점 Player 중앙 x로 고정, `y`는 매 프레임 위로 이동.
- Wire 목록은 `useRef<Wire[]>`로 관리한다.
- Space `keydown` 시 **현재 활성 상태인 Wire가 하나도 없을 때만** 새 Wire를 추가한다. (원본 게임보다 단순화된 규칙 범위에서, 발사 속도 제한을 위한 가장 단순한 방식으로 "동시에 1개"를 임시로 채택)
- 매 프레임 각 Wire의 `y -= WIRE_SPEED * deltaTime`; `y <= 0`이 되면 배열에서 제거한다.
- 그리기: Player 중앙에서 Wire의 현재 `y`까지 얇은 세로선으로 그린다.

## 4. 가정 및 향후 조정 여지

- "동시에 1개의 Wire만 존재"는 `docs/FEATURES/game_rule.md`에 명시되지 않아 임시로 정한 규칙이다. 플레이해보고 너무 답답하면 이후 조정한다.
- Wire 색상/두께 등 시각 스타일은 임시값이다.
