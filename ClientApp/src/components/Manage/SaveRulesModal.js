import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';
import {saveRulesBody, submitRulesBody} from '../../utils/constants';
import {getLeagueSeasonByLeagueIdSeasonId, updateLeagueSeason, saveLeagueSeason} from '../../api/league';

export const SaveRulesModal = ({actionsRef, isSubmit, afterSubmit}) => {
    const [modal, modalRef] = useModalInstance();
    const [rules, setRules] = useState(null);
    const [league, setLeague] = useState(null);
    const [seasonId, setSeasonId] = useState(null);
    const [locked, setLocked] = useState(false);

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setLeague(details.league);
                setLocked(details.locked);
                setSeasonId(details.seasonId);
                setRules(details.rules);
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );

    const saveCurrentRules = async () => {
        try {
            const leagueSeason = await getLeagueSeasonByLeagueIdSeasonId(seasonId, league._id);
            if (leagueSeason.data) {
                leagueSeason.data.locked = locked;
                leagueSeason.data.rules.canSeePick = rules.canSeePick;
                leagueSeason.data.rules.earlyPoint = rules.earlyPoint;
                leagueSeason.data.rules.elimination = rules.elimination;
                leagueSeason.data.rules.gameType = rules.gameType;
                leagueSeason.data.rules.ties = rules.ties;
                leagueSeason.data.rules.cantPickSame = rules.cantPickSame
                await updateLeagueSeason(leagueSeason.data);
            } else {
                const newLeagueSeason = {
                    seasonId,
                    leagueId: league._id,
                    privateCode: league.privateCode,
                    locked,
                    rules: {
                        canSeePick: rules.canSeePick,
                        earlyPoint: rules.earlyPoint,
                        elimination: rules.elimination,
                        gameType: rules.gameType,
                        ties: rules.ties,
                        cantPickSame: rules.cantPickSame
                    }
                }
                await saveLeagueSeason(newLeagueSeason);
            }
            afterSubmit();
            toast.success('League Successfully Saved');
        } catch (err) {
            toast.error(err.message)
        } finally {
            modal.hide();
        }

    }
    
    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        {
                            isSubmit ? 'Submit Rules' : 'Save Rules'
                        }
                    </div>
                    <div className="modal-body">
                        {
                            isSubmit ? submitRulesBody : saveRulesBody
                        }
                    </div>
                    <div className="modal-footer bg-dark-subtle">
                        <button type="button" className="btn btn-outline-secondary btn-standard-width"
                                data-bs-dismiss="modal"
                                aria-label="Close">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-secondary btn-margin-right btn-standard-width"
                                onClick={saveCurrentRules}>Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}