import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import './styles/main.scss'
import 'bootstrap';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { AuthProvider } from './state/AuthProvider';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Unauthorized from './components/Auth/Unauthorized';
import ForgotPassword from './components/Auth/ForgotPassword';
import OTPInput from './components/Auth/OTPInput';
import ResetPassword from './components/Auth/ResetPassword';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <RecoilRoot>
            <AuthProvider>
                <Routes path="/">
                    {/* public routes */ }
                    <Route path="/"  element={<Navigate replace to="/login" />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="unauthorized" element={<Unauthorized />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="password-recovery" element={<OTPInput />} />
                    <Route path="reset" element={<ResetPassword />} />

                    {/* Will eventually be protected */}
                    <Route path="knockout/*" element={<App />}/>
                </Routes>
            </AuthProvider>
        </RecoilRoot>
    </BrowserRouter>
);
