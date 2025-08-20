import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { setCredentials, setUser } from './features/auth/authSlice';
import api from './config/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApiResponse } from './types/department.types';
import { Me } from './interfaces/types';

const AuthBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await api.get<ApiResponse<Me>>('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setCredentials({ accessToken: token }));
        dispatch(setUser(res.data.data));
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
    <div className="min-h-screen bg-[#d0d0e3] text-gray-900 font-sans antialiased">
      <Provider store={store}>
        <AuthBootstrap />
        <RouterProvider router={router} />
        <ToastContainer position="top-right" />
      </Provider>
    </div>
  );
}

export default App;
