# Phase 3 설계 — Player 이동 (초안)

`docs/PLAN.md`의 Phase 3 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**
  - 게임 화면에 HTML `<canvas>` 기반의 게임 루프 도입 (이후 모든 게임 Phase의 공통 기반)
  - Player가 화면에 사각형으로 표시되고, 방향키 좌/우로 이동
  - 화면 좌/우 경계를 벗어나지 않음
- **제외**: Wire 발사(Phase 4), Bubble/Block(Phase 5~6), 충돌 처리(Phase 7~8)

## 2. 렌더링 방식

- 별도 게임 엔진 라이브러리를 추가하지 않고, `<canvas>` 2D context + `requestAnimationFrame` 루프로 직접 구현한다.
- 캔버스 논리 해상도는 고정값(`800 x 480`)을 사용하고, CSS로 화면 중앙에 배치한다.
- 매 프레임 `update(deltaTime)` → `draw()` 순서로 실행한다. `deltaTime`은 프레임 간 시간차(ms)로, 프레임레이트가 달라져도 이동 속도가 일정하게 유지되도록 한다.

## 3. 모듈 구조

```
src/game/types.ts        (신규) Player 등 게임 객체 타입 정의
src/game/constants.ts    (신규) 캔버스 크기, Player 크기/속도 등 상수
src/screens/GameScreen.tsx  (변경) placeholder 대신 캔버스 + 게임 루프 구현
src/screens/GameScreen.css  (변경) 캔버스 중앙 배치 스타일
```

## 4. 상세 설계

- `Player` 타입: `{ x, y, width, height }`
- Player는 `useRef`로 보관해 매 프레임 갱신하며(리렌더 없이), 화면에는 캔버스로만 그린다.
- 방향키 입력은 `keydown`/`keyup`으로 "현재 눌려있는 키 집합"을 추적하고, 매 프레임 그 상태를 보고 `player.x`를 `PLAYER_SPEED * deltaTime` 만큼 이동시킨다(연속 이동을 자연스럽게 만들기 위함).
- `player.x`가 `0` 미만이거나 `CANVAS_WIDTH - player.width`를 초과하지 않도록 clamp 처리한다.
- 컴포넌트 언마운트 시 `requestAnimationFrame`을 취소하고 키보드 리스너를 정리한다.

## 5. 가정 및 향후 조정 여지

- 캔버스 크기(800x480), Player 크기·속도는 시각적으로 확인하며 조정 가능한 임시값이다.
- 이 Phase에서는 화면에 Player만 보이면 되므로, 배경/장식 요소는 추가하지 않는다.
