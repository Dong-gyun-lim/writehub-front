# WriteHub Frontend

창작자를 위한 구독 기반 기술 블로그 플랫폼 - 프론트엔드

## 📋 프로젝트 개요

| 항목        | 내용                                      |
| ----------- | ----------------------------------------- |
| 개발 기간   | 2026.03                                   |
| 개발 인원   | 1인                                       |
| 배포 주소   | https://writehub-front.vercel.app         |
| 백엔드 레포 | https://github.com/Dong-gyun-lim/writehub |

### 기획 의도

- WriteHub 백엔드 22개 API 연동 및 기능 확인
- React + Vite 기반 SPA 구성 경험
- 프론트엔드 배포 파이프라인 구축 (Vercel)

---

## 🎯 구현 기능

- ✅ 회원가입 / 로그인 / 로그아웃
- ✅ 게시글 목록 조회 (페이지네이션)
- ✅ 게시글 작성 / 수정 / 삭제
- ✅ 게시글 상세 조회 (태그, 조회수, 공개범위)
- ✅ 게시글 검색 (키워드 / 태그)
- ✅ 구독자 전용 게시글 잠금 표시 및 접근 제어
- ✅ 회원 프로필 조회 (팔로워 / 팔로잉 / 구독자 통계)
- ✅ 프로필 수정 (닉네임, 소개)
- ✅ 팔로우 / 언팔로우
- ✅ 구독 / 구독 취소

---

## 🛠 기술 스택

- React 19
- Vite 7
- react-router-dom (클라이언트 사이드 라우팅)
- Vercel (배포 + 프록시)

---

## 📁 프로젝트 구조

```
src/
├── api/
│   └── api.js          # fetch 공통 모듈 (22개 API)
├── pages/
│   ├── LoginPage.jsx   # 로그인 / 회원가입
│   ├── FeedPage.jsx    # 게시글 목록 + 검색
│   ├── PostPage.jsx    # 게시글 작성 / 상세 / 수정
│   └── ProfilePage.jsx # 프로필 / 팔로우 / 구독
├── App.jsx             # 라우팅 설정
└── main.jsx
```

---

## 🚀 로컬 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

로컬에서는 Vite 프록시를 통해 백엔드 서버와 통신합니다.

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://43.203.179.195:8080',
      changeOrigin: true,
    }
  }
}
```

---

## 🔜 향후 개선 계획

- 프로필 수정 (username, bio) - (✅ 완료)
- 백엔드 HTTPS 적용 (Mixed Content 근본 해결)

---

## 🚨 트러블슈팅

### 1. 로그인 후 세션 쿠키가 전달되지 않는 문제

**문제 상황**

- 로그인은 성공(200 OK)하지만 이후 `/api/members/me` 요청에서 401 발생
- 세션 쿠키가 다음 요청에 실려가지 않음

**원인**

- 프론트(`localhost:5173`)와 백엔드(`43.203.179.195:8080`)가 다른 Origin
- 브라우저는 크로스 오리진 요청에 쿠키를 기본적으로 차단
- `same-site: none`은 HTTPS에서만 동작, `same-site: lax`는 크로스 오리진 POST에 쿠키 미전송

**해결**

- Vite 개발 서버의 프록시 기능 활용
- 브라우저 입장에서 같은 Origin처럼 동작시켜 쿠키 정상 전송

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://43.203.179.195:8080',
      changeOrigin: true,
    }
  }
}

// api.js
const BASE_URL = import.meta.env.VITE_API_URL || ''; // 로컬: 빈 문자열 → 프록시 사용
```

**배운 점**

- CORS는 브라우저의 보안 정책 (Postman은 해당 없음)
- 크로스 오리진 쿠키 전송은 SameSite 정책에 따라 제한됨
- 프록시는 같은 Origin처럼 속여 쿠키 문제를 우회하는 방법
- 로컬 개발: Vite 프록시 / 배포 환경: Vercel rewrites로 동일하게 해결

---

### 2. Vercel 배포 후 Mixed Content 에러

**문제 상황**

- Vercel 배포 후 로그인 시 Mixed Content 에러 발생
- HTTPS 페이지에서 HTTP 백엔드로 요청이 브라우저에 의해 차단됨

**원인**

