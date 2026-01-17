# 📄 게임 기획서: Web Quick Shot (가칭)

## 1. 프로젝트 개요 (Overview)
* **프로젝트명:** Web Quick Shot
* **장르:** 1인칭 슈팅(FPS) / 타임어택 아케이드 / 에임 트레이닝
* **플랫폼:** PC 웹 브라우저 (설치 불필요, URL 접속)
* **개발 목표:** 넥스트 JS 기반의 가벼운 웹 환경에서 '스틸스 마스터' 류의 잠입/암살 미션을 빠르고 직관적으로 즐길 수 있는 게임 구현.

## 2. 핵심 게임 루프 (Core Gameplay Loop)
1.  **Start:** 게임 시작 버튼 클릭 시 타이머 작동 (예: 60초).
2.  **Scan:** 3D 공간 내에서 목표물(타겟) 식별.
3.  **Aim & Fire:** 마우스로 조준하고 클릭하여 사격.
4.  **Feedback:**
    * **성공:** 타겟 파괴 시 점수 획득 + 제한 시간 연장 (+3초).
    * **실패:** 빗나가거나 민간인 사격 시 페널티 (시간 감소).
5.  **Game Over:** 제한 시간 종료 시 최종 스코어 보드 출력 및 '다시 하기' 버튼 활성화.

## 3. 상세 시스템 기획

### A. 조작법 (Controls)
* **이동:** WASD (전후좌우 이동)
* **시점 전환:** 마우스 이동 (Pointer Lock API 사용)
* **공격:** 마우스 왼쪽 버튼 (Raycasting 히트스캔 방식)
* **점프 (옵션):** Space Bar

### B. 타겟 및 오브젝트 (Objects)
* **적 (Target):**
    * *유형:* 고정형 드론, 이동하는 가드(NPC).
    * *반응:* 피격 시 파티클 효과와 함께 사라짐.
* **장애물 (Obstacle):** 상자, 벽, 기둥 (엄폐 및 이동 동선 방해용).
* **무기:** 반동이 적은 레이저 류 or 소음기 권총 (즉발식 히트스캔).

### C. 레벨 디자인 (Level Design)
* 복잡한 맵 대신 '방(Room)' 단위의 스테이지 구성.
* 직관적인 구조 (단층 구조 위주)로 에임과 반응 속도에 집중.

## 4. 기술 스택 (Tech Stack)
* **Frontend Framework:** Next.js (App Router 권장)
* **3D Engine:** React-Three-Fiber (R3F)
* **Helpers:** @react-three/drei (카메라, 컨트롤, 환경 설정용)
* **Physics/Collision:** Raycaster (Three.js 내장) 또는 Rapier (필요시 도입)
* **State Management:** Zustand (점수, 시간, 게임 상태 관리)
* **Styling:** Tailwind CSS (HUD 및 메뉴 UI)

## 5. UI/UX 디자인
* **HUD (Heads-Up Display):**
    * 화면 중앙: 크로스헤어(조준점) 고정.
    * 좌측 상단: 현재 점수.
    * 상단 중앙: 남은 시간 (타이머).
* **메뉴:** 미니멀한 디자인, 오버레이 형태의 Start/Game Over 화면.