import {useModalInstance} from '../../utils/simpleModal';
import {useEffect, useImperativeHandle, useState} from 'react';
import toast from 'react-hot-toast';
import moment from 'moment/moment';
import {savePick, updatePick } from '../../api/picks';

export const SavePickModal = ({actionRef, afterSubmit}) => {
    const [modal, modalRef] = useModalInstance();
    const [pick, setPick] = useState({});
    const [week, setWeek] = useState({});
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState({});
    const [currentPickId, setCurrentPickId] = useState(null);
    const [selectedLeagueValue, setSelectedLeagueValue] = useState(null);

    useEffect(() => {
        if (week.teamIDHome === pick.teamId) {
            setSelectedTeam(teams.find(f => f.teamID === week.teamIDHome));
        } else {
            setSelectedTeam(teams.find(f => f.teamID === week.teamIDAway));
        }
    }, [teams, pick])

    useImperativeHandle(actionRef, () => ({
        show: (details) => {
            setPick(details.pick);
            setWeek(details.week);
            setTeams(details.teams);
            setCurrentPickId(details.currentPickId);
            setSelectedLeagueValue(details.selectedLeagueValue);
            modal.show();
        },
        hide: () => modal.hide()
    }), [modal]);

    const onSave = async (lockPick) => {
        pick.locked = lockPick;
        try {
            if (currentPickId) {
                await updatePick(pick);
            } else {
                await savePick(pick);
            }
            afterSubmit(pick);
            toast.success(`Pick is ${lockPick ? ' Locked and Saved' : ' Saved'} `);
        } catch (err) {
            toast.error(err.message || err);
        } finally {
            modal.hide();
        }

    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        <h5>{selectedLeagueValue?.description}</h5>
                    </div>
                    <div className="modal-body">
                        {
                            week && (
                                <>
                                    <div className="mb-1">
                                        <div>
                                            {
                                                `${week.away} vs ${week.home} ${moment(week.gameDate, 'YYYYMMDD').format('MMM Do YYYY')}, @${week.gameTime}`
                                            }
                                        </div>
                                        <div>
                                            <label>{`Your ${week.gameWeek} pick is the ${selectedTeam?.teamCity} ${selectedTeam?.teamName}`}</label>
                                            <img
                                                alt={week.teamIDHome === pick.teamId ? week.home : week.away}
                                                className="icon" style={{marginBottom: '4px'}}
                                                src={selectedTeam?.nflComLogo1}/>
                                        </div>


                                    </div>
                                    <div>
                                        {`You may save your pick or LOCK your pick for the week. Are you sure you want to Save?`}
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className="modal-footer bg-dark-subtle">
                        <button type="button" className="btn btn-outline-secondary btn-standard-width"
                                data-bs-dismiss="modal"
                                aria-label="Close">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-secondary btn-margin-right btn-standard-width"
                                onClick={() => onSave(false)}>Save
                        </button>
                        <button type="submit" className="btn btn-secondary btn-margin-right btn-standard-width"
                                onClick={() => onSave(true)}>Lock Pick
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}