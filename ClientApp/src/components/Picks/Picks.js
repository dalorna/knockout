import {
    useCurrentPickRefresh,
    useCurrentUserPicksLeagueSeason
} from '../../state/picks';
import {useWeeklySchedule} from '../../state/nfl';
import {useForm} from 'react-hook-form';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {SavePickModal} from './SavePickModal';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {generateUUID} from '../../utils/helpers';
import {currentUserAtom} from '../../state/user';
import {useCurrentSeason, useSeasonLeague, useTeams} from '../../state/season';
import {useRecoilState} from 'recoil';
import SimpleModal from '../../utils/simpleModal';

const validationSchema = yup.object().shape({
    pick: yup.string().required("must make a pick")
}).required()

const Picks = () => {
    const season =  useCurrentSeason();
    const week = season?.weeks.find(f => f.isCurrent);
    const [currentUser,] = useRecoilState(currentUserAtom);
    const selectedLeagueValue = JSON.parse(localStorage.getItem('selectedLeague'));
    const leagueSeason = useSeasonLeague(selectedLeagueValue._id);
    const picksByUser = useCurrentUserPicksLeagueSeason(currentUser.id, leagueSeason[0]._id);
    const currentWeeklyPick = picksByUser?.find(f => f.weekId === (week?.id + 1));
    const refresher = useCurrentPickRefresh(currentUser.id, leagueSeason[0]._id);
    const currentWeeklySchedule = useWeeklySchedule(season.year, week?.id + 1);
    const createModalRef = useRef();
    const teams = useTeams();
    const [show, setShow] = useState(false);
    const [modalProps , ]= useState({ modalTitle: 'Invalid Pick', modalBody: `You've already pick this team, and cannot pick again`, handleClose: () => setShow(false)});

    const {
        register,
        handleSubmit,
        formState: { isValid},
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
           pick: currentWeeklyPick ? currentWeeklyPick.teamId + '-' + currentWeeklyPick?.gameId : null
        },
        mode: 'onChange'
    })

    useEffect(() => {
        reset( {pick: currentWeeklyPick ? currentWeeklyPick.teamId + '-' + currentWeeklyPick.gameId : null})
    }, [reset, currentWeeklyPick])

    const handleOnSubmit = (data) => {
        if (!!picksByUser.find(f => f.teamId === data.pick.split('-')[0]) && leagueSeason[0].rules.cantPickSame) {
            setShow(true);
            return;
        }

        if (isAlive()) {
            const currentPickId = currentWeeklyPick?._id;
            const pick = {
                id: currentPickId ?? generateUUID(),
                userId: currentUser.id,
                username: currentUser.username,
                weekId: week?.id + 1,
                leagueSeasonId: leagueSeason[0]._id,
                locked: false,
                gameId: data.pick.split('-')[1],
                teamId: data.pick.split('-')[0]
            };
            createModalRef.current.show(
                {
                    pick: pick,
                    week: currentWeeklySchedule.find(f => f.gameID === pick.gameId),
                    teams: teams.data.body,
                    currentPickId: currentPickId,
                    selectedLeagueValue
                }
            )
        }
    }
    const refreshPick = async () => {
        refresher();
    }
    const getSelectedTeamName = () => {
        if (currentWeeklyPick?.teamId) {
            return teams.data.body.find(f => f.teamID === currentWeeklyPick?.teamId)?.teamCity + ' ' + teams.data.body.find(f => f.teamID === currentWeeklyPick?.teamId)?.teamName;
        } else {
            return 'has not been selected';
        }
    }
    const isAlive = () => {
        if (leagueSeason[0].weeklyResults && leagueSeason[0].weeklyResults.length === 0) {
            return true
        }
        return leagueSeason[0].weeklyResults.find(f => f.userId === currentUser.id)?.alive;
    }
    const isDisabled = () => {
        return !isValid || currentWeeklyPick?.locked || !isAlive() || passedDue();
    }
    const passedDue = () => {
        return !currentWeeklyPick?.locked && (new Date()).getTime() > (new Date(season.weeks.find(f => f.isCurrent).firstGameDate)).getTime();
    }
    const showPickDate = () => {
        return !currentWeeklyPick?.locked && (new Date()).getTime() < (new Date(season.weeks.find(f => f.isCurrent).firstGameDate)).getTime();
    }

    return <>
        <div className="container py-1">
            {
                !isAlive() && <div className="container overlay-alive"></div>
            }
            <div className="text-center">
                <div style={{fontSize: '2em'}} className="grey-begin text-shadow-black">Picks - {selectedLeagueValue.name}</div>
            </div>
            {
                isAlive() ? (
                    <div className={`mb-1 p-3 mx-3  standard-background  ${currentWeeklyPick?.locked ? 'text-success' : 'text-danger'}`}>
                        <div className="row">
                            <div className="col-8">
                                {
                                    passedDue() ? `You're pick is passed due, and will count as a loss` :
                                        `Current Pick for ${week.name} ${getSelectedTeamName()} ${currentWeeklyPick?.locked ? 'Locked' : 'Not Locked'}`
                                }
                            </div>
                            <div className="col-4 text-info-emphasis">
                                {
                                    showPickDate() ? `Pick must be in by ${new Date(season.weeks.find(f => f.isCurrent).firstGameDate).toLocaleString()}`: ''
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`mb-1 p-3 mx-3  standard-background  ${currentWeeklyPick?.locked ? 'text-success' : 'text-danger'}`}>
                        You are no longer eligible to compete.
                    </div>
                )
            }

            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="row p-2 mx-3  standard-background" style={{maxHeight: '75vh', overflow: 'auto'}}>
                    <div className="glass-container">
                        {
                            currentWeeklySchedule.map((game, i) => {
                                return (
                                    <GameCard key={i} game={game} teams={teams} register={register}
                                              currentWeeklyPick={currentWeeklyPick} previousPicks={picksByUser}
                                              rules={leagueSeason[0].rules} passeDue={passedDue}/>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="p-2 mx-3 mt-1 text-center flex-container  standard-background">
                    <div className="button-3D">
                        <button type="submit" aria-label="Save Pick"
                                disabled={isDisabled()}>
                            Save Pick
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <SavePickModal actionRef={createModalRef} afterSubmit={refreshPick}/>
        <SimpleModal props={modalProps} show={show} />
    </>
}
export default Picks;

const GameCard = ({game, teams, register, currentWeeklyPick, previousPicks, rules, passeDue}) => {
    const disableAway = !!previousPicks.find(f => f.teamId === game.teamIDAway) && rules.cantPickSame;
    const disableHome = !!previousPicks.find(f => f.teamId === game.teamIDHome) && rules.cantPickSame;
    return ( <div key={game.gameID} className={"glass " + (game.gameID === currentWeeklyPick?.gameId ? ' picked': '')} style={{'--r': '2'}}
             data-text={`${game.away} vs ${game.home}`}>
            <div style={{display: 'grid', gridTemplateColumns: 'auto', padding: '5px 4px 5px 4px', marginTop: '10px'}}>
                <div className={`form-check form-check-inline ${disableAway && game.gameID !== currentWeeklyPick?.gameId  ? 'disabled-pick' : ''}`}>
                    <input className="form-check-input"
                           type="radio" {...register('pick')}
                           disabled={passeDue() || disableAway}
                           id="exampleRadios1"
                           value={`${game.teamIDAway}-${game.gameID}`}/>
                    <span>{teams.data.body.find(f => f.teamID === game.teamIDAway)?.teamCity}</span>
                    <img
                        alt=""
                        className="icon" style={{marginBottom: '-8px'}}
                        src={teams.data.body.find(f => f.teamID === game.teamIDAway)?.nflComLogo1}/>
                </div>
                <div  className={`form-check form-check-inline ${disableHome && game.gameID !== currentWeeklyPick?.gameId ? 'disabled-pick' : ''}`}>
                    <input className="form-check-input"
                           type="radio" {...register('pick')}
                           disabled={passeDue() || disableHome}
                           id="exampleRadios1"
                           value={`${game.teamIDHome}-${game.gameID}`}/>
                    <span>{teams.data.body.find(f => f.teamID === game.teamIDHome)?.teamCity}</span>
                    <img
                        alt=""
                        className="icon" style={{marginBottom: '-8px'}}
                        src={teams.data.body.find(f => f.teamID === game.teamIDHome)?.nflComLogo1}/>
                </div>
                <div style={{marginTop: '10px'}}>
                    {
                        ` ${moment(game.gameDate, "YYYYMMDD").format('MMM Do YYYY')}, @${game.gameTime}`
                    }
                </div>
            </div>
        </div>
    )
}