import { useForm } from 'react-hook-form';
import {useRef, useState} from 'react';
import { Tooltip } from 'react-tooltip';
import { getRuleByLeagueId } from '../../api/rules';
import { generateUUID } from '../../utils/helpers';
import { useCurrentLeagues } from '../../state/rule';
import {SaveRulesModal} from './SaveRulesModal';

const Manage = () => {
    const currentLeagues = useCurrentLeagues();
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [currentRules, setCurrentRules] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const createModalRef = useRef();
    
    const {
        register,
        watch,
        reset,
        handleSubmit
    } = useForm({ })
    const gameType = watch('gameType');
    const locked = watch('locked')
    
    const handleOnSubmit = async (data) => {
        const rules =  {
            id: currentRules?.id ?? generateUUID(),
            leagueId: currentRules?.leagueId ?? selectedLeague.id,
            canSeePick: data.canSeePick,
            gameType: data.gameType,
            elimination: data.elimination,
            ties: data.ties,
            cantPickSame: data.cantPickSame,
            earlyPoint: data.earlyPoint,
            locked: isSubmit
        };

        createModalRef.current.show(
            {
                rules: rules,
                currentRulesId: currentRules?.id
            }
        )
    };

    const setLeague = async (id) => {
        const l = currentLeagues.data.find(f => f.id === id);
        const r = await getRuleByLeagueId(l.id);
        setSelectedLeague(l);
        if (r && r.data && r.data.length > 0) {
            setCurrentRules(r.data[0]);
            reset(r.data[0]);
        }
    }
    
    return(<>
        {
            !selectedLeague && <>
            <div  className="page container py-4 py-sm-5 form-background-color">
                <div className="mb-2 p-5 bg-primary text-white rounded">
                    <ul >
                        {
                            currentLeagues.data.map((league) => 
                                <li className="select" key={league.id} onClick={() => setLeague(league.id)} >{league.name}</li>
                            )
                        }
                    </ul>
                </div>
            </div>
            </>
        }
        {
        selectedLeague && <>
            <div className="page container py-4 py-sm-5 form-background-color">
                <div className="mb-2 p-5 bg-info text-white rounded">
                    <div className="text-center">
                        <h4>{`Manage - ${selectedLeague.name}`}</h4>
                        <h6>{selectedLeague.Description}</h6>
                        <p>As the administrator of the league, you will decide what type of game you will be playing this
                            year,
                            once the game type is set. You can then pick all of the rules of the league</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <div className="row">
                        <div className="col-3"/>
                        <div className="col-3">
                            <div className="card border-info" data-tooltip-id="survivor-tip"
                                 data-tooltip-content="Survivor Series" data-tooltip-variant="info">
                                <Tooltip id="survivor-tip"/>
                                <div className="card-header text-center bg-info">
                                    Survivor Series
                                </div>
                                <div className="card-body">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" {...register('gameType')}
                                               value="survivor" disabled={locked} />
                                        <label className="form-check-label">
                                            Must Pick a <strong>Winner</strong> Each Week
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card border-info">
                                <div className="card-header text-center bg-info">
                                    Loser Pot
                                </div>
                                <div className="card-body">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" {...register('gameType')}
                                               value="loser" disabled={locked} />
                                        <label className="form-check-label">
                                            Must Pick a <strong>Loser</strong> each week
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 shadow-sm rounded bg-white mx-3 mt-5">
                        <div className="text-center">
                            <h5>{ gameType === 'survivor' ? 'Survivor Series Rules' : 'Loser Pot Rules'}</h5>
                        </div>
                        <div className="row">
                            <div className="col-1"></div>
                            <div className="col-5">
                                <div className="card">
                                    <div className="card-header">
                                        Elimination Rules
                                    </div>
                                    <div className="card-body">
                                        <h5>Select the Elimination rules fo the league</h5>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" {...register('elimination')}
                                                   value="hardCore" disabled={locked} />
                                            <label className="form-check-label" htmlFor="hardCore">
                                                Hard Core
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" {...register('elimination')}
                                                   value="oneMulligan" disabled={locked}/>
                                            <label className="form-check-label" htmlFor="oneMulligan">
                                                One Mulligan
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" {...register('elimination')}
                                                   value="twoMulligan" disabled={locked}/>
                                            <label className="form-check-label" htmlFor="twoMulligan">
                                                Two Mulligans
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" {...register('elimination')}
                                                   value="neverOut" disabled={locked}/>
                                            <label className="form-check-label" htmlFor="neverOut">
                                                Never Out - requires Point system
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="card">
                                    <div className="card-header">
                                        Optional Rules
                                    </div>
                                    <div className="card-body">
                                        <h5>Optional Rules</h5>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('ties', {disabled: locked})}
                                                   id="ties"/>
                                            <label className="form-check-label" htmlFor="ties">
                                                Ties Count as Losses
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('canSeePick', {disabled: locked})}
                                                   id="canSeePick"/>
                                            <label className="form-check-label" htmlFor="canSeePick">
                                                See Other's picks
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('earlyPoint', {disabled: locked})}
                                                   id="earlyPoint"/>
                                            <label className="form-check-label" htmlFor="earlyPoint">
                                                Early losses Count more
                                            </label>
                                        </div>
                                        {
                                            gameType === 'loser' && <div className="form-check form-check-inline">
                                                <input className="form-check-input"
                                                       type="checkbox" {...register('cantPickSame', {disabled: locked})}
                                                       id="cantPickSame"/>
                                                <label className="form-check-label" htmlFor="cantPickSame">
                                                    Can't pick the same team
                                                </label>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 shadow-sm rounded bg-body-secondary mx-3 mt-5 text-end">
                        <button
                            type="button" data-tooltip-id="select-tip" data-tooltip-variant="info"
                            data-tooltip-content="Click to Switch Leagues"
                            className="btn btn-outline-secondary btn-margin-right float-start"
                            aria-label="Home"
                            onClick={() => setSelectedLeague(null)}>
                            <Tooltip id="select-tip" />
                            Select League
                        </button>
                        <button
                            type="submit" data-tooltip-id="save-tip" data-tooltip-variant="info"
                            data-tooltip-content="Save your setting for later"
                            className="btn btn-primary btn-margin-right"
                            aria-label="Save Form" disabled={locked}
                            onClick={() => setIsSubmit(false)}
                        >
                            <Tooltip id="save-tip" />
                            Save Rules
                        </button>
                        <button
                            type="submit" data-tooltip-id="submit-tip" data-tooltip-variant="info"
                            data-tooltip-content="This will finalize your league rules!"
                            className="btn btn-primary"
                            aria-label="Save Form" disabled={locked}
                            onClick={() => setIsSubmit(true)}
                        >
                            <Tooltip id="submit-tip" />
                            Submit Final Rules
                        </button>
                    </div>
                </form>
            </div>
        </>
    }
    <SaveRulesModal actionsRef={createModalRef} isSubmit={isSubmit} />
    </>);
}
export default Manage;
