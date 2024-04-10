import {useCurrentPickLeagueSeasonWeek, useCurrentPickRefresh} from '../../state/picks';
import {useWeeklySchedule} from '../../state/nfl';
import {useForm} from 'react-hook-form';
import moment from 'moment';
import React, {useEffect, useRef} from 'react';
import {SavePickModal} from './SavePickModal';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {generateUUID} from '../../utils/helpers';
import {useUser} from '../../state/user';
import {useSeasonLeague, useTeams} from '../../state/season';

const validationSchema = yup.object().shape({
    pick: yup.string().required("must make a pick")
}).required()

const Picks = () => {
    // TODO: get Current Week and Year
    const week = 1;
    const year = '2023';
    const userId = useUser();
    // const season = useCurrentSeason(year);
    const selectedLeagueValue = JSON.parse(localStorage.getItem('selectedLeague'));
    const leagueSeason = useSeasonLeague(selectedLeagueValue._id);
    const currentWeeklyPick = useCurrentPickLeagueSeasonWeek(userId, leagueSeason[0].data._id, week);
    const refresher = useCurrentPickRefresh(userId, leagueSeason[0].data._id, week);
    const currentWeeklySchedule = useWeeklySchedule(year, week);
    const createModalRef = useRef();
    const teams = useTeams();
    
    const {
        register,
        handleSubmit,
        formState: { isValid},
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
           pick: currentWeeklyPick.data[0] ? currentWeeklyPick.data[0].teamId + '-' + currentWeeklyPick?.data[0].gameId : null
        },
        mode: 'onChange'
    })

    useEffect(() => {
        reset( {pick: currentWeeklyPick.data[0] ? currentWeeklyPick.data[0].teamId + '-' + currentWeeklyPick.data[0].gameId : null})
    }, [reset, currentWeeklyPick])

    const handleOnSubmit = (data) => {
        const currentPickId = currentWeeklyPick.data[0]?._id;
        const pick = {
            id: currentPickId ?? generateUUID(),
            userId: userId,
            weekId: week,
            leagueSeasonId: leagueSeason[0].data._id,
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

    const refreshPick = async () => {
        refresher();
    }

    const getSelectedTeamName = () => {
        if (currentWeeklyPick.data[0]?.teamId) {
            return teams.data.body.find(f => f.teamID === currentWeeklyPick.data[0]?.teamId)?.teamCity + ' ' + teams.data.body.find(f => f.teamID === currentWeeklyPick.data[0]?.teamId)?.teamName;
        } else {
            return 'has not been selected';
        }
    }
    
    return <>
        <div className="page-container py-1 font-algerian">
            <h4 className="mb-1 p-3 text-black text-center ">
                Picks - {selectedLeagueValue.name}
            </h4>
            <div className={`mb-1 p-3 bg-success shadow-sm rounded bg-white mx-3  ${currentWeeklyPick.data[0]?.locked ? 'text-success' : 'text-danger' }`}  >
                {
                    `Current Pick for the week ${ week } is ${getSelectedTeamName()} ${currentWeeklyPick.data[0]?.locked ? 'Locked' : 'Not Locked'}`
                }
            </div>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="row p-2 shadow-sm rounded bg-white mx-3" style={{maxHeight: '75vh', overflow: 'auto'}}>
                    <div className="glass-container" >
                        {
                            currentWeeklySchedule.map((game, i) => {
                                return (
                                        <GameCard key={i} game={game} teams={teams} register={register}
                                                              currentWeeklyPick={currentWeeklyPick}/>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="p-1 shadow-sm rounded bg-white mx-3 mt-1 text-center">
                    <button type="submit" className="btn btn-primary" aria-label="Save Pick"
                            disabled={!isValid || currentWeeklyPick.data[0]?.locked}>
                        Save Pick
                    </button>
                </div>
            </form>
        </div>
        <SavePickModal actionRef={createModalRef} afterSubmit={refreshPick}/>
    </>
}
export default Picks;

const GameCard = ({game, teams, register, currentWeeklyPick}) => {
    return ( <div key={game.gameId} className={"glass " + (game.gameID === currentWeeklyPick.data[0].gameId ? ' picked': '')} style={{'--r': '2'}}
             data-text={`${game.away} vs ${game.home}`}>
            <div style={{display: 'grid', gridTemplateColumns: 'auto', padding: '5px', marginTop: '10px'}} className="font-algerian" >
                <div className="form-check form-check-inline">
                    <input className="form-check-input"
                           type="radio" {...register('pick')}
                           disabled={currentWeeklyPick.data[0]?.locked}
                           id="exampleRadios1"
                           value={`${game.teamIDAway}-${game.gameID}`}/>
                    <span>{teams.data.body.find(f => f.teamID === game.teamIDAway)?.teamCity}</span>
                    <img
                        alt=""
                        className="icon" style={{marginBottom: '-8px'}}
                        src={teams.data.body.find(f => f.teamID === game.teamIDAway)?.nflComLogo1}/>


                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input"
                           type="radio" {...register('pick')}
                           disabled={currentWeeklyPick.data[0]?.locked}
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