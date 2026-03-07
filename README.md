WriteHub Frontend
창작자를 위한 구독 기반 기술 블로그 플랫폼 - 프론트엔드
📋 프로젝트 개요
개발 기간: 2026.03
개발 인원: 1인
배포 주소: https://writehub-front.vercel.app
백엔드 레포: https://github.com/Dong-gyun-lim/writehub
기획 의도:

WriteHub 백엔드 22개 API 연동 및 기능 확인
React + Vite 기반 SPA 구성 경험
프론트엔드 배포 파이프라인 구축 (Vercel)

🎯 구현 기능

✅ 회원가입 / 로그인 / 로그아웃
✅ 게시글 목록 조회 (페이지네이션)
✅ 게시글 작성 / 수정 / 삭제
✅ 게시글 상세 조회 (태그, 조회수, 공개범위)
✅ 회원 프로필 조회 (팔로워/팔로잉/구독자 통계)
✅ 팔로우 / 언팔로우
✅ 구독 / 구독 취소

🛠 기술 스택

React 19
Vite 7
react-router-dom (클라이언트 사이드 라우팅)
Vercel (배포 + 프록시)

📁 프로젝트 구조
src/
├── api/
│ └── api.js # fetch 공통 모듈 (22개 API)
├── pages/
│ ├── LoginPage.jsx # 로그인 / 회원가입
│ ├── FeedPage.jsx # 게시글 목록
│ ├── PostPage.jsx # 게시글 작성 / 상세 / 수정
│ └── ProfilePage.jsx # 프로필 / 팔로우 / 구독
├── App.jsx # 라우팅 설정
└── main.jsx

🚀 로컬 실행 방법
bash# 의존성 설치
npm install

# 개발 서버 실행

npm run dev
로컬에서는 Vite 프록시를 통해 백엔드 서버와 통신합니다.
vite.config.js:
javascriptserver: {
proxy: {
'/api': {
target: 'http://43.203.179.195:8080',
changeOrigin: true,
}
}
}

🔜 향후 개선 계획
백엔드 API 추가 후 프론트 연동 예정

게시글 검색 (제목 / 내용 / 태그)
프로필 수정 (username, bio)

🚨 트러블슈팅

1. 로그인 후 세션 쿠키가 전달되지 않는 문제
   문제 상황

로그인은 성공(200 OK)하지만 이후 /api/members/me 요청에서 401 발생
세션 쿠키가 다음 요청에 실려가지 않음

원인

프론트(localhost:5173)와 백엔드(43.203.179.195:8080)가 다른 Origin
브라우저는 크로스 오리진 요청에 쿠키를 기본적으로 차단
same-site: none은 HTTPS에서만 동작, same-site: lax는 크로스 오리진 POST에 쿠키 미전송

해결

Vite 개발 서버의 프록시 기능 활용
브라우저 입장에서 같은 Origin처럼 동작시켜 쿠키 정상 전송

javascript// vite.config.js
server: {
proxy: {
'/api': {
target: 'http://43.203.179.195:8080',
changeOrigin: true,
}
}
}
javascript// api.js
const BASE_URL = import.meta.env.VITE_API_URL || ''; // 로컬: 빈 문자열 → 프록시 사용
배운 점

CORS는 브라우저의 보안 정책 (Postman은 해당 없음)
크로스 오리진 쿠키 전송은 SameSite 정책에 따라 제한됨
프록시는 같은 Origin처럼 속여 쿠키 문제를 우회하는 방법
로컬 개발: Vite 프록시 / 배포 환경: Vercel rewrites로 동일하게 해결

2. Vercel 배포 후 Mixed Content 에러
   문제 상황

Vercel 배포 후 로그인 시 Mixed Content 에러 발생
HTTPS 페이지에서 HTTP 백엔드로 요청이 브라우저에 의해 차단됨

원인

Vercel은 자동으로 HTTPS 제공
백엔드 서버는 HTTP(http://43.203.179.195:8080)
HTTPS 페이지에서 HTTP 리소스 요청은 브라우저가 차단 (Mixed Content)

해결

Vercel의 rewrites 기능으로 프록시 설정
프론트에서 백엔드를 직접 호출하지 않고 Vercel이 중간에서 전달

json// vercel.json
{
"rewrites": [
{
"source": "/api/:path*",
"destination": "http://43.203.179.195:8080/api/:path*"
}
]
}
배운 점

HTTPS → HTTP 요청은 브라우저가 Mixed Content로 차단
로컬(Vite proxy)과 배포(Vercel rewrites) 모두 프록시로 해결 가능
근본적 해결은 백엔드도 HTTPS 적용 (추후 개선 예정)

3. 백엔드 응답 필드명 불일치
   문제 상황

게시글 클릭 시 /api/posts/undefined 로 요청 발생
프로필 페이지 접속 시 /api/members/undefined 로 요청 발생

원인

백엔드 응답 필드명이 id가 아닌 커스텀 네이밍 사용

id → postId
id → memberId

프론트에서 post.id, me.id 로 접근했으나 실제 필드명과 불일치

해결
javascript// 수정 전
navigate(`/post/${post.id}`)
navigate(`/profile/${me?.id}`)

// 수정 후
navigate(`/post/${post.postId}`)
navigate(`/profile/${me?.memberId}`)
배운 점

API 연동 전 반드시 Response JSON 필드명 확인 필요
Network 탭 → Response 탭으로 실제 응답 구조 확인하는 습관 필요

👤 개발자
임동균

경일대학교 컴퓨터사이언스학부 클라우드컴퓨팅 전공 (GPA 4.37/4.5)
Email: sfeagle130@naver.com
GitHub: https://github.com/Dong-gyun-lim
