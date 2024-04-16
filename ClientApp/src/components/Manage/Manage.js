import { useForm } from 'react-hook-form';
import { useRef, useState, useEffect} from 'react';
import { Tooltip } from 'react-tooltip';
import {useCurrentSeason, useSeasonLeagueRefresher} from '../../state/season';
import { SaveRulesModal } from './SaveRulesModal';
import { loser, survivor } from '../../utils/constants';
import {getLeagueSeasonByLeagueIdSeasonId} from '../../api/league';

const Manage = ({currentSelectedLeague}) => {
    const season = useCurrentSeason();
    const selectedLeague = JSON.parse(localStorage.getItem('selectedLeague'));
    const refresher = useSeasonLeagueRefresher(selectedLeague.value?._id);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isDisabled, setIsDisabled] = useState([false, false, false, false]);
    const [locked, setLocked] = useState(false);
    const createModalRef = useRef();
    const favorite = JSON.parse(localStorage.getItem('favoriteTeam'));

    const defaultValues = {
        canSeePick: false,
        gameType: "",
        elimination: "",
        ties: false,
        cantPickSame: false,
        earlyPoint: false
    }
    const {
        register,
        watch,
        reset,
        handleSubmit,
        setValue
    } = useForm({
        defaultValues: defaultValues
    })
    const gameType = watch('gameType');

    useEffect(() => {
        const load = async () => {
            return await getLeagueSeasonByLeagueIdSeasonId(season.data[0].id, currentSelectedLeague.value?._id)
        };
        load().then((res) => {
            if (res?.data?.rules) {
                if (res.data.rules.elimination === 'hardCore') {
                    setHardCore();
                }
                setLocked(res.data.locked);
                reset(res.data.rules);
            } else {
                reset(defaultValues);
            }
        })
    }, [reset, currentSelectedLeague.value])

    const handleOnSubmit = async (data) => {
        const rules = {
            canSeePick: data.canSeePick,
            gameType: data.gameType,
            elimination: data.elimination,
            ties: data.ties,
            cantPickSame: data.cantPickSame,
            earlyPoint: data.earlyPoint
        };
        createModalRef.current.show(
            {
                league: selectedLeague,
                seasonId: season.data[0].id,
                rules: rules
            }
        )
    };
    const refreshRules = async (locked) => {
        refresher();
        setLocked(locked);
    }
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

    return (<>
        <div className="container py-2">
            <div className="mb-2 p-2 standard-background">
                <div className="text-center">
                    <div
                        className={`header-fontSize ${favorite?.favoriteTeam}-color`}>{`Manage - ${selectedLeague?.name}`}</div>
                    <p>As the administrator of the league, you will decide what type of game you will be playing this
                        year,
                        once the game type is set. You can then pick all of the rules of the league</p>
                </div>
            </div>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="row mt-3">
                    <div className="col-3"/>
                    <div className="col-3">
                        <div className="standard-background manage-card">
                            <div className="text-center">
                                <h4 className={`${favorite?.favoriteTeam}-color`}>Knockout Survivor</h4>
                            </div>
                            <div>
                                <input id="survivor" className="football manage-card"
                                       type="radio" {...register('gameType')}
                                       onClick={(e) => onGameTypeChange(e.target.value)}
                                       value="survivor" disabled={locked}/>
                                <label htmlFor="survivor">
                                    <span className="outer">
                                        <span className="inner">
                                        </span>
                                    </span>
                                    <p className="inlet">
                                        <span className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                            Must Pick a <strong>Winner</strong> Each Week
                                        </span>
                                    </p>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="standard-background manage-card">
                            <div className="text-center">
                                <h4 className={`${favorite?.favoriteTeam}-color`}>Knockout Survivor</h4>
                            </div>
                            <div>
                                <input id="loser" className="football manage-card"
                                       type="radio" {...register('gameType')}
                                       onClick={(e) => onGameTypeChange(e.target.value)}
                                       value="loser" disabled={locked}/>
                                <label htmlFor="loser">
                                    <span className="outer">
                                        <span className="inner">
                                        </span>
                                    </span>
                                    <p className="inlet">
                                        <span className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                            Must Pick a <strong>Loser</strong> each week
                                        </span>
                                    </p>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    gameType &&
                    <>
                        <div className="p-3 mt-4 standard-background">
                            <div className="text-center">
                                <h5>{gameType === 'survivor' ? 'Survivor Series Rules' : 'Loser Pot Rules'}</h5>
                            </div>
                            <div className="row">
                                <div className="col-1"/>
                                <div className="col-5 standard-background">
                                    <div>
                                        <div className="text-center">
                                            <h4 className={`${favorite?.favoriteTeam}-color`}>Elimination Rules</h4>
                                        </div>
                                        <div>
                                            <div>
                                                <input className="football manage-card" id="hardCore"
                                                       type="radio" {...register('elimination')}
                                                       onClick={onHardCoreClick}
                                                       value="hardCore" disabled={locked}/>
                                                <label htmlFor="hardCore">
                                                    <span className="outer">
                                                        <span className="inner">
                                                        </span>
                                                    </span>
                                                    <p className="inlet">
                                                        <span className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                                                    Hard Core
                                                        </span>
                                                    </p>
                                                </label>
                                            </div>
                                            <div>
                                                <input className="football manage-card" id="oneMulligan"
                                                       type="radio" {...register('elimination')}
                                                       onClick={onNonHardCoreClick}
                                                       value="oneMulligan" disabled={locked}/>
                                                <label htmlFor="oneMulligan">
                                                    <span className="outer">
                                                        <span className="inner">
                                                        </span>
                                                    </span>
                                                    <p className="inlet">
                                                        <span
                                                            className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                                                    One Mulligan
                                                        </span>
                                                    </p>
                                                </label>
                                            </div>
                                            <div>
                                                <input className="football manage-card" id="twoMulligan"
                                                       type="radio" {...register('elimination')}
                                                       onClick={onNonHardCoreClick}
                                                       value="twoMulligan" disabled={locked}/>
                                                <label htmlFor="twoMulligan">
                                                    <span className="outer">
                                                        <span className="inner">
                                                        </span>
                                                    </span>
                                                    <p className="inlet">
                                                        <span
                                                            className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                                                    Two Mulligan
                                                        </span>
                                                    </p>
                                                </label>
                                            </div>
                                            <div>
                                                <input className="football manage-card" id="neverOut"
                                                       type="radio" {...register('elimination')}
                                                       onClick={onNonHardCoreClick}
                                                       value="neverOut" disabled={locked}/>
                                                <label htmlFor="neverOut">
                                                    <span className="outer">
                                                        <span className="inner">
                                                        </span>
                                                    </span>
                                                    <p className="inlet">
                                                        <span
                                                            className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                                                   Never Out
                                                        </span>
                                                    </p>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5" style={{minHeight: '220px'}}>
                                    <div className="standard-background" style={{minHeight: '220px'}}>
                                        <div className="text-center">
                                            <h4 className={`${favorite?.favoriteTeam}-color`}>Optional Rules</h4>
                                        </div>
                                        <div>
                                            <div>
                                                <input className="football"
                                                    type="checkbox" {...register('ties', {disabled: locked || isDisabled[0]})}
                                                    id="ties"/>
                                                <label htmlFor="ties">
                                                    <span className="outer-checkbox">
                                                        <span className="inner">
                                                        </span>
                                                    </span>
                                                    <p className="inlet">
                                                        <span
                                                            className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                                                Ties Count as Losses
                                                        </span>
                                                    </p>
                                                </label>
                                            </div>
                                            <div>
                                                <input className="football"
                                                       type="checkbox" {...register('canSeePick', {disabled: locked || isDisabled[1]})}
                                                       id="canSeePick"/>
                                                <label htmlFor="canSeePick">
                                                    <span className="outer-checkbox">
                                                        <span className="inner">
                                                        </span>
                                                    </span>
                                                    <p className="inlet">
                                                        <span
                                                            className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                                                See Other's picks
                                                        </span>
                                                    </p>
                                                </label>
                                            </div>
                                            <div>
                                                <input className="football"
                                                       type="checkbox" {...register('earlyPoint', {disabled: locked || isDisabled[2]})}
                                                       id="earlyPoint"/>
                                                <label htmlFor="earlyPoint">
                                                    <span className="outer-checkbox">
                                                        <span className="inner">
                                                        </span>
                                                    </span>
                                                    <p className="inlet">
                                                        <span
                                                            className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                                             Early losses Count more
                                                        </span>
                                                    </p>
                                                </label>
                                            </div>
                                            {
                                                gameType === 'loser' &&
                                                <div>
                                                    <input className="football"
                                                           type="checkbox" {...register('cantPickSame', {disabled: locked || isDisabled[3]})}
                                                           id="cantPickSame"/>
                                                    <label htmlFor="cantPickSame">
                                                        <span className="outer-checkbox">
                                                            <span className="inner">
                                                            </span>
                                                        </span>
                                                        <p className="inlet">
                                                            <span
                                                                className={`text__effect ${favorite?.favoriteTeam}-color`}>
                                                                    Can't pick the same team
                                                            </span>
                                                        </p>
                                                    </label>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 mt-5 flex-container standard-background" style={{marginTop: '7em'}}>
                            <div className="button-3D" >
                                <button
                                    type="submit" data-tooltip-id="save-tip" data-tooltip-variant="info"
                                    data-tooltip-content="Save your setting for later"
                                    aria-label="Save Form" disabled={locked}
                                    className={`${locked ? ' disabled-button ' : ''}`}
                                    onClick={() => setIsSubmit(false)}
                                >
                                    <Tooltip id="save-tip"/>
                                    Save Rules
                                </button>
                            </div>
                            <div className="button-3D">
                                <button
                                    type="submit" data-tooltip-id="submit-tip" data-tooltip-variant="info"
                                    data-tooltip-content="This will finalize your league rules!"
                                    aria-label="Save Form" disabled={locked}
                                    className={`${locked ? ' disabled-button ' : ''}`}
                                    onClick={() => setIsSubmit(true)}
                                >
                                    <Tooltip id="submit-tip"/>
                                    Submit Final Rules
                                </button>
                            </div>
                        </div>
                    </>
                }
            </form>
        </div>
        <SaveRulesModal actionsRef={createModalRef} isSubmit={isSubmit} afterSubmit={refreshRules}/>
    </>);
}
export default Manage;
