import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../state/useAuth';
import {sendRecoveryEmail} from '../../api/mail';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const {setTempPassword, setEmailRecovery} = useAuth();
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const OTP = Math.floor(Math.random() * 9000 + 1000);
        setTempPassword(OTP);
        setEmailRecovery(email);
        try {
            const result = await sendRecoveryEmail({
                to: email,
                code: OTP,
            });
            if (result.toString() === 'OK') {
                navigate('/password-recovery');
                toast.success('Email Successfully sent');
            } else {
                toast.error('Error sending Email');
            }
        } catch (e) {
            toast.error(e?.message ?? e);
        } finally {
            setEmail(null);
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
                            <h2>Forgot Password</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="inputBox-register">
                                    <label htmlFor="email">
                                        <strong style={{color: '#444444'}}>Email</strong>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        autoComplete="off"
                                        name="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="reset-submit">
                                    <button type="submit">
                                        Send
                                    </button>
                                </div>
                                <div className="auth-login">
                                    <a href="/login">&lt;&lt; Back to login</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
export default ForgotPassword;