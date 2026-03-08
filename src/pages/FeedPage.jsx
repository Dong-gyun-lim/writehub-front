import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi, memberApi } from '../api/api';

function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [me, setMe] = useState(null);
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
        postApi
            .getAll(page)
            .then((data) => {
                setPosts(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((e) => console.error(e));
    }, [page]);

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
                <h1>✍️ WriteHub</h1>
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '20px',
                }}
            >
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        style={{
                            padding: '8px 12px',
                            background: page === i ? '#333' : '#eee',
                            color: page === i ? '#fff' : '#333',
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FeedPage;
