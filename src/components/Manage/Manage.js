import { useForm } from 'react-hook-form';
import { useRef, useState, useEffect} from 'react';
import { Tooltip } from 'react-tooltip';
import { getRuleByLeagueId } from '../../api/rules';
import { generateUUID } from '../../utils/helpers';
import { useCurrentLeagues, useCurrentSeason } from '../../state/rule';
import { SaveRulesModal } from './SaveRulesModal';
import { loser, survivor } from '../../utils/constants';

const Manage = ({currentSelectedLeague}) => {
    const currentLeagues = useCurrentLeagues();
    const season = useCurrentSeason();
    const [currentRules, setCurrentRules] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isDisabled, setIsDisabled] = useState([false, false, false, false])
    const createModalRef = useRef();
    
    useEffect(() => {
        const load = async () => {
            const l = currentLeagues.data.find(f => f.id === currentSelectedLeague.value.id);
            const r = await getRuleByLeagueId(l.id);
            if (r && r.data && r.data.length > 0) {
                setCurrentRules(r.data[0]);
                reset(r.data[0]);
                setValue('gameType', r.data[0].gameType);
                if (r.data[0].gameType === 'hardCore') {
                    setHardCore();
                }
            }
        };
        
        load().then(() => {});
    }, [])
    
    const {
        register,
        watch,
        reset,
        handleSubmit,
        setValue
    } = useForm({
    })
    const gameType = watch('gameType');
    const locked = watch('locked')
    
    const handleOnSubmit = async (data) => {
        const rules =  {
            id: currentRules?.id ?? generateUUID(),
            leagueId: currentSelectedLeague.value,
            canSeePick: data.canSeePick,
            gameType: data.gameType,
            elimination: data.elimination,
            ties: data.ties,
            cantPickSame: data.cantPickSame,
            earlyPoint: data.earlyPoint
        };

        createModalRef.current.show(
            {
                rules: rules,
                currentRulesId: currentRules?.id,
                locked: isSubmit,
                seasonId: season.data[0].id
            }
        )
    };
/*    const setLeague = async (id) => {
        const l = currentLeagues.data.find(f => f.id === id);
        const r = await getRuleByLeagueId(l.id);
        if (r && r.data && r.data.length > 0) {
            setCurrentRules(r.data[0]);
            reset(r.data[0]);
            setValue('gameType', r.data[0].gameType);
            if (r.data[0].gameType === 'hardCore') {
                setHardCore();
            }
        }
    }*/

    const onHardCoreClick = () => {
        setValue('canSeePick', false);
        setValue('ties', true);
        setValue('earlyPoint', false);
        setValue('cantPickSame', false);
        setHardCore();
    }
    const setHardCore = () => {
        setIsDisabled([true, true, true, true])
    }    
    const onNonHardCoreClick = () => {
        setIsDisabled([false, false, false, false])
    }
    const onGameTypeChange = (gameType) => {
        if (gameType === survivor) {
            setValue('cantPickSame', false);
        }
    }
    
    return(<>

    
            <div className="page container py-4 py-sm-5 form-background-color">
                <div className="mb-2 p-5 bg-info text-white rounded">
                    <div className="text-center">
                        <h4>{`Manage - ${currentSelectedLeague.value?.name}`}</h4>
                        <h6>{currentSelectedLeague.value?.Description}</h6>
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
                                               onClick={(e) => onGameTypeChange(e.target.value)}
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
                                            onClick={(e) => onGameTypeChange(e.target.value)}
                                               value="loser" disabled={locked} />
                                        <label className="form-check-label">
                                            Must Pick a <strong>Loser</strong> each week
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        gameType &&
                        <>
                            <div className="p-3 shadow-sm rounded bg-white mx-3 mt-5">
                                <div className="text-center">
                                    <h5>{gameType === 'survivor' ? 'Survivor Series Rules' : 'Loser Pot Rules'}</h5>
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
                                                    <input className="form-check-input"
                                                           type="radio" {...register('elimination')}
                                                        onClick={onHardCoreClick}
                                                           value="hardCore" disabled={locked}/>
                                                    <label className="form-check-label" htmlFor="hardCore">
                                                        Hard Core
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input"
                                                           type="radio" {...register('elimination')}
                                                           onClick={onNonHardCoreClick}
                                                           value="oneMulligan" disabled={locked}/>
                                                    <label className="form-check-label" htmlFor="oneMulligan">
                                                        One Mulligan
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input"
                                                           type="radio" {...register('elimination')}
                                                           onClick={onNonHardCoreClick}
                                                           value="twoMulligan" disabled={locked}/>
                                                    <label className="form-check-label" htmlFor="twoMulligan">
                                                        Two Mulligans
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input"
                                                           type="radio" {...register('elimination')}
                                                           onClick={onNonHardCoreClick}
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
                                                           type="checkbox" {...register('ties', {disabled: locked || isDisabled[0]})}
                                                           id="ties"/>
                                                    <label className="form-check-label" htmlFor="ties">
                                                        Ties Count as Losses
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input"
                                                           type="checkbox" {...register('canSeePick', {disabled: locked || isDisabled[1]})}
                                                           id="canSeePick"/>
                                                    <label className="form-check-label" htmlFor="canSeePick">
                                                        See Other's picks
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input"
                                                           type="checkbox" {...register('earlyPoint', {disabled: locked || isDisabled[2]})}
                                                           id="earlyPoint"/>
                                                    <label className="form-check-label" htmlFor="earlyPoint">
                                                        Early losses Count more
                                                    </label>
                                                </div>
                                                {
                                                    gameType === 'loser' && <div className="form-check form-check-inline">
                                                        <input className="form-check-input"
                                                               type="checkbox" {...register('cantPickSame', {disabled: locked  || isDisabled[3]})}
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
                                    type="submit" data-tooltip-id="save-tip" data-tooltip-variant="info"
                                    data-tooltip-content="Save your setting for later"
                                    className="btn btn-primary btn-margin-right"
                                    aria-label="Save Form" disabled={locked}
                                    onClick={() => setIsSubmit(false)}
                                >
                                    <Tooltip id="save-tip"/>
                                    Save Rules
                                </button>
                                <button
                                    type="submit" data-tooltip-id="submit-tip" data-tooltip-variant="info"
                                    data-tooltip-content="This will finalize your league rules!"
                                    className="btn btn-primary"
                                    aria-label="Save Form" disabled={locked}
                                    onClick={() => setIsSubmit(true)}
                                >
                                    <Tooltip id="submit-tip"/>
                                    Submit Final Rules
                                </button>
                            </div>
                        </>
                    }
                </form>
            </div>
            
        
        <SaveRulesModal actionsRef={createModalRef} isSubmit={isSubmit}/>
    </>);
}
export default Manage;
