<img width="1920" height="1080" alt="기획 디자인" src="https://github.com/user-attachments/assets/a85af7d8-82ad-4bd0-be8f-37108c590a61" />

“당신이 경험해 보지 못한 세계는 어떤 곳일까요?”

# ❎ 비전공자를 위한 융합 지식 큐레이션 플랫폼, CrossNote

- **🦁 2025 SWU 멋쟁이사자처럼 13기 - 슈멋사 프로젝트 1팀 프론트엔드 레포지토리**
- **배포 URL: https://likelion-1-fe-ry4u.vercel.app/login** 

### Background
> 현대 사회는 한 분야의 전문성을 넘어, 다양한 분야를 넘나드는 융합적 사고와 폭넓은 이해를 요구하고 있습니다. 정보의 양은 폭발적으로 증가했지만, 오히려 개인은 소셜 미디어와 추천 알고리즘의 '필터 버블'에 갇혀 편향된 지식만을 소비하기 쉬운 환경에 놓여있습니다. 이로 인해 자신이 경험해 보지 못한 미지의 세계에 대한 호기심을 잃고, 생각의 폭을 넓힐 기회를 놓치게 됩니다.

### Service Overview
> '크로스노트'는 이러한 시대적 흐름에 맞춰 지식의 경계를 허물고 새로운 관점을 제공하고자 합니다. 단순히 특정 분야의 지식을 전달하는 것을 넘어, 서로 다른 지식들을 자유롭게 연결하고 넘나들며 사용자만의 독창적인 지식 체계(雜學多識)를 쌓도록 돕습니다. 이를 통해 사용자가 존재조차 인식하지 못했던 새로운 세계를 우연히 발견하고, 지적 탐험의 과정을 통해 사고의 깊이를 더하고 자신의 세계를 확장해 나가는 데 이 프로젝트의 의의가 있습니다.


# 👩🏻‍💻 팀원 구성
| 김선화 | 송지은 | 김유빈 |
|:---:|:---:|:---:|
| <img width="100" height="150" src="https://github.com/user-attachments/assets/0d48b2f5-5137-41fe-afe6-a371510c6ab2"/> | <img width="100" height="150" src="https://github.com/user-attachments/assets/8009e7bb-7017-4eda-88bf-a89481795b08"/> | <img width="100" height="150" src="https://github.com/user-attachments/assets/dd1a0567-7bb4-4efb-90ea-e4814812868f"/> |
| [@김선화](https://github.com/sunhwa4210) | [@송지은](https://github.com/SongJi-eun6) | [@kimybin](https://github.com/kimybin) |
| Front-end | Front-end | Front-end |


# 🖥️ 기술 스택
- **Front** | React, Javascript, css module
- **배포** | Vercel

# 🔍 배포 방식
### 배포 선정 
- Vercel 기반 CDN(Content Delivery Network)

### 배포 구조
- React 앱 Build
- 정적 파일 생성
- CDN 업로드
- 사용자에게 가장 가까운 노드에서 파일 제공
- React 앱 실행
- API 서버로 데이터 요청


# 📆 프로젝트 개발 시나리오
- STEP 1 : 피그마로 재사용 가능한 작은 단위의 컴포넌트 분리
- STEP 2 : 아토믹 디자인 패턴을 기반으로 주요 페이지 설계
- STEP 3 : 웹앱의 뼈대와 고정된 기본 UI 구현
- STEP 4 : 기존에 사용하기로 한 Storybook은 사용 안 함
- STEP 5 : 상태 관리 정의 및 API 연동
- STEP 6 : 렌더링 성능 개선, 로딩 속도 최적화를 진행하여 리팩토링 진행 예정


# ⚙️ 페이지 간단 소개 
<img width="1920" height="1080" alt="기능소개" src="https://github.com/user-attachments/assets/4320ad57-340b-429a-b604-b58e54f38aa3" />
<img width="1920" height="1080" alt="기능소개-2" src="https://github.com/user-attachments/assets/b6ae3647-d122-4dd7-a101-c35d57b7b65b" />
<img width="1920" height="1080" alt="기능소개-3" src="https://github.com/user-attachments/assets/7ad48696-c2ab-4715-8e2c-964bcfd76593" />
<img width="1920" height="1080" alt="기능소개-4" src="https://github.com/user-attachments/assets/7ada59d0-714f-4a26-9f2c-2a2cd7aa4cb9" />


# 📁 프로젝트 구조
```
LIKELION_1_FE
├── .storybook/
├── node_modules/
├── public/
├── src/
│   ├── 📁 components/   # 재사용 가능한 컴포넌트 
│   ├── 📁 contexts/     # React Context API 관련 전역 상태 관리
│   ├── 📁 pages/        # 페이지 단위 컴포넌트
│   ├── 📁 stories/
│   ├── 📁 App.css       # App 전역 스타일
│   ├── 📁 App.js        # 최상위 App 컴포넌트
│   ├── 📁 index.css     # 전역 CSS 설정
│   ├── 📁 index.js
├── .env # 환경 변수 파일
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── vitest.config.js
```
