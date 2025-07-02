import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { setCredentials, setUser } from './features/auth/authSlice';
import api from './config/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setCredentials({ accessToken: token }));
        dispatch(setUser(res.data));
      } catch (err) {
        console.error('Session restore failed:', err);
        localStorage.removeItem('access_token'); // Clear invalid token
      }
    };

    fetchUser();
  }, [dispatch]);

  return null;
};



function App() {
  return (
    <div className="min-h-screen bg-[#E3D0D8] text-gray-900 font-sans antialiased">
      <Provider store={store}>
        <AuthBootstrap />
        <RouterProvider router={router} />
        <ToastContainer position="top-right" />
      </Provider>
    </div>
  );
}

export default App;
