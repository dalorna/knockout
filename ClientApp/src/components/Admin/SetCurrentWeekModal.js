import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';
import {updateCurrentWeek} from '../../api/season';

export const SetCurrentWeekModal = ({actionsRef, afterSubmit}) => {
    const [modal, modalRef] = useModalInstance();
    const [season, setSeason] = useState(null);
    const [week, setWeek] = useState(null);

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setSeason(details.season);
                setWeek(details.week);
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );

    const setCurrentWeek = async () => {
        if(season && week) {
            try {
                const updatedSeason = await updateCurrentWeek({
                    year: season.year,
                    week
                });
                // after submit needs to update the screen to show the current week
                afterSubmit(updatedSeason)
                toast.success('Current Week changes');
                modal.hide();
            } catch (err) {
                toast.error(err?.message ?? err);
            }

        }
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        Set Current Week
                    </div>
                    <div className="modal-body">
                        {
                            `The current week will be ${week?.name} for season for ${season?.year}`
                        }
                    </div>
                    <div className="modal-footer bg-dark-subtle flex-container">

                        <div className="button-3D">
                            <button type="button"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                Cancel
                            </button>
                        </div>
                        <div className="button-3D">
                            <button type="submit"
                                    onClick={setCurrentWeek}>Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}