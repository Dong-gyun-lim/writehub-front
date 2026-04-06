import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { memberApi, followApi, subscriptionApi, postApi } from '../api/api';

function ProfilePage() {
    const { memberId } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [me, setMe] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState('');

    const isMe = me?.memberId === Number(memberId);

    useEffect(() => {
        memberApi
            .getMe()
            .then(setMe)
            .catch(() => {});
        memberApi
            .getProfile(memberId)
            .then((data) => {
                setProfile(data);
                setNickname(data.nickname || '');
                setBio(data.bio || '');
            })
            .catch((e) => setError(e.message));
        postApi
            .getByMember(memberId)
            .then((data) => setPosts(data.content ?? []))
            .catch(() => {});
    }, [memberId]);

    useEffect(() => {
        if (!me) return;
        followApi
            .getFollowing(me.memberId)
            .then((data) => {
                const following = (data.content ?? []).some(
                    (f) => f.memberId === Number(memberId)
                );
                setIsFollowing(following);
            })
            .catch(() => {});
        subscriptionApi
            .getSubscriptions(me.memberId)
            .then((data) => {
                const subscribed = (data.content ?? []).some(
                    (s) => s.memberId === Number(memberId)
                );
                setIsSubscribed(subscribed);
            })
            .catch(() => {});
    }, [me, memberId]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await followApi.unfollow(memberId);
                setIsFollowing(false);
            } else {
                await followApi.follow(memberId);
                setIsFollowing(true);
            }
            memberApi.getProfile(memberId).then(setProfile);
        } catch (e) {
            setError(e.message);
        }
    };

    const handleSubscribe = async () => {
        try {
            if (isSubscribed) {
                await subscriptionApi.unsubscribe(memberId);
                setIsSubscribed(false);
            } else {
                await subscriptionApi.subscribe(memberId);
                setIsSubscribed(true);
            }
            memberApi.getProfile(memberId).then(setProfile);
        } catch (e) {
            setError(e.message);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const updated = await memberApi.updateProfile({ nickname, bio });
            setProfile(updated);
            setNickname(updated.nickname || '');
            setBio(updated.bio || '');
            setIsEditing(false);
        } catch (e) {
            setError(e.message);
        }
    };

    if (!profile) return <div style={{ padding: '20px' }}>로딩 중...</div>;

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
            <button
                onClick={() => navigate('/feed')}
                style={{ marginBottom: '20px' }}
            >
                ← 피드로
            </button>

            <div
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                }}
            >
                <h2 style={{ margin: '0 0 4px 0' }}>
                    {profile.nickname || profile.username}
                </h2>
                <p
                    style={{
                        color: '#aaa',
                        margin: '0 0 8px 0',
                        fontSize: '14px',
                    }}
                >
                    {profile.username}
                </p>
                <p style={{ color: '#888', margin: '0 0 16px 0' }}>
                    {profile.bio || '소개가 없습니다.'}
                </p>

                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '16px',
                    }}
                >
                    <span>게시글 {profile.postCount}</span>
                    <span>팔로워 {profile.followerCount}</span>
                    <span>팔로잉 {profile.followingCount}</span>
                    <span>구독자 {profile.subscriberCount}</span>
                </div>

                {!isMe && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleFollow}
                            style={{
                                padding: '8px 20px',
                                background: isFollowing ? '#eee' : '#333',
                                color: isFollowing ? '#333' : '#fff',
                            }}
                        >
                            {isFollowing ? '언팔로우' : '팔로우'}
                        </button>
                        <button
                            onClick={handleSubscribe}
                            style={{
                                padding: '8px 20px',
                                background: isSubscribed ? '#eee' : '#333',
                                color: isSubscribed ? '#333' : '#fff',
                            }}
                        >
                            {isSubscribed ? '구독취소' : '구독'}
                        </button>
                    </div>
                )}

                {isMe && (
                    <div style={{ marginTop: '16px' }}>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            style={{
                                padding: '8px 20px',
                                background: '#333',
                                color: '#fff',
                            }}
                        >
                            {isEditing ? '취소' : '프로필 수정'}
                        </button>

                        {isEditing && (
                            <div style={{ marginTop: '12px' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <label>닉네임</label>
                                    <input
                                        value={nickname}
                                        onChange={(e) =>
                                            setNickname(e.target.value)
                                        }
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '8px',
                                            marginTop: '4px',
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <label>소개</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '8px',
                                            marginTop: '4px',
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleUpdateProfile}
                                    style={{
                                        padding: '8px 20px',
                                        background: '#333',
                                        color: '#fff',
                                    }}
                                >
                                    저장
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
                )}
            </div>

            <h3>게시글</h3>
            {posts.length === 0 && (
                <p style={{ color: '#888' }}>게시글이 없습니다.</p>
            )}
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
                    <h4 style={{ margin: '0 0 8px 0' }}>{post.title}</h4>
                    <div style={{ color: '#888', fontSize: '14px' }}>
                        {new Date(post.createdAt).toLocaleDateString()} · 조회{' '}
                        {post.viewCount}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProfilePage;
