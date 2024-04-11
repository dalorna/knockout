import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState} from 'react';
import { useForm } from 'react-hook-form';
import {joinLeague} from '../../api/league';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {ErrorFeedback} from '../../utils/helpers';
import toast from 'react-hot-toast';

const validationSchema = Yup.object().shape({
    code: Yup.string().required('League name is required')
});

export const JoinLeagueModal = ({actionsRef, afterSubmit}) => {
    const [modal, modalRef] = useModalInstance();
    const [user, setUser] = useState(null);

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setUser(details.user)
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );

    const {
        handleSubmit,
        register,
        setValue,
        formState: {errors, isValid}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            code: ''
        }
    });

    const onHandleSubmit = async (data) => {
        let result;
        try {
            result = await joinLeague({
                leagueId: data.code,
                member: {
                    userId: user.id,
                    username: user.username
                }});
            if (result.status === 204) {
                toast.error(result.statusText);
            } else {
                // refreshLeagues();
                afterSubmit();
                toast.success('League Successfully Joined');
            }
        } catch (e) {
            toast.error(result?.statusText ?? e?.message);
        } finally {
            setValue('code', '');
            modal.hide();
        }

    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        <h5>Join New League</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onHandleSubmit)}>
                            <div className="form-group text-start">
                                <label htmlFor="code" className="text-primary-emphasis">General/Private
                                    Code:</label>
                                <input type="text" className="form-control" {...register('code')} id="code"/>
                                <ErrorFeedback error={errors.name}/>
                            </div>
                            <div>
                                <button type="button" className="btn btn-outline-secondary btn-standard-width"
                                        data-bs-dismiss="modal"
                                        aria-label="Close">
                                    Cancel
                                </button>
                                <button type="submit" disabled={!isValid}
                                        className="btn btn-secondary btn-standard-width mx-2">Join
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}