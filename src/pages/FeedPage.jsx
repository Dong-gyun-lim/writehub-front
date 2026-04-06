import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi, memberApi } from '../api/api';

function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [me, setMe] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [tag, setTag] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const navigate = useNavigate();

    // 내 정보 조회
    useEffect(() => {
        memberApi
            .getMe()
            .then((data) => setMe(data))
            .catch(() => navigate('/'));
    }, []);

    // 게시글 목록 조회
    useEffect(() => {
        if (isSearchMode) {
            postApi
                .search(keyword, tag, page)
                .then((data) => {
                    setPosts(data.content ?? []);
                    setTotalPages(data.totalPages ?? 0);
                })
                .catch((e) => console.error(e));
        } else {
            postApi
                .getAll(page)
                .then((data) => {
                    setPosts(data.content ?? []);
                    setTotalPages(data.totalPages ?? 0);
                })
                .catch((e) => console.error(e));
        }
    }, [page, isSearchMode]);

    const handleSearch = () => {
        setPage(0);
        setIsSearchMode(true);
        postApi
            .search(keyword, tag, 0)
            .then((data) => {
                setPosts(data.content ?? []);
                setTotalPages(data.totalPages ?? 0);
            })
            .catch((e) => console.error(e));
    };

    const handleReset = () => {
        setKeyword('');
        setTag('');
        setIsSearchMode(false);
        setPage(0);
    };

    const handleLogout = async () => {
        await memberApi.logout();
        navigate('/');
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
            {/* 헤더 */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                <h1 onClick={handleReset} style={{ cursor: 'pointer' }}>
                    ✍️ WriteHub
                </h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {me && (
                        <button
                            onClick={() => navigate(`/profile/${me?.memberId}`)}
                        >
                            내 프로필
                        </button>
                    )}
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            </div>

            {/* 검색창 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                    placeholder="키워드 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ flex: 1, padding: '8px' }}
                />
                <input
                    placeholder="태그 검색"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ flex: 1, padding: '8px' }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '8px 16px',
                        background: '#333',
                        color: '#fff',
                    }}
                >
                    검색
                </button>
                {isSearchMode && (
                    <button
                        onClick={handleReset}
                        style={{ padding: '8px 16px', background: '#eee' }}
                    >
                        초기화
                    </button>
                )}
            </div>

            {/* 게시글 작성 버튼 */}
            <button
                onClick={() => navigate('/post/new')}
                style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '20px',
                    background: '#333',
                    color: '#fff',
                }}
            >
                + 게시글 작성
            </button>

            {/* 게시글 목록 */}
            {posts.map((post) => (
                <div
                    key={post.postId}
                    onClick={() => navigate(`/post/${post.postId}`)}
                    style={{
                        border: '1px solid #ddd',
                        padding: '16px',
                        marginBottom: '12px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                    }}
                >
                    <h3 style={{ margin: '0 0 8px 0' }}>
                        {post.title}
                        {post.visibility === 'SUBSCRIBER_ONLY' && (
                            <span
                                style={{
                                    marginLeft: '8px',
                                    fontSize: '12px',
                                    background: '#ffeeba',
                                    color: '#856404',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                }}
                            >
                                🔒 구독자 전용
                            </span>
                        )}
                    </h3>
                    <div
                        style={{
                            color: '#888',
                            fontSize: '14px',
                            marginBottom: '8px',
                        }}
                    >
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${post.authorId}`);
                            }}
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                        >
                            {post.authorName}
                        </span>
                        {' · '}
                        {new Date(post.createdAt).toLocaleDateString()} · 조회{' '}
                        {post.viewCount}
                    </div>
                    {post.tags?.length > 0 && (
                        <div>
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    style={{
                                        background: '#eee',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        marginRight: '4px',
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* 페이지 버튼 */}
            {totalPages > 0 && (() => {
                const GROUP = 6;
                const groupStart = Math.floor(page / GROUP) * GROUP;
                const groupEnd = Math.min(groupStart + GROUP, totalPages);
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', alignItems: 'center' }}>
                        <button
                            onClick={() => setPage(0)}
                            disabled={page === 0}
                            style={{ padding: '8px 12px', background: '#eee', color: page === 0 ? '#ccc' : '#333', cursor: page === 0 ? 'default' : 'pointer' }}
                        >
                            «
                        </button>
                        <button
                            onClick={() => setPage(groupStart - 1)}
                            disabled={groupStart === 0}
                            style={{ padding: '8px 12px', background: '#eee', color: groupStart === 0 ? '#ccc' : '#333', cursor: groupStart === 0 ? 'default' : 'pointer' }}
                        >
                            ‹
                        </button>
                        {Array.from({ length: groupEnd - groupStart }, (_, i) => {
                            const p = groupStart + i;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    style={{ padding: '8px 12px', background: page === p ? '#333' : '#eee', color: page === p ? '#fff' : '#333' }}
                                >
                                    {p + 1}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage(groupEnd)}
                            disabled={groupEnd >= totalPages}
                            style={{ padding: '8px 12px', background: '#eee', color: groupEnd >= totalPages ? '#ccc' : '#333', cursor: groupEnd >= totalPages ? 'default' : 'pointer' }}
                        >
                            ›
                        </button>
                        <button
                            onClick={() => setPage(totalPages - 1)}
                            disabled={page === totalPages - 1}
                            style={{ padding: '8px 12px', background: '#eee', color: page === totalPages - 1 ? '#ccc' : '#333', cursor: page === totalPages - 1 ? 'default' : 'pointer' }}
                        >
                            »
                        </button>
                    </div>
                );
            })()}
        </div>
    );
}

export default FeedPage;
