import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState} from 'react';
import { useForm } from 'react-hook-form';
import {saveLeague, saveLeagueSeason} from '../../api/league';
import { ErrorFeedback, generateUUID } from '../../utils/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';
import useAuth from '../../state/useAuth';
import axios from '../../api/axios';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('League name is required').min(5, 'League name must be 5 character long'),
    maxMembers: Yup.number()
        .required('Max number of players is required')
        .min(10, 'The number of players is 10')
        .positive('Must be a positive number')
        .typeError('Please enter the max number of players. The field cannot be left blank')
        .test({
            name: 'testPrivate',
            test: (value, context) => {
                const valid = context.parent.isPrivateLeague ? value <= 50 : value <= 25;
                const message  = context.parent.isPrivateLeague ? 'Max players for a Private League is 50'
                    : 'Max players for a public league is 25';

                return valid ? valid : context.createError({message})
            }
        })
});

export const ConfirmLeagueForm = ({onSubmit, props}) => {
    const { 
        handleSubmit, 
        register, 
        setValue, 
        reset, 
        watch,
        formState: {errors, isValid} } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            description: '',
            privateCode: '',
            isPrivateLeague: false,
            maxMembers: 10
        }
    });
    const isPrivate = watch('isPrivateLeague');
    const makeLeaguePrivate = () => {
        setValue('privateCode', generateUUID());
    }
    const resetForm = async () => {
        if (isValid) {
            await new Promise((resolve) => {
                resolve(setTimeout(() => {
                    reset(
                        {
                            name: '',
                            description: '',
                            privateCode: '',
                            isPrivateLeague: false
                        }
                    )
                }, 5000))
            })
        }
    }
    
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-content" style={{width: '500px'}}>
                <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">{`Create New League for the ${props.year} season`}</div>
                <div className="modal-body">
                    <div className="form-group text-start">
                        <label htmlFor="name" className="text-primary-emphasis">League Name</label>
                        <input type="text" className="form-control" {...register('name')} id="name"/>
                        <ErrorFeedback error={errors.name}/>
                    </div>
                    <div className="form-group text-start">
                        <label htmlFor="description" className="text-primary-emphasis">League Description
                            (optional)</label>
                        <input type="text" className="form-control" {...register('description')} id="description"/>
                    </div>
                    <div className="form-group text-start">
                        <label htmlFor="maxMembers" className="text-primary-emphasis">Max Players</label>
                        <input type="number" className="form-control" {...register('maxMembers')} id="maxMembers" />
                        <ErrorFeedback error={errors.maxMembers}/>
                    </div>
                    <div className="form-check text-start">
                        <input className="form-check-input" type="checkbox" id="isPrivateLeague"
                               name="isPrivateLeague" {...register('isPrivateLeague')} onClick={makeLeaguePrivate}/>
                        <label className="form-check-label" htmlFor="isPrivateLeague">
                            Private League
                        </label>
                    </div>
                    {
                        isPrivate && <>
                            <div className="form-group text-start">
                                <label htmlFor="privateCode" className="text-primary-emphasis">Private Code</label>
                                <input type="text" className="form-control" disabled {...register('privateCode')}
                                       id="privateCode"/>
                            </div>
                        </>
                    }
                </div>
                <div className="modal-footer bg-dark-subtle">
                    <button type="button" className="btn btn-outline-secondary btn-standard-width"
                            data-bs-dismiss="modal"
                            aria-label="Close">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-secondary btn-margin-right btn-standard-width" onClick={resetForm}>Save
                    </button>
                </div>
            </div>
        </form>
    );
}
export const CreateLeagueModal = ({actionsRef, afterSubmit, props}) => {
    const [modal, modalRef] = useModalInstance();
    const [user, setUser] = useState(null);
    const [season, setSeason] = useState(null);
    const [, setCurrentUser ] = useRecoilState(currentUserAtom);
    const {auth, setAuth } = useAuth();
    const LOGIN_URL = '/auth';

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setUser(details.user)
                setSeason(details.season)
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );
    const loginSilentForLeague = async () => {
        const user = auth.user;
        const pwd = auth.pwd;
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
    }
    const onConfirm = async (data) => {
        const league = await saveLeague({
            userId: user.id,
            name: data.name,
            description: data.description,
        });
        await saveLeagueSeason({
            seasonId: season._id,
            leagueId: league._id,
            privateCode: data.privateCode,
            locked: false,
            maxMembers: data.maxMembers
        });
        await loginSilentForLeague();
        afterSubmit(league);
        modal.hide();
    }
    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <ConfirmLeagueForm onSubmit={onConfirm} props={props} />
            </div>
        </div>
    );
}