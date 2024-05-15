import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {sendUsernameEmail} from '../../api/mail';
import toast from 'react-hot-toast';


const ResetUsername = () => {
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const result = await sendUsernameEmail({
                to: email
            });
            if (result.toString() === 'OK') {
                navigate('/login');
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

    return (<main className="App">
        <div className="container-register">
            <div className="box-register reset">
                <div className="cover-register"></div>
                <div className="shadow-register"></div>
                <div className="content-register">
                    <div className="form-register">
                        <h3>Forgot Username</h3>
                        <p>Enter you email to receive a you username</p>
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox-register">
                                <label htmlFor="email">
                                    <strong>Email</strong>
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
    </main>)
}
export default ResetUsername;