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

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setLeague(details.league);
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
            if (leagueSeason) {
                leagueSeason.locked = isSubmit;
                leagueSeason.rules.canSeePick = rules.canSeePick;
                leagueSeason.rules.earlyPoint = rules.earlyPoint;
                leagueSeason.rules.elimination = rules.elimination;
                leagueSeason.rules.gameType = rules.gameType;
                leagueSeason.rules.ties = rules.ties;
                leagueSeason.rules.cantPickSame = rules.cantPickSame
                const result = await updateLeagueSeason(leagueSeason);
            } else {
                const newLeagueSeason = {
                    seasonId,
                    leagueId: league._id,
                    privateCode: league.privateCode,
                    locked: isSubmit,
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
            afterSubmit(isSubmit);
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
                                    onClick={saveCurrentRules}>Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}