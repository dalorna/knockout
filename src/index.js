import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import './styles/main.scss'
import 'bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </BrowserRouter>
);