- Vercel은 자동으로 HTTPS 제공
- 백엔드 서버는 HTTP (`http://43.203.179.195:8080`)
- HTTPS 페이지에서 HTTP 리소스 요청은 브라우저가 차단 (Mixed Content)

**해결**

- Vercel의 rewrites 기능으로 프록시 설정
- 프론트에서 백엔드를 직접 호출하지 않고 Vercel이 중간에서 전달

```json
{
    "rewrites": [
        {
            "source": "/api/:path*",
            "destination": "http://43.203.179.195:8080/api/:path*"
        }
    ]
}
```

**배운 점**

- HTTPS → HTTP 요청은 브라우저가 Mixed Content로 차단
- 로컬(Vite proxy)과 배포(Vercel rewrites) 모두 프록시로 해결 가능
- 근본적 해결은 백엔드도 HTTPS 적용 (추후 개선 예정)

---

### 3. Vercel 배포 후 새로고침 시 404 에러

**문제 상황**

- 게시글 상세 페이지(`/post/11`) 등에서 새로고침 시 404 에러 발생

**원인**

- React는 `index.html` 하나로 모든 라우팅을 클라이언트에서 처리하는 SPA
- 새로고침 시 브라우저가 Vercel 서버에 `/post/11` 파일을 직접 요청
- Vercel 입장에서는 해당 파일이 없으므로 404 반환

**해결**

- `vercel.json`에 모든 경로를 `index.html`로 fallback하는 rewrite 규칙 추가

```json
{
    "rewrites": [
        {
            "source": "/api/:path*",
            "destination": "http://43.203.179.195:8080/api/:path*"
        },
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ]
}
```

**배운 점**

- SPA는 실제 파일이 아닌 클라이언트 라우팅으로 동작하므로 서버에 fallback 설정 필요
- `/(.*)`로 모든 경로를 `index.html`로 보내면 React Router가 처리 가능

---

### 4. 백엔드 응답 필드명 불일치

**문제 상황**

- 게시글 클릭 시 `/api/posts/undefined` 로 요청 발생
- 프로필 페이지 접속 시 `/api/members/undefined` 로 요청 발생

**원인**

- 백엔드 응답 필드명이 `id`가 아닌 커스텀 네이밍 사용
    - `id` → `postId`
    - `id` → `memberId`
- 프론트에서 `post.id`, `me.id` 로 접근했으나 실제 필드명과 불일치

**해결**

```javascript
// 수정 전
navigate(`/post/${post.id}`);
navigate(`/profile/${me?.id}`);

// 수정 후
navigate(`/post/${post.postId}`);
navigate(`/profile/${me?.memberId}`);
```

**배운 점**

- API 연동 전 반드시 Response JSON 필드명 확인 필요
- Network 탭 → Response 탭으로 실제 응답 구조 확인하는 습관 필요

---

### 5. 구독자 전용 게시글 403 에러 처리

**문제 상황**

- 구독자 전용 게시글 클릭 시 백엔드에서 403 Forbidden 반환
- 프론트에서 아무런 안내 없이 로딩만 지속됨

**원인**

- 백엔드에서 구독자가 아닌 사용자의 접근을 403으로 차단
- 프론트에서 403 응답에 대한 처리 로직 없음

**해결**

- 게시글 목록에서 `SUBSCRIBER_ONLY` 게시글에 🔒 구독자 전용 배지 표시
- 상세 조회 시 403 응답 받으면 alert 후 피드로 리다이렉트

```javascript
// api.js - 상태코드 포함한 에러 throw
throw new Error(`${response.status}:${error.message || '요청 실패'}`);

// PostPage.jsx - 403 처리
.catch((e) => {
  if (e.message.startsWith('403')) {
    alert('구독자 전용 게시글입니다.');
    navigate('/feed');
  } else {
    setError(e.message);
  }
});
```

**배운 점**

- HTTP 상태코드를 에러 메시지에 포함시켜 클라이언트에서 분기 처리 가능
- 사용자 경험을 위해 접근 불가 이유를 명확하게 안내해야 함

---

## 👤 개발자

임동균

- 경일대학교 컴퓨터사이언스학부 클라우드컴퓨팅 전공 (GPA 4.37/4.5)
- Email: sfeagle130@naver.com
- GitHub: https://github.com/Dong-gyun-lim
