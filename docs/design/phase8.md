# Phase 8 설계 — Player-Bubble 충돌과 목숨 관리 (초안)

`docs/PLAN.md`의 Phase 8 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**
  - Player가 Bubble에 닿으면 목숨이 줄어듦
  - 목숨이 모두 소진되면 게임 오버 처리(결과 화면으로 전환 — Phase 9에서 화면 자체를 만들고, 이번 Phase에서는 "게임 오버 판정과 화면 전환 신호"까지 구현)
- **제외**: 결과 화면 UI 자체(Phase 9), Mission 1 난이도 데이터 연결(Phase 10)

## 2. 모듈 구조

```
src/game/constants.ts    (변경) STARTING_LIVES, 무적 시간(ms) 상수 추가
src/game/update.ts       (변경) Player-Bubble 충돌 판정 함수 추가
src/screens/GameScreen.tsx  (변경) 목숨 state, HUD 표시, 충돌 시 처리, onLose 콜백 호출
src/App.tsx              (변경) onLose 수신 시 결과 화면으로 전환할 수 있도록 화면 상태 확장
```

## 3. 상세 설계

- **충돌 판정**: 매 프레임, Player의 사각형과 각 Bubble의 원 사이 거리를 계산해 겹치는지 확인한다(사각형-원 충돌).
- **목숨 관리**: 목숨은 `useState<number>(STARTING_LIVES)`로 관리해 HUD에 표시한다(캔버스 밖 또는 캔버스 내 텍스트).
- **피격 처리**:
  1. 목숨을 1 감소시킨다.
  2. Player 위치를 시작 위치로 되돌린다.
  3. 짧은 무적 시간(예: 1.2초) 동안 Player-Bubble 충돌 판정을 건너뛰어, 같은 Bubble에 연속으로 맞아 목숨이 순식간에 소진되는 것을 방지한다.
- **게임 오버**: 목숨이 `0`이 되는 순간 `onLose()` 콜백을 호출해 `App.tsx`가 화면을 전환하도록 한다. `App.tsx`는 `screen` 상태에 `'result'`를 추가하고, 승패 결과(`'win' | 'lose'`)를 별도 state로 함께 저장한다(화면 자체는 Phase 9에서 구현).

## 4. 가정 및 향후 조정 여지

- 시작 목숨 수(3개), 무적 시간(1.2초)은 `docs/FEATURES/game_rule.md`에 이미 "임시 설정"으로 명시된 값을 그대로 따른다.
- 피격 시 Bubble 배치 자체를 초기화하지는 않는다(플레이어 위치만 리셋). 이 편이 "한 대 맞았다고 처음부터 다시 깨야 하는" 좌절감을 줄인다고 판단했으나, 플레이해보고 너무 쉬우면 조정한다.
