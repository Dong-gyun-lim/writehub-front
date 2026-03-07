import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/post/new" element={<PostPage />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/post/:postId/edit" element={<PostPage />} />
                <Route path="/profile/:memberId" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
