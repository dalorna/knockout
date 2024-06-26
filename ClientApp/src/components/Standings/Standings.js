import React, {useEffect, useState} from 'react';
import {useCurrentSeason, useSeasonLeague, useSeasonLeagueRefresher, useTeams} from '../../state/season';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import {LoadingOverlay} from '../../utils/loading';
import {getPicksByWeek} from '../../api/picks';

const Standings = ({currentSelectedLeague, refreshSideMenu}) => {
    const currentSeason = useCurrentSeason();
    const selectedLeagueValue = JSON.parse(localStorage.getItem('selectedLeague'));
    const leagueSeason = useSeasonLeague(selectedLeagueValue._id);
    const refresher = useSeasonLeagueRefresher(selectedLeagueValue?._id);
    const teams = useTeams();
    const favorite = JSON.parse(localStorage.getItem('favoriteTeam'));
    const [displayWeek, setDisplayWeek] = useState(null);// picksByWeek
    const [loading, setLoading] = useState(false);
    const [picks, setPicks] = useState(null);

    useEffect(() => {
        setDisplayWeek(currentSeason?.weeks.find(w => w.isCurrent));
    }, []);
    useEffect(() => {
            setLoading(true);
            const getPicks = async () => {
                if (displayWeek) {
                    const res = await getPicksByWeek(leagueSeason[0]._id, (displayWeek.id + 1));
                    setPicks(res);
                }
            }
            getPicks().then(() => setLoading(false));
    }, [displayWeek, currentSelectedLeague]);
    const refreshSeasonLeague = () => {
        refresher();
        refreshSideMenu();
    }
    const getTeam = (teamId, userId, ) => {
        let displayTeamId = teamId;
        let isPick = false;
        if (picks && picks.length > 0 && !displayTeamId) {
            displayTeamId = picks.find(f => f.userId === userId)?.teamId;
            isPick = true
        }
        const city = teams.data.body.find(f => f.teamID === displayTeamId)?.teamCity || '';
        const name = teams.data.body.find(f => f.teamID === displayTeamId)?.teamName || '';
        return {team: displayTeamId !== "0" ? city + ' ' + name : 'No Pick', isPick };
    }
    const setSelectedWeek = (week) => {
        setDisplayWeek(week);
    }
    const getRecord = (weekResults) => {
        if (weekResults?.length > 0 && displayWeek && leagueSeason[0].rules.elimination !== 'hardCore') {
            let currentWeek = 'Current Record ';
            if (weekResults.find(f => f.week === displayWeek.id + 1)) {
                currentWeek = weekResults.find(f => f.week === displayWeek.id + 1).win ? 'Win' : 'Lose';
            }
            const wins = weekResults.filter(f => f.week <= displayWeek.id + 1).map(m => m.win).reduce((t, val) => t + (val * 1), 0);
            const loses = weekResults.filter(f => f.week <= displayWeek.id + 1).map(m => m.win).reduce((t, val) => t + (!val * 1), 0);
            return `: ${currentWeek} (${wins} - ${loses})`;
        }
        return '';
    }
    const getTeamDisplay = (team, userId, canSee) => {
        const display = canSee || !team.isPick ? team.team : (picks?.find(f => f.userId === userId) ? 'Pick Is in' : 'No Pick this week');
        return {display, color: team.isPick ? 'green' : 'black'};
    }
    const filterWeek = (weeklyResults) => {
        let alive = true;
        if (weeklyResults?.weekResults?.length > 0 && displayWeek) {
            if (leagueSeason[0].rules.elimination === 'hardCore') {
                alive = !(weeklyResults.weekResults.filter(f => f.week <= displayWeek.id + 1).map(m => m.win).reduce((t, val) => t + (!val * 1), 0) > 0);
            } else if (leagueSeason[0].rules.elimination === 'oneMulligan') {
                alive = !(weeklyResults.weekResults.filter(f => f.week <= displayWeek.id + 1).map(m => m.win).reduce((t, val) => t + (!val * 1), 0) > 1)
            } else if (leagueSeason[0].rules.elimination === 'twoMulligan') {
                alive = !(weeklyResults.weekResults.filter(f => f.week <= displayWeek.id + 1).map(m => m.win).reduce((t, val) => t + (!val * 1), 0) > 2)
            }
        }

        return alive;
    }
    const sortOverall = (a, b) => {
        const aWins = a.weekResults.length > 0 && displayWeek ? a.weekResults.filter(f => f.week <= displayWeek.id + 1).map(m => m.win).reduce((t, val) => t + (val * 1), 0) : 0;
        const bWins = b.weekResults.length > 0 && displayWeek ? b.weekResults.filter(f => f.week <= displayWeek.id + 1).map(m => m.win).reduce((t, val) => t + (val * 1), 0) : 0;
        return leagueSeason[0]?.rules.elimination !== 'neverOut' ? bWins - aWins || b.totalScoreDifferential - a.totalScoreDifferential : bWins - aWins || b.points - a.points;
    }
    const displayOverall = (result) => {
        if (result && result?.weekResults?.length > 0) {
            return result.username + ' - wins: ' + result.weekResults.map(m => m.win).reduce((t, val) => t + (val * 1), 0) + ', Score Diff: ' + result.totalScoreDifferential + ', Total Points: ' + result.weekResults.reduce((t, v) => t + v.points, 0);
        }
        return '';
    }
    const filterWeekKnockOut = (result) => {
        if(leagueSeason[0].rules.elimination === 'hardCore') {
            return !result.alive && result.weekResults.findIndex(f => f.points === 0) === displayWeek?.id
        } else if (leagueSeason[0].rules.elimination === 'oneMulligan') {
            return !result.alive && result.weekResults[displayWeek?.id]?.points === 0
        } else if (leagueSeason[0].rules.elimination === 'twoMulligan') {
            const hasTwoLosses = result.weekResults.filter(f => f.week <= displayWeek?.id + 1).map(m => m.win).reduce((t, val) => t + (!val * 1), 0) > 2;
            return !result.alive && result.weekResults[displayWeek?.id]?.points === 0 && hasTwoLosses
        }
        return true;
    }

    return (<>
            {loading && <LoadingOverlay message={'Loading please wait'}/>}
            <div className="container py-1">
                <div className="text-center">
                    <div className="header-fontSize grey-begin text-shadow-black">Standings</div>
                </div>
                <div className="mb-1 p-2 mx-3 standard-background" style={{overflow: 'visible'}}>
                    <div className="flex-container">
                        <div className="button-3D">
                            <label className="button-3D" style={{marginRight: '0px', height: '46px'}}>Select: </label>
                            <Dropdown>
                                <DropdownButton title={displayWeek?.name ?? ''} id="weekSelect">
                                    {
                                        currentSeason.weeks.map(week => <Dropdown.Item key={week._id}
                                                                             onClick={() => setSelectedWeek(week)}>{week.name}</Dropdown.Item>)
                                    }
                                </DropdownButton>
                            </Dropdown>
                        </div>
                        <div className="button-3D">
                            <button type="button" onClick={refreshSeasonLeague}>Refresh</button>
                        </div>
                    </div>
                </div>
                <div className="mb-1 p-2 mx-3 standard-background">
                    <div className="text-center" style={{borderBottom: 'solid 1px black'}}>
                        <div style={{fontSize: '1.5em'}} className={`${favorite?.favoriteTeam}-color`}>
                            {
                                `${currentSeason?.weeks?.find(w => w.isCurrent)?.id === displayWeek?.id ? 'Current Week' : displayWeek?.name}`
                            }

                        </div>
                    </div>
                    <div className="standings-grid">
                        <div>
                            <div style={{fontSize: '1.25em'}} className={`${favorite?.favoriteTeam}-color`}>Still Alive
                            </div>
                            <ol>
                                {
                                    leagueSeason[0]?.weeklyResults?.filter(f => filterWeek(f))
                                        .sort((a, b) => sortOverall(a, b))
                                        .map((result, i) => {
                                            const min = Math.min(result?.weekResults.map(m => m.week));
                                            const teamId = result?.weekResults.find(f => f.week === (displayWeek?.id + 1))?.teamId;
                                            const team = getTeam(teamId, result?.userId);
                                            const record = !(min > (displayWeek?.id + 1)) ? getRecord(result.weekResults) : '';
                                            const teamDisplay = !(min > (displayWeek?.id + 1))
                                                ? getTeamDisplay(team, result?.userId, leagueSeason[0].rules.canSeePick) : {display: `No results, Competition Started Week ${min}`}
                                            return (
                                                <li key={i} style={{color: teamDisplay.color}}>
                                                    {
                                                        `${result?.username} ${teamDisplay.display} ${record}`
                                                    }
                                                </li>
                                            );
                                        })
                                }
                                {
                                    leagueSeason[0]?.weeklyResults?.length === 0 && picks?.length > 0 &&
                                    <ol>
                                        {
                                            picks.map(pick => {
                                                return (
                                                    <li key={pick._id} style={{textDecoration: 'underline'}}>
                                                        {
                                                            pick.username + ' ' + getTeam(pick.teamId, pick.userId).team
                                                        }
                                                    </li>
                                                );
                                            })
                                        }
                                    </ol>
                                }
                            </ol>
                        </div>
                        <div>
                            <div style={{fontSize: '1.25em'}} className={`${favorite?.favoriteTeam}-color`}>Knocked
                                Out!
                            </div>
                            <ol>
                                {
                                    leagueSeason[0]?.weeklyResults?.filter(result => filterWeekKnockOut(result)).map((result, i) => {
                                        return (
                                            <li key={i}>
                                                {
                                                    result?.username + ' ' + getTeam(result?.weekResults[displayWeek?.id]?.teamId, result?.userId).team
                                                }
                                            </li>
                                        );
                                    })
                                }
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="mb-1 p-2 mx-3 standard-background">
                    <div className="text-center" style={{borderBottom: 'solid 1px black'}}>
                        <div style={{fontSize: '1.5em'}} className={`${favorite?.favoriteTeam}-color`}>Overall
                        </div>
                    </div>
                    <div className="standings-grid">
                        <div>
                            <div style={{fontSize: '1.25em'}} className={`${favorite?.favoriteTeam}-color`}>Overall
                                Standings
                            </div>
                            <ol>
                                {
                                    leagueSeason[0]?.weeklyResults?.filter(f => f.alive)
                                        .sort((a, b) => sortOverall(a, b))
                                        .map((result, i) => {
                                            return (
                                                <li key={i}>
                                                    {
                                                        displayOverall(result)
                                                    }
                                                </li>
                                            );
                                        })
                                }
                            </ol>
                        </div>
                        <div>
                            <div style={{fontSize: '1.25em'}} className={`${favorite?.favoriteTeam}-color`}>Knocked Out!
                            </div>
                            <ol>
                                {
                                    leagueSeason[0]?.weeklyResults?.filter(f => !f.alive).map((result, i) => {
                                        return (
                                            <li key={i}>
                                                {
                                                    `${result?.username} week ${Math.max.apply(Math, result?.weekResults.map(m => m.week))}`
                                                }
                                            </li>
                                        );
                                    })
                                }
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Standings;