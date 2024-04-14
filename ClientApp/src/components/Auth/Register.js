import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const NAME_REGEX = /^[a-z ,.'-]+$/i;
const REGISTER_URL = '/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [firstName, setFirstName] = useState('')
    const [validFirstName, setValidFirstName] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);

    const [lastName, setLastName] = useState('')
    const [validLastName, setValidLastName] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user])

    useEffect(() => {
        setValidFirstName(NAME_REGEX.test(firstName))
    }, [firstName])

    useEffect(() => {
        setValidLastName(NAME_REGEX.test(lastName))
    }, [lastName])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match)
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = NAME_REGEX.test(firstName);
        const v5 = NAME_REGEX.test(lastName);
        if (!v1 || !v2 || !v3 || !v4 || !v5) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            await axios.post(REGISTER_URL,
                JSON.stringify({user, pwd, firstName, lastName, email}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPwd('');
            setMatchPwd('');
            setEmail('');
            setFirstName('');
            setLastName('');
            toast.success('You have successfully signed up!');
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
                <div className="box-register">
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
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUser(e.target.value)}
                                        required
                                        aria-invalid={validName ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setUserFocus(true)}
                                        onBlur={() => setUserFocus(false)}
                                        value={user}
                                    />
                                    <span>
                                        Username:
                                        <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"}/>
                                        <FontAwesomeIcon icon={faTimes}
                                                         className={validName || !user ? "hide" : "invalid"}/>
                                    </span>
                                    <p id="uidnote"
                                       className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        4 to 24 characters.<br/>
                                        Must begin with a letter.<br/>
                                        Letters, numbers, underscores, hyphens allowed.
                                    </p>
                                </div>
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
                                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                        <div>
                                            <FontAwesomeIcon icon={faInfoCircle} style={{marginRight: '5px'}}/>
                                            8 to 24 characters.<br/>
                                            Must include uppercase and lowercase letters, a number and a special
                                            character.
                                        </div>
                                        <div>
                                            <div className="float-start" style={{marginRight: '5px'}}>Allowed special characters:</div>
                                            <div className="float-start" style={{marginRight: '1px'}} aria-label="exclamation mark">!</div>
                                            <div className="float-start" style={{marginRight: '1px'}} aria-label="at symbol">@</div>
                                            <div className="float-start" style={{marginRight: '1px'}} aria-label="hashtag">#</div>
                                            <div className="float-start" style={{marginRight: '1px'}} aria-label="dollar sign">$</div>
                                            <div className="float-start" style={{marginRight: '1px'}} aria-label="percent">%</div>
                                        </div>
                                    </p>
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
                                <div className="inputBox-register">
                                    <input
                                        type="text"
                                        id="firstName"
                                        onChange={(e) => setFirstName(e.target.value)}
                                        value={firstName}
                                        required
                                        onFocus={() => setFirstNameFocus(true)}
                                        onBlur={() => setFirstNameFocus(false)}
                                    />
                                    <span>
                                        FirstName:
                                        <FontAwesomeIcon icon={faCheck} className={validFirstName ? "valid" : "hide"}/>
                                        <FontAwesomeIcon icon={faTimes}
                                                         className={validFirstName || !firstName ? "hide" : "invalid"}/>
                                    </span>
                                    <p className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        First Name is invalid<br/>
                                    </p>
                                </div>
                                <div className="inputBox-register">
                                    <input
                                        type="text"
                                        id="lastName"
                                        onChange={(e) => setLastName(e.target.value)}
                                        value={lastName}
                                        required
                                        onFocus={() => setLastNameFocus(true)}
                                        onBlur={() => setLastNameFocus(false)}
                                    />
                                    <span>
                                        LastName:
                                        <FontAwesomeIcon icon={faCheck} className={validLastName ? "valid" : "hide"}/>
                                        <FontAwesomeIcon icon={faTimes}
                                                         className={validLastName || !lastName ? "hide" : "invalid"}/>
                                    </span>
                                    <p className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        Last Name is invalid<br/>
                                    </p>
                                </div>
                                <div className="inputBox-register">
                                    <input
                                        type="text"
                                        id="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                        onFocus={() => setEmailFocus(true)}
                                        onBlur={() => setEmailFocus(false)}
                                    />
                                    <span>
                                        Email:
                                        <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"}/>
                                        <FontAwesomeIcon icon={faTimes}
                                                         className={validEmail || !email ? "hide" : "invalid"}/>
                                    </span>
                                    <p className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        email is invalid<br/>
                                    </p>
                                </div>
                                <div className="inputBox-register">
                                    <button
                                        disabled={!validName || !validPwd || !validMatch || !validEmail || !validLastName || !validFirstName}>Sign
                                        Up
                                    </button>
                                </div>
                            </form>
                            <p>
                                Already registered?<br/>
                                <span className="line">
                        <a href="Login">Sign In</a>
                        </span>
                            </p>


                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default Register;