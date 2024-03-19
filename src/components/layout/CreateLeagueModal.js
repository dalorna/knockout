import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { saveLeague } from '../../api/user';
import { generateUUID } from '../../utils/helpers';


export const ConfirmLeagueForm = ({onSubmit}) => {
    const { handleSubmit, register } = useForm();
    
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-content" style={{width: '500px'}}>
                <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">Create new league</div>
                <div className="modal-body">
                    <div className="form-group text-start">
                        <label htmlFor="name" className="text-primary-emphasis" >League Name</label>
                        <input type="text" className="form-control" {...register('name')} id="name"/>
                    </div>
                    <div className="form-group text-start">
                        <label htmlFor="description" className="text-primary-emphasis">League Description (optional)</label>
                        <input type="text" className="form-control" {...register('description')} id="namdescriptione"/>
                    </div>
                </div>
                <div className="modal-footer bg-dark-subtle ">
                    <button type="button" className="btn btn-outline-secondary btn-standard-width" data-bs-dismiss="modal"
                            aria-label="Close">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-secondary btn-margin-right btn-standard-width">Save</button>
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
        console.log('user', user);
        console.log('data', data);
        await saveLeague({
            id: generateUUID(),
            userId: user.id,
            name: data.name,
            description: data.description
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