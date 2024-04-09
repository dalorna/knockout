import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import './styles/main.scss'
import 'bootstrap';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { AuthProvider } from './state/AuthProvider';
import Login from './components/layout/Login';
import Register from './components/layout/Register';
import Unauthorized from './components/layout/Unauthorized';

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

                    {/* Will eventually be protected */}
                    <Route path="knockout/*" element={<App />}/>
                </Routes>
            </AuthProvider>
        </RecoilRoot>
    </BrowserRouter>
);
