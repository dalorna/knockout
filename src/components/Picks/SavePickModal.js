import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';

export const SavePickModal = ({actionRef}) => {
    const [modal, modalRef] = useModalInstance();
    const [pick, setPick] = useState(null);
    const [week, setWeek] = useState(null);

    useImperativeHandle(actionRef, () => ({
        show: (details) => {
            setPick(details.pick);
            setWeek(details.week);
            modal.show();
        },
        hide: () => modal.hide()
    }), [modal]);

    const onSave = () => {
        toast.success('Pick is Locked and Saved')
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        Save Pick
                    </div>
                    <div className="modal-body">
                        This will lock in your pick for the week. Are you sure you want to Save?
                    </div>
                    <div className="modal-footer bg-dark-subtle">
                        <button type="button" className="btn btn-outline-secondary btn-standard-width"
                                data-bs-dismiss="modal"
                                aria-label="Close">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-secondary btn-margin-right btn-standard-width"
                                disabled={!!pick}
                                onClick={onSave}>Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}