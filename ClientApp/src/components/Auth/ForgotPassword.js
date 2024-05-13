import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../state/useAuth';
import {sendRecoveryEmail} from '../../api/mail';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const { setTempPassword, setEmailRecovery } = useAuth();
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
            setEmail( null);
        }
    }

    return(<div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
            <h4>Forgot Password</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        autoComplete="off"
                        name="email"
                        className="form-control rounded-0"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-0">
                    Send
                </button>
            </form>

        </div>
    </div>)
}
export default ForgotPassword;