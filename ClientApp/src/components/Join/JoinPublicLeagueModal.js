import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState} from 'react';
import {joinLeague} from '../../api/league';
import toast from 'react-hot-toast';

export const JoinPublicLeagueModal = ({actionsRef, afterSubmit}) => {
    const [modal, modalRef] = useModalInstance();
    const [user, setUser] = useState(null);
    const [league, setLeague] = useState(null);
    const [season, setSeason] = useState(null);

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setUser(details.currentUser);
                setLeague(details.league);
                setSeason(details.season);
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );

    const onJoinLeague = async () => {
        let result;
        try {
            result = await joinLeague({
                leagueId: league._id,
                member: {
                    userId: user.id,
                    username: user.username
                }});
            if (result.status === 204) {
                toast.error(result.statusText);
            } else {
                afterSubmit();
                toast.success('League Successfully Joined');
            }
        } catch (e) {
            toast.error(e?.message ?? e);
        } finally {
            modal.hide();
        }

    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center" >
                        <h5>Join New League</h5>
                    </div>
                    <div className="modal-body">
                        <div>
                            <label>
                                {`League Name: ${league?.name}`}
                            </label>
                        </div>
                        <div>
                            {
                                league?.description &&
                                <label>
                                    {`League Description: ${league?.description}`}
                                </label>
                            }
                        </div>
                        <div>
                            <label>{`Season: ${season?.year}`}</label>
                        </div>
                    </div>
                    <div className="modal-footer">
                            <div className="button-3D">
                                <button type="button" style={{marginLeft: '-100px'}}
                                        data-bs-dismiss="modal"
                                        aria-label="Close">
                                    Cancel
                                </button>
                            </div>
                            <div className="button-3D">
                                <button type="submit" onClick={onJoinLeague}
                                        className="btn btn-secondary btn-standard-width mx-2">Join
                                </button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}