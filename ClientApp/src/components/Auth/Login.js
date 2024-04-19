import React, { useRef, useState, useEffect } from 'react';
import useAuth from '../../state/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
const LOGIN_URL = '/auth';
import {currentUserAtom} from '../../state/user';
import {useRecoilState} from 'recoil';
import '../../styles/login.scss';
import '../../styles/teams.scss';
import toast from 'react-hot-toast';

const Login = () => {
    const { setAuth } = useAuth();
    const [, setCurrentUser ] = useRecoilState(currentUserAtom);
    const favorite = JSON.parse(localStorage.getItem('favoriteTeam'));

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
        document.body.classList.remove(...document.body.classList);
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({user, pwd}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            ).catch((r) => {
                throw new Error(r);
            });
            const accessToken = response?.accessToken;
            const roles = response?.roles;
            const userInfo = response?.userInfo;
            const leagueIds = response?.leagueIds;

            setAuth({user, pwd, userInfo, roles, leagueIds, accessToken});
            userInfo.username = user;
            userInfo.leagueIds = leagueIds;
            userInfo.roles = roles;
            setCurrentUser(userInfo);
            localStorage.setItem('auth', JSON.stringify({ accessToken, leagueIds}));

            setUser('');
            setPwd('');
            navigate('/knockout/home');

        } catch (err) {
            if (typeof err === 'string') {
                toast.error(err);
                setErrMsg('Login Failed');
            }
            if (err?.message) {
                setErrMsg(err.message);
            } else if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <main className="App">
            <div className="text-center title-branding">
                <div className={`text-shadow-title ${favorite?.favoriteTeam}-color`}>Welcome to Survivor Knockout</div>
            </div>
            <div className="container-login">
                <div className="box-login">
                    <div className="cover-login"></div>
                    <div className="shadow-login"></div>
                    <div className="content-login">
                        <div className="form-login">
                            <h3 className="logo-login">
                                <i className="fa fa-key"/>
                            </h3>
                            <h2>Sign In</h2>
                            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"}
                               aria-live="assertive">{errMsg}</p>
                            <form onSubmit={handleSubmit}>
                                <div className="inputBox-login">
                                    <input
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                    />
                                    <i className="fa fa-user"/>
                                    <span>Username</span>
                                </div>
                                <div className="inputBox-login">
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                    />
                                    <i className="fa fa-lock"/>
                                    <span>Password</span>
                                </div>
                                <div className="links-login">
                                    <a href="/register"> <i className="fa fa-user-plus"/> Sign Up</a>
                                </div>
                                <div className="inputBox-login">
                                    <button style={{width: '100%'}}>Sign In</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login;