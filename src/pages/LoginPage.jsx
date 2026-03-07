import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberApi } from '../api/api';

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            await memberApi.login({
                email: form.email,
                password: form.password,
            });
            navigate('/feed');
        } catch (e) {
            setError(e.message);
        }
    };

    const handleSignup = async () => {
        try {
            await memberApi.signup({
                username: form.username,
                email: form.email,
                password: form.password,
            });
            setError('회원가입 성공! 로그인해주세요.');
            setIsLogin(true);
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div
            style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}
        >
            <h1>✍️ WriteHub</h1>

            {/* 탭 */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <button
                    onClick={() => setIsLogin(true)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: isLogin ? '#333' : '#eee',
                        color: isLogin ? '#fff' : '#333',
                    }}
                >
                    로그인
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: !isLogin ? '#333' : '#eee',
                        color: !isLogin ? '#fff' : '#333',
                    }}
                >
                    회원가입
                </button>
            </div>

            {/* 회원가입일 때만 username */}
            {!isLogin && (
                <input
                    name="username"
                    placeholder="이름"
                    value={form.username}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                    }}
                />
            )}

            <input
                name="email"
                placeholder="이메일"
                type="email"
                value={form.email}
                onChange={handleChange}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                }}
            />
            <input
                name="password"
                placeholder="비밀번호"
                type="password"
                value={form.password}
                onChange={handleChange}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                }}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button
                onClick={isLogin ? handleLogin : handleSignup}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: '#333',
                    color: '#fff',
                }}
            >
                {isLogin ? '로그인' : '회원가입'}
            </button>
        </div>
    );
}

export default LoginPage;
