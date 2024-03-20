import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { saveLeague } from '../../api/user';
import {ErrorFeedback, generateUUID} from '../../utils/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('League name is required')
});

export const ConfirmLeagueForm = ({onSubmit}) => {
    // const [isPrivateLeague, setIsPrivateLeague] = useState(false);
    const { 
        handleSubmit, 
        register, 
        setValue, 
        reset, 
        watch,
        formState: {errors} } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            description: '',
            privateCode: '',
            isPrivateLeague: false            
        }
    });
    const isPrivate = watch('isPrivateLeague');
    const makeLeaguePrivate = () => {
        setValue('privateCode', generateUUID());
    }
    const resetForm = async () => {
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
    
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-content" style={{width: '500px'}}>
                <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">Create new league</div>
                <div className="modal-body">
                    <div className="form-group text-start">
                        <label htmlFor="name" className="text-primary-emphasis">League Name</label>
                        <input type="text" className="form-control" {...register('name')} id="name"/>
                        <ErrorFeedback error={errors.name} />
                    </div>
                    <div className="form-group text-start">
                        <label htmlFor="description" className="text-primary-emphasis">League Description
                            (optional)</label>
                        <input type="text" className="form-control" {...register('description')} id="description"/>
                    </div>
                    <div className="form-check text-start">
                        <input className="form-check-input" type="checkbox" id="isPrivateLeague" name="isPrivateLeague" {...register('isPrivateLeague')} onClick={makeLeaguePrivate} />
                        <label className="form-check-label" htmlFor="isPrivateLeague">
                            Private League
                        </label>
                    </div>
                    {
                        isPrivate && <div className="form-group text-start">
                            <label htmlFor="privateCode" className="text-primary-emphasis">Private Code</label>
                            <input type="text" className="form-control" disabled {...register('privateCode')} id="privateCode"/>
                        </div>
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
export const CreateLeagueModal = ({actionsRef, afterSubmit}) => {
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

    useEffect(() => {
        console.log('user from Modal: ', user);
    }, []);
    
    const onConfirm = async (data) => {
        await saveLeague({
            id: generateUUID(),
            userId: user.id,
            name: data.name,
            description: data.description,
            privateCode: data.privateCode
        })
        afterSubmit();
        modal.hide();
    }
    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <ConfirmLeagueForm onSubmit={onConfirm} />
            </div>
        </div>
    );
}