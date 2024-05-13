import React, {useEffect, useState, useRef} from 'react';
import useAuth from '../../state/useAuth';
import {sendRecoveryEmail} from '../../api/mail';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OTPInput = () => {
    const {tempPassword, emailRecovery, setEmailRecovery, setTempPassword} = useAuth();
    const [timerCount, setTimer] = useState(60);
    const [OTPInput, setOTPInput] = useState([0, 0, 0, 0]);
    const [disable, setDisable] = useState(true);
    const navigate = useNavigate();
    const favorite = JSON.parse(localStorage.getItem('favoriteTeam'));
    const firstInputRef = useRef();

    useEffect(() => {
        firstInputRef.current.focus();
    }, [])

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((lastTimerCount) => {
                lastTimerCount <= 1 && clearInterval(interval);
                if (lastTimerCount <= 1) setDisable(false);
                if (lastTimerCount <= 0) return lastTimerCount;
                return lastTimerCount - 1;
            });
        }, 1000); //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval);
    }, [disable]);

    const resendOTP = async (e) => {
        e.preventDefault()

        try {
            const result = await sendRecoveryEmail({
                to: emailRecovery,
                code: tempPassword,
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
            setEmailRecovery(null);
        }
    }

    const verifyOTP = () => {
        if (parseInt(OTPInput.join("")) === tempPassword) {
            navigate('/reset');
            return;
        }
        alert(
            "The code you have entered is not correct, try again or re-send the link"
        );
    }


    return (<main className="App">
        <div className="text-center title-branding">
            <h2 className={`text-shadow-title ${favorite?.favoriteTeam}-color`}>Email Verification</h2>
            <h5 className={`text-shadow-title ${favorite?.favoriteTeam}-color`}>{`We have sent a code to your email ${emailRecovery}`}</h5>
        </div>

        <div className="container-recovery">
            <div className="box-recovery">
                <div className="cover-recovery"></div>
                <div className="shadow-recovery"></div>
                <div className="content-recovery">
                    <div className="form-recovery">
                        <form>
                            <div>
                                <div className="flex-container">
                                    <div ref={firstInputRef} className="otp-input">
                                        <input
                                            maxLength="1"
                                            type="text"
                                            name=""
                                            id=""
                                            onChange={(e) =>
                                                setOTPInput([
                                                    e.target.value,
                                                    OTPInput[1],
                                                    OTPInput[2],
                                                    OTPInput[3],
                                                ])
                                            }
                                        ></input>
                                    </div>
                                    <div className="otp-input">
                                        <input
                                            maxLength="1"
                                            type="text"
                                            name=""
                                            id=""
                                            onChange={(e) =>
                                                setOTPInput([
                                                    OTPInput[0],
                                                    e.target.value,
                                                    OTPInput[2],
                                                    OTPInput[3],
                                                ])
                                            }
                                        ></input>
                                    </div>
                                    <div className="otp-input">
                                        <input
                                            maxLength="1"
                                            type="text"
                                            name=""
                                            id=""
                                            onChange={(e) =>
                                                setOTPInput([
                                                    OTPInput[0],
                                                    OTPInput[1],
                                                    e.target.value,
                                                    OTPInput[3],
                                                ])
                                            }
                                        ></input>
                                    </div>
                                    <div className="otp-input">
                                        <input
                                            maxLength="1"
                                            type="text"
                                            name=""
                                            id=""
                                            onChange={(e) =>
                                                setOTPInput([
                                                    OTPInput[0],
                                                    OTPInput[1],
                                                    OTPInput[2],
                                                    e.target.value,
                                                ])
                                            }
                                        ></input>
                                    </div>
                                </div>
                                <div className="recovery-links-adj">
                                    <div className="links-recovery">
                                        <a onClick={() => verifyOTP()} style={{textDecoration: 'underline'}} >
                                            Verify Account
                                        </a>
                                    </div>
                                    <div className="links-recovery" style={{marginTop: '10px'}}>
                                        <p>Didn't receive code?</p>
                                        <a onClick={() => resendOTP()} style={{textDecoration: 'underline', marginLeft: '10px'}}>
                                            {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
);
}

export default OTPInput;