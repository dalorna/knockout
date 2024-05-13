import React, { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../api/axios';
import {useNavigate} from 'react-router';
import useAuth from '../../state/useAuth';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register/reset';

const ResetPassword = () => {
    const { emailRecovery } = useAuth();
    const errRef = useRef();
    const navigate = useNavigate();

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match)
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd])


    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v2 = PWD_REGEX.test(pwd);
        if (!v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            await axios.post(REGISTER_URL,
                JSON.stringify({pwd, email: emailRecovery}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            setPwd('');
            setMatchPwd('');
            // toast.success('You have successfully signed up!');
            navigate('/login')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }


    return (
        <main className="App">
            <div className="container-register">
                <div className="box-register reset">
                    <div className="cover-register"></div>
                    <div className="shadow-register"></div>
                    <div className="content-register">
                        <div className="form-register">
                            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"}
                               aria-live="assertive">{errMsg}</p>
                            <h2>Register</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="inputBox-register">
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby="pwdnote"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                    />
                                    <span>
                                        Password:
                                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"}/>
                                        <FontAwesomeIcon icon={faTimes}
                                                         className={validPwd || !pwd ? "hide" : "invalid"}/>
                                    </span>
                                    <div id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                        <div>
                                            <FontAwesomeIcon icon={faInfoCircle} style={{marginRight: '5px'}}/>
                                            8 to 24 characters.<br/>
                                            Must include uppercase and lowercase letters, a number and a special
                                            character.
                                        </div>
                                        <div>
                                            <div className="float-start" style={{marginRight: '5px'}}>Allowed special
                                                characters:
                                            </div>
                                            <div className="float-start" style={{marginRight: '1px'}}
                                                 aria-label="exclamation mark">!
                                            </div>
                                            <div className="float-start" style={{marginRight: '1px'}}
                                                 aria-label="at symbol">@
                                            </div>
                                            <div className="float-start" style={{marginRight: '1px'}}
                                                 aria-label="hashtag">#
                                            </div>
                                            <div className="float-start" style={{marginRight: '1px'}}
                                                 aria-label="dollar sign">$
                                            </div>
                                            <div className="float-start" style={{marginRight: '1px'}}
                                                 aria-label="percent">%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="inputBox-register">
                                    <input
                                        type="password"
                                        id="confirm_pwd"
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                        value={matchPwd}
                                        required
                                        aria-invalid={validMatch ? "false" : "true"}
                                        aria-describedby="confirmnote"
                                        onFocus={() => setMatchFocus(true)}
                                        onBlur={() => setMatchFocus(false)}
                                    />
                                    <span>
                                        Confirm Password:
                                        <FontAwesomeIcon icon={faCheck}
                                                         className={validMatch && matchPwd ? "valid" : "hide"}/>
                                        <FontAwesomeIcon icon={faTimes}
                                                         className={validMatch || !matchPwd ? "hide" : "invalid"}/>
                                    </span>
                                    <p id="confirmnote"
                                       className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        Must match the first password input field.
                                    </p>
                                </div>
                                <div className="reset-submit">
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
export default ResetPassword;