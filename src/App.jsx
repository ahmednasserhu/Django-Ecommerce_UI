import { useEffect, useState } from 'react';
import Signup from './pages/user/signup';
import { RouterProvider, useNavigate } from 'react-router-dom';
import router from './pages/router';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import OrderDetails from './components/Receipt/Receipt';
import axios from 'axios';
import { toast } from 'react-toastify';

function App() {
  const handleStockAndCart = async (token) => {
    const response = await axios.post(
      'http://127.0.0.1:8000/cart-product',
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': token,
        },
      },
    );
  };
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') && localStorage.getItem('token')) {
      setTimeout(() => {
        handleStockAndCart(localStorage.getItem('token'));
      }, 5000);
      toast.success('Payment successed !');
    }

    if (query.get('canceled')) {
      //! will do
      toast.success('Payment successed !');
    }
  }, []);
  return (
    <>
      <RouterProvider router={router} />
      {/* <OrderDetails /> */}
    </>
  );
}

export default App;
