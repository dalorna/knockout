import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';
import {updateCurrentWeek, updateCurrentWeekDateTime} from '../../api/season';
import moment from 'moment/moment';

export const SetCurrentWeekModal = ({actionsRef, afterSubmit}) => {
    const [modal, modalRef] = useModalInstance();
    const [season, setSeason] = useState(null);
    const [week, setWeek] = useState(null);
    const [firstGameDate, setFirstGameDate] = useState(new Date());
    const [newCurrentWeek, setNewCurrentWeek] = useState(null);

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setSeason(details.season);
                setWeek(details.week);
                const fgd = details.week.firstGameDate ? new Date(details.week.firstGameDate) : new Date();
                setFirstGameDate(fgd);
                modal.show();
            },
            hide: () => closeModal(),
        }),
        [modal]
    );

    const setCurrentWeek = async (event) => {
        event.preventDefault();
        if(season && week) {
            try {
                await updateCurrentWeekDateTime({
                    year: season.year,
                    week,
                    firstGameDate
                });
                if (newCurrentWeek) {
                    const updatedSeason = await updateCurrentWeek({
                        year: season.year,
                        week
                    });
                    afterSubmit(updatedSeason)
                }
                // after submit needs to update the screen to show the current week
                toast.success('Current Week changes');
                closeModal();
            } catch (err) {
                toast.error(err?.message ?? err);
            }

        }
    }

    const dateChange = (e) => {
        setFirstGameDate(new Date(e.target.value))
    }
    const closeModal = () => {
        modal.hide();
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        Set Current Week
                    </div>
                    <form onSubmit={setCurrentWeek}>
                        <div className="modal-body">
                            <div>
                                {
                                    `The current week will be ${week?.name} for season for ${season?.year}`
                                }
                            </div>
                            <div className="form-check form-check-inline">
                                <input type="checkbox" className="form-check-input"
                                       onChange={(e) => setNewCurrentWeek(e.target.checked)}
                                       id="newCurrentWeek"/>
                                <label htmlFor="newCurrentWeek" className="text-primary-emphasis">Set New Current
                                    Week</label>
                            </div>
                            <div className="form-check text-start">
                                <label htmlFor="firstGameDate" className="text-primary-emphasis">First Game Date</label>
                                <input type="datetime-local" className="form-control" required
                                       onChange={(e) => dateChange(e)}
                                       value={moment(firstGameDate).local().format('YYYY-MM-DDTHH:mm')}
                                       id="firstGameDate"/>
                            </div>
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
                                <button>Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}