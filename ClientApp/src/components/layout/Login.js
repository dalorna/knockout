import { useRef, useState, useEffect } from 'react';
import useAuth from '../../state/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
const LOGIN_URL = '/auth';
import {currentUserAtom} from '../../state/user';
import {useRecoilState} from 'recoil';
import '../../styles/login.scss';

const Login = () => {
    const { setAuth } = useAuth();
    const [, setCurrentUser ] = useRecoilState(currentUserAtom);

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
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
            );
            const accessToken = response?.data?.accessToken;
            const userInfo = response?.data?.userInfo;
            setAuth({user, pwd, userInfo, accessToken});
            userInfo.username = user;
            setCurrentUser(userInfo);

            setUser('');
            setPwd('');
            navigate('/knockout/home');
        } catch (err) {
            if (!err?.response) {
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
            <div className="container-login">
                <div className="box-login">
                    <div className="cover-login"></div>
                    <div className="shadow-login"></div>
                    <div className="content-login">
                        <div className="form-login">
                            <h3 className="logo-login">
                                <i className="fa fa-key" />
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
                                    <i className="fa fa-user" />
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
                                    <i className="fa fa-lock" />
                                    <span>Password</span>
                                </div>
                                <div className="links-login">
                                    <a href="/register"> <i className="fa fa-user-plus" /> Sign Up</a>
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