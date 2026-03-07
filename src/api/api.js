const BASE_URL = import.meta.env.VITE_API_URL || ''; //v2

// fetch 공통 함수
const request = async (method, url, body = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 세션 쿠키 자동 포함
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${url}`, options);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || '요청 실패');
    }

    // 204 No Content는 body 없음
    if (response.status === 204) return null;
    return response.json();
};

// 회원 API
export const memberApi = {
    signup: (data) => request('POST', '/api/members', data),
    login: (data) => request('POST', '/api/login', data),
    logout: () => request('POST', '/api/logout'),
    getAll: () => request('GET', '/api/members'),
    getMe: () => request('GET', '/api/members/me'),
    getProfile: (memberId) => request('GET', `/api/members/${memberId}`),
};

// 게시글 API
export const postApi = {
    create: (data) => request('POST', '/api/posts', data),
    getAll: (page = 0) => request('GET', `/api/posts?page=${page}&size=10`),
    getOne: (postId) => request('GET', `/api/posts/${postId}`),
    update: (postId, data) => request('PUT', `/api/posts/${postId}`, data),
    delete: (postId) => request('DELETE', `/api/posts/${postId}`),
    getByMember: (memberId) => request('GET', `/api/members/${memberId}/posts`),
};

// 팔로우 API
export const followApi = {
    follow: (followingId) => request('POST', `/api/members/${followingId}/follow`),
    unfollow: (followingId) => request('DELETE', `/api/members/${followingId}/follow`),
    getFollowing: (memberId) => request('GET', `/api/members/${memberId}/following`),
    getFollowers: (memberId) => request('GET', `/api/members/${memberId}/followers`),
};

// 구독 API
export const subscriptionApi = {
    subscribe: (creatorId) => request('POST', `/api/members/${creatorId}/subscribe`),
    unsubscribe: (creatorId) => request('DELETE', `/api/members/${creatorId}/subscribe`),
    getSubscriptions: (memberId) => request('GET', `/api/members/${memberId}/subscriptions`),
    getSubscribers: (creatorId) => request('GET', `/api/members/${creatorId}/subscribers`),
};