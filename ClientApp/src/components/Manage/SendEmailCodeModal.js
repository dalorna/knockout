import {useModalInstance} from '../../utils/simpleModal';
import {useEffect, useImperativeHandle, useState} from 'react';
import toast from 'react-hot-toast';
import {sendEmail} from '../../api/mail';
import {ErrorFeedback} from '../../utils/helpers';
import {joinLeague} from '../../api/league';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
const EMAIL_REGEX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;


const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid Email').required('Email is required')
        .test({
            name: 'showUp',
            test: (value, context) => {
                return EMAIL_REGEX.test(value) ? true : context.createError({message: 'Please Provide a valid email.'});
            }
        })
});


export const SendEmailCodeModal = ({actionsRef}) => {
    const [modal, modalRef] = useModalInstance();
    const [league, setLeague] = useState(null);
    const [season, setSeason] = useState(null);
    const [privateCode, setPrivateCode] = useState(null);
    // const favorite = JSON.parse(localStorage.getItem('favoriteTeam'));
    // const color = {color: favorite.team};
    // const backGroundColor = {backgroundColor: `favorite.team-secondary`}

    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: {errors, isValid}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            code: '',
            email: ''
        },
        mode: 'onChange'
    });

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setLeague(details.league);
                setSeason(details.season);
                setPrivateCode(details.privateCode);
                reset({code: details.privateCode, email: ''})
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );


    const onHandleSubmit = async (data) => {
        const body = emailBody(data.code);
        try {
            const result = await sendEmail({
                to: data.email,
                subject: 'Welcome to Knock Out Survivor',
                html: body
            });
            if (result.toString() !== 'OK') {
                toast.error('Error sending Email');
            } else {
                toast.success('Email Successfully sent');
            }
        } catch (e) {
            toast.error(e?.message ?? e);
        } finally {
            setValue('email', '');
            modal.hide();
        }
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        <h5>{`Email Code for a Friend to ${league?.name} for ${season?.year}`}</h5>
                    </div>
                    <form onSubmit={handleSubmit(onHandleSubmit)}>
                        <div className="modal-body">
                            <p className="text-primary-emphasis">
                                Send an email to a friend with the private code, so they can join the league
                            </p>
                            <div className="form-group text-start">
                                <label htmlFor="code" className="text-primary-emphasis">Private
                                    Code:</label>
                                <input type="text" disabled className="form-control" {...register('code')} id="code"/>
                            </div>
                            <div className="form-group text-start">
                                <label htmlFor="email" className="text-primary-emphasis">Email Address:</label>
                                <input type="text" className="form-control" {...register('email')} id="email"/>
                                <ErrorFeedback error={errors.email}/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary btn-standard-width"
                                        data-bs-dismiss="modal"
                                        aria-label="Close">
                                    Cancel
                                </button>
                                <button type="submit" disabled={!isValid}
                                        className="btn btn-secondary btn-standard-width mx-2">Send
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>);
}

const emailSubject = '';
const emailBody = (code) => `<div><h2>Welcome to Knock Out Survivor</h2><div>Here is your link to Knock out</div><div>Here is your pass code: ${code}</div></div>`