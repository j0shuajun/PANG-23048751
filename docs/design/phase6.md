# Phase 6 설계 — Block 배치와 충돌 (초안)

`docs/PLAN.md`의 Phase 6 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**
  - Block(파괴되지 않는 고정 장애물)을 화면에 배치
  - Bubble이 Block 위쪽 면에서 튕겨 올라감
  - Wire가 Block에 닿으면 그 지점에서 사라짐
- **제외**: Wire-Bubble 분할(Phase 7), Player-Bubble 충돌(Phase 8)

## 2. 모듈 구조

```
src/game/types.ts       (변경) Block 타입 추가
src/game/update.ts      (변경) Bubble-Block 충돌, Wire-Block 충돌 함수 추가
src/screens/GameScreen.tsx  (변경) 테스트용 Block 1~2개 하드코딩, 충돌 반영
```

## 3. 상세 설계

- `Block` 타입: `{ x, y, width, height }`
- **Bubble-Block 충돌**: Bubble의 중심 x가 Block의 가로 범위 안에 있고, Bubble의 하단(`y + radius`)이 Block의 윗면(`y`)에 닿거나 지나치려는 프레임이면, `vy = -bounceVelocity(sizeLevel)`로 반전시키고 Bubble의 위치를 Block 윗면 바로 위로 보정한다. (Phase 5의 바닥 반사와 동일한 방식을 Block 윗면에도 적용)
- **Wire-Block 충돌**: Wire의 x가 Block의 가로 범위 안에 있고, Wire의 `y`가 Block의 아랫면(`y + height`) 이하로 내려가면(=Block에 닿으면) 해당 Wire를 비활성 처리(제거)한다.
- 그리기: Block은 단색 사각형으로 그린다.
- Phase 5에서 분리한 `update.ts`에 이 충돌 함수들을 추가해, Bubble/Wire 갱신 로직과 함께 매 프레임 호출한다.

## 4. 가정 및 향후 조정 여지

- 이 Phase의 테스트용 Block 배치(개수/위치)는 충돌 확인용 임시값이며, 실제 Mission 1 배치는 Phase 10에서 확정한다(`docs/FEATURES/mission1.md` 기준 "Block 배치: 없음 또는 최소 발판 1개").
- Bubble이 Block 옆면에 부딪히는 경우(수평 충돌)는 이번 Phase 범위에 포함하지 않는다 — Mission 1 난이도상 필요성이 낮아 발생 시 후속 조정한다.
