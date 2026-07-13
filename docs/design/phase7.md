# Phase 7 설계 — Wire와 Bubble 충돌(분할 규칙) (초안)

`docs/PLAN.md`의 Phase 7 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**
  - Wire가 Bubble에 맞으면 규칙대로 분할되거나 소멸함 (`docs/FEATURES/game_rule.md` 기준)
- **제외**: Player-Bubble 충돌/목숨 관리(Phase 8)

## 2. 모듈 구조

```
src/game/update.ts      (변경) Wire-Bubble 충돌 판정 및 분할 로직 추가
src/screens/GameScreen.tsx  (변경) 매 프레임 충돌 체크 후 Bubble 배열 갱신
```

## 3. 상세 설계

- **충돌 판정**: 매 프레임, 각 활성 Wire에 대해 모든 Bubble을 순회하며 Wire의 현재 위치(점)가 Bubble의 원(중심 `x,y`, 반지름) 안에 들어왔는지 검사한다(점-원 거리 비교). Wire는 프레임마다 위치가 갱신되므로, 매 프레임 판정으로 충분하다고 가정한다.
- **분할 규칙** (`docs/FEATURES/game_rule.md`에서 이미 "최대 2단계 분할"로 가정한 내용을 그대로 구현):
  - `sizeLevel 0`(큰 것)이 맞으면 → 제거하고, 같은 위치에 `sizeLevel 1`(중간 크기) Bubble 2개를 좌우로 살짝 벌어진 반대 방향 속도로 생성
  - `sizeLevel 1`이 맞으면 → 제거하고, `sizeLevel 2`(작은 것) Bubble 2개를 같은 방식으로 생성
  - `sizeLevel 2`가 맞으면 → 제거만 하고 새로 생성하지 않음(소멸)
  - 맞은 Wire도 함께 제거(소멸)한다.
- 한 프레임에 여러 충돌이 동시에 발생할 수 있으므로, 이번 프레임에 이미 처리된 Wire/Bubble은 중복 처리하지 않도록 한다.

## 4. 가정 및 향후 조정 여지

- 분할된 두 Bubble의 초기 수평 속도(좌우로 벌어지는 정도)는 임시값이며, 플레이해보고 조정한다.
- 점-원 충돌 판정은 Wire 이동 속도가 매우 빠를 경우 완전히 얇은 Bubble을 통과할 가능성이 있으나, 이번 KATA 범위에서는 발생 가능성이 낮다고 보고 별도 보정(연속 충돌 판정 등)은 하지 않는다.
