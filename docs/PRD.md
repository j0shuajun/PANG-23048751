# PANG (팡) 게임 PRD

## 1. 개요

- **장르**: Bubble을 모두 터뜨리는 아케이드 게임
- **목적**: 맵에서 튕겨다니는 모든 Bubble을 전부 제거하는 것
- **원본 게임 참고 영상**: https://www.youtube.com/shorts/lXZV3DX8X2w
- 이번 프로젝트는 원작을 그대로 구현하지 않고, 아래에 정리한 **단순화된 자체 규칙(KATA)** 을 따른다.

## 2. 구성 Object

게임은 4개의 Object로 구성된다.

1. **Player**: 주인공, 좌우로만 이동 가능
2. **Wire**: 수직으로 위로만 발사 가능
3. **Bubble**: 제거해야 하는 방울
4. **Block**: 벽

## 3. 게임 규칙

### Player
- 키보드 방향키 좌/우 버튼으로 이동한다.
- Bubble에 닿으면 목숨을 잃는다.
- 수직 방향 위로만 Wire를 발사할 수 있다.
- 모든 Bubble을 소멸시키면 승리한다.

### Bubble
- 좌/우 방향으로 공처럼 튕겨진다.
- 중력의 영향을 받으며, 튕길 때마다 같은 높이까지 올라간다.
- 일반 Bubble은 Wire에 맞으면 더 작은 Bubble 2개로 분할되고, 더 이상 작아질 수 없는 가장 작은 Bubble은 Wire에 맞으면 소멸한다.
- 화면 밖으로 Bubble이 나갈 수 없다.

### Wire
- Space 키로 발사한다.
- Bubble을 맞추면 작은 2개로 분할시킨다.
- 벽(Block)은 뚫지 못한다.

### Block
- 벽은 부서지지 않는다.
- Bubble은 Block 위로 튕겨질 수 있다.

## 4. 참고 자료

- 원본 게임 참고 영상: https://www.youtube.com/shorts/lXZV3DX8X2w
- 출처: CRA 교안 `[CRA_AI] Day1_6_Agentic Engineering.pdf` (KATA 소개 PANG / Pang KATA 규칙)
