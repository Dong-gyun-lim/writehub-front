import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postApi, memberApi } from '../api/api';

function PostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const isNew = postId === 'new';

    const [post, setPost] = useState(null);
    const [me, setMe] = useState(null);
    const [isEdit, setIsEdit] = useState(isNew);
    const [form, setForm] = useState({
        title: '',
        content: '',
        tags: '',
        visibility: 'PUBLIC',
    });
    const [error, setError] = useState('');

    // 내 정보 조회
    useEffect(() => {
        memberApi
            .getMe()
            .then(setMe)
            .catch(() => {});
    }, []);

    // 게시글 상세 조회
    useEffect(() => {
        if (isNew) return;
        postApi
            .getOne(postId)
            .then((data) => {
                setPost(data);
                setForm({
                    title: data.title,
                    content: data.content,
                    tags: data.tags?.join(', ') || '',
                    visibility: data.visibility,
                });
            })
            .catch((e) => setError(e.message));
    }, [postId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const data = {
                title: form.title,
                content: form.content,
                tags: form.tags
                    ? form.tags.split(',').map((t) => t.trim())
                    : [],
                visibility: form.visibility,
            };
            if (isNew) {
                await postApi.create(data);
            } else {
                await postApi.update(postId, data);
            }
            navigate('/feed');
        } catch (e) {
            setError(e.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('정말 삭제할까요?')) return;
        try {
            await postApi.delete(postId);
            navigate('/feed');
        } catch (e) {
            setError(e.message);
        }
    };

    const isAuthor = me && post && me.memberId === post.authorId;

    // 작성/수정 폼
    if (isEdit) {
        return (
            <div
                style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}
            >
                <h2>{isNew ? '게시글 작성' : '게시글 수정'}</h2>
                <input
                    name="title"
                    placeholder="제목"
                    value={form.title}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                    }}
                />
                <textarea
                    name="content"
                    placeholder="내용"
                    value={form.content}
                    onChange={handleChange}
                    rows={15}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                    }}
                />
                <input
                    name="tags"
                    placeholder="태그 (쉼표로 구분: Spring, Java)"
                    value={form.tags}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                    }}
                />
                <select
                    name="visibility"
                    value={form.visibility}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                    }}
                >
                    <option value="PUBLIC">전체 공개</option>
                    <option value="SUBSCRIBER_ONLY">구독자 전용</option>
                </select>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/feed')}
                        style={{ padding: '10px 20px', background: '#eee' }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#333',
                            color: '#fff',
                        }}
                    >
                        {isNew ? '작성' : '수정'}
                    </button>
                </div>
            </div>
        );
    }

    // 상세보기
    if (!post) return <div style={{ padding: '20px' }}>로딩 중...</div>;

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
            <button
                onClick={() => navigate('/feed')}
                style={{ marginBottom: '20px', padding: '8px 16px' }}
            >
                ← 목록으로
            </button>
            <h1>{post.title}</h1>
            <div
                style={{
                    color: '#888',
                    fontSize: '14px',
                    marginBottom: '16px',
                }}
            >
                <span
                    onClick={() => navigate(`/profile/${post.authorId}`)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {post.authorName}
                </span>
                {' · '}
                {new Date(post.createdAt).toLocaleDateString()}
                {' · '}조회 {post.viewCount}
            </div>
            {post.tags?.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
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
            <div
                style={{
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '40px',
                }}
            >
                {post.content}
            </div>
            {isAuthor && (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setIsEdit(true)}
                        style={{
                            padding: '10px 20px',
                            background: '#333',
                            color: '#fff',
                        }}
                    >
                        수정
                    </button>
                    <button
                        onClick={handleDelete}
                        style={{
                            padding: '10px 20px',
                            background: '#ff4444',
                            color: '#fff',
                        }}
                    >
                        삭제
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostPage;
