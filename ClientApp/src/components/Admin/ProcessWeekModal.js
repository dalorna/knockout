import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';

export const ProcessWeekModal = ({actionsRef, afterSubmit}) => {
    const [modal, modalRef] = useModalInstance();
    const [season, setSeason] = useState(null);
    const [week, setWeek] = useState(null);
    const [leagueSeasonId, setLeagueSeasonId] = useState('');

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

    const processWeek = async () => {
        if(season && week && leagueSeasonId) {
            try {

                // web socket to show working...
                // web socket will be used to update first login after game
                const result = await processWeek({
                    leagueSeasonId: "",
                    week
                });
                toast.success('Current Season changes');
                modal.hide();
            } catch (err) {
                toast.error(err?.message ?? err);
            }
        } else {
            toast.error('Input requirements not met!');
        }
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        {
                            `Process ${week?.name} for season for ${season?.year}`
                        }
                    </div>
                    <div className="modal-body">
                        <div>
                            <label className="mx-2">
                                League Season Id:
                            </label>
                            <input
                                type="text"
                                id="leagueSeasonId"
                                onChange={(e) => setLeagueSeasonId(e.target.value)}
                                value={leagueSeasonId}
                                style={{width: '300px'}}
                            />
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
                            <button type="submit"
                                    onClick={processWeek}>Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}