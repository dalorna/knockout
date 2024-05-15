import React, {useEffect, useState, useRef} from 'react';
import useAuth from '../../state/useAuth';
import {sendRecoveryEmail} from '../../api/mail';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SimpleModal from '../../utils/simpleModal';

const OTPInput = () => {
    const {tempPassword, setTempPassword, emailRecovery, setEmailRecovery} = useAuth();
    const [timerCount, setTimer] = useState(60);
    const [OTPInput, setOTPInput] = useState([0, 0, 0, 0]);
    const [disable, setDisable] = useState(true);
    const navigate = useNavigate();
    const favorite = JSON.parse(localStorage.getItem('favoriteTeam'));
    const firstInputRef = useRef();
    const secondInputRef = useRef();
    const thirdInputRef = useRef();
    const fourthInputRef = useRef();
    const [show, setShow] = useState(false);
    const [modalProps , ]= useState({ modalTitle: 'Invalid One Time Password', modalBody: `The code you have entered is not correct, try again or re-send the link`, handleClose: () => setShow(false)});

    useEffect(() => {
        firstInputRef.current.focus();
        if (!emailRecovery) {
            navigate('/forgot-password')
        }
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
        const OTP = Math.floor(Math.random() * 9000 + 1000);
        setTempPassword(OTP);

        try {
            const result = await sendRecoveryEmail({
                to: emailRecovery,
                code: OTP,
            });
            if (result.toString() === 'OK') {
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
        setShow(true)
    }

    const OTPChange = (input, id) => {
        setOTPInput(input);
        if(id.substring(6) === '1')
            secondInputRef.current.focus();
        if(id.substring(6) === '2')
            thirdInputRef.current.focus();
        if(id.substring(6) === '3')
            fourthInputRef.current.focus();
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
                                                id="input_1"
                                                onChange={(e) => OTPChange(
                                                    [
                                                            e.target.value,
                                                            OTPInput[1],
                                                            OTPInput[2],
                                                            OTPInput[3],
                                                        ], e.target.id)
                                                    }
                                            ></input>
                                        </div>
                                        <div className="otp-input">
                                            <input ref={secondInputRef}
                                                maxLength="1"
                                                type="text"
                                                name=""
                                                id="input_2"
                                                onChange={(e) =>
                                                    OTPChange([
                                                        OTPInput[0],
                                                        e.target.value,
                                                        OTPInput[2],
                                                        OTPInput[3],
                                                    ], e.target.id)
                                                }
                                            ></input>
                                        </div>
                                        <div className="otp-input">
                                            <input ref={thirdInputRef}
                                                maxLength="1"
                                                type="text"
                                                name=""
                                                id="input_3"
                                                onChange={(e) =>
                                                    OTPChange([
                                                        OTPInput[0],
                                                        OTPInput[1],
                                                        e.target.value,
                                                        OTPInput[3],
                                                    ], e.target.id)
                                                }
                                            ></input>
                                        </div>
                                        <div className="otp-input">
                                            <input ref={fourthInputRef}
                                                maxLength="1"
                                                type="text"
                                                name=""
                                                id="input_4"
                                                onChange={(e) =>
                                                    setOTPInput([
                                                        OTPInput[0],
                                                        OTPInput[1],
                                                        OTPInput[2],
                                                        e.target.value,
                                                    ], e.target.id)
                                                }
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="recovery-links-adj">
                                        <div className="reset-submit">
                                            <button type="button" onClick={() => verifyOTP()}>
                                                Verify Account
                                            </button>
                                        </div>
                                        <div className="links-recovery" style={{marginTop: '10px'}}>
                                            <p style={{color: '#444444'}}>Didn't receive code?</p>
                                            <a onClick={(e) => resendOTP(e)}
                                               style={{textDecoration: 'underline', marginLeft: '10px'}}>
                                                {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                                            </a>
                                        </div>
                                        <div className="otp-login">
                                            <a href="/login">&lt;&lt; Back to login</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <SimpleModal props={modalProps} show={show} />
        </main>
    );
}

export default OTPInput;