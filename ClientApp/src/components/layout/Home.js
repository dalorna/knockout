import React, {useEffect, useRef, useState} from 'react';
import '../../styles/components.scss';
import {seasonSelector, useCurrentSeason, useRefreshLeague, useTeams} from '../../state/season';
import {CreateLeagueModal} from './CreateLeagueModal';
import toast from 'react-hot-toast';
import {useRecoilState, useResetRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';
import {JoinLeagueModal} from './JoinLeagueModal';
import {getPicksByUserAllLeagues} from '../../api/picks';
import moment from 'moment';
import {LoadingOverlay} from '../../utils/loading';

const Home = ({leagues, setLeagues, refreshSideMenu}) => {
    const [currentUser,] = useRecoilState(currentUserAtom);
    const season = useCurrentSeason();
    const resetSeason = useResetRecoilState(seasonSelector);
    const createModalRef = useRef();
    const joinModalRef = useRef();
    const handleRefresh = useRefreshLeague();
    const teams = useTeams();
    const week = season?.weeks.find(f => f.isCurrent);
    const [picks, setPicks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        resetSeason();
    }, [])
    useEffect(() => {
        setLoading(true)
        const loadPicks = async (userId, weekId, leagueIds, seasonId) => {
            return await getPicksByUserAllLeagues(userId, {leagueIds, weekId, seasonId})
        }
        loadPicks(currentUser.id, week.id + 1, leagues.map(m => m._id), season._id).then(res => {
            setPicks(res);
            setLoading(false)
        });
    }, [week])

    const create = () => {
        createModalRef.current.show(
            {
                user: currentUser,
                season: season
            }
        )
    }
    const join = () => {
        joinModalRef.current.show(
            {
                user: currentUser
            }
        )
    }
    const refresher = (league) => {
        setLeagues([...leagues, league]);
        toast.success('League Successfully Saved')
    }
    const joinRefresher = () => {
        handleRefresh({member: {userId: currentUser.id}});
        refreshSideMenu();
    }

    return <>
        {loading && <LoadingOverlay message={'Loading please wait'}/>}
        <div className="container py-1 text-center overflow-auto">
            <div className="text-center">
                <div style={{fontSize: '2em'}}
                     className="grey-begin text-shadow-black">{`Welcome ${currentUser?.firstName} ${currentUser?.lastName}`}</div>
            </div>
            <div className="row p-3 mx-3 mt-1 standard-background">
                <h5>{`Create New League: ${season?.weeks?.find(f => f.isCurrent).name}`}</h5>
                <div className="flex-container">
                    <div className="button-3D">
                        <button onClick={create}>Create League</button>
                    </div>
                    <div className="button-3D">
                        <button onClick={join}>Join League</button>
                    </div>
                </div>
            </div>
            <div className="row p-3 standard-background mx-3 mt-1 overflow-auto" style={{height: '23vh'}}>
                <h5 style={{marginBottom: '2px'}}>{`Current status for all leagues`}</h5>
                <div>
                    {
                        leagues.map(m => {
                            const pick = picks?.userPicks?.find(f => f.leagueId === m._id);
                            const ls = picks?.leagueSeasons?.find(f => f.leagueId === m._id);
                            return (
                                <div key={m._id} className="row">
                                    {
                                        getSelectedTeamName(m.name, pick, ls, teams, season, currentUser.id, week)
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="row p-3 standard-background mx-3 mt-1 overflow-auto" style={{height: '35vh'}}>
                <h5>Feature enhancements</h5>
                <ol className="features text-start">
                    <li className="chiefs-red">
                        league should run when user navigates to standings page... (first user there runs the league)
                    </li>
                    <li>All pick feature, pick all the games</li>
                    <li>Add vegas line to pick screen in the card</li>
                    <li>Home page getSelectedTeam needs to be a component</li>
                    <li>
                        Manage Page: deactivate league, and create new season after season finish, kick a member
                    </li>
                    <li>
                        League Edit screen (name, add season to league)... leave league (for a member)
                    </li>
                    <li>Create a private league cost money. (set up payments)</li>
                    <li>
                        Clean up constants for rules, and pretty much everything else that needs a constant. Clean up
                        folders and file with proper casing
                    </li>
                    <li>Need to create role Visitor. Commissioner is done, SA is done, user is done</li>
                    <li>
                        Footer
                    </li>
                    <li>
                        Website Header reformat (Nav top)
                    </li>
                    <li>
                        Commissioner should see people who do not have pick yet for the week
                        (possibly send email to them)
                    </li>
                    <li>
                        Upload image icon
                    </li>
                    <li>
                        3 fonts for the 3 sections (menu, header, content)
                    </li>
                </ol>
            </div>
            <div className="row p-3 standard-background mx-3 mt-1 overflow-auto">
                <h6>Tests</h6>
                <ol className="features text-start">
                    <li>
                    Test joining a locked league, user needs to have a dialog showing why
                    </li>
                </ol>
            </div>
            <CreateLeagueModal actionsRef={createModalRef} afterSubmit={refresher} props={season}/>
            <JoinLeagueModal actionsRef={joinModalRef} afterSubmit={joinRefresher}/>
        </div>
    </>
}
const getSelectedTeamName = (leagueName, pick, ls, teams, season, userId, week) => {
    const alive = ls?.weeklyResults?.find(f => f.userId === userId)?.alive;
    let colorClass = 'chiefs-red';
    let textDecoration = '';
    let teamName = '';
    let lockedMessage = '';
    let aliveMessage = '';
    let eligibilityMessage = '';
    let dateMessage = ''
    if (pick?.teamId) {
        colorClass = 'text-primary-emphasis';
        teamName = teams.data.body.find(f => f.teamID === pick.teamId).teamCity + ' ' + teams.data.body.find(f => f.teamID === pick.teamId).teamName;
        if (!pick.locked) {
            lockedMessage = `, You pick is not locked for the week, please lock it before`
            dateMessage = moment(season.weeks[week.id]?.firstGameDate).local().format('MMM Do YYYY, h:mm a');
        }
    } else if (alive) {
        aliveMessage = passedDue(pick, season) ? `You're pick is passed due, and will count as a loss`
            : `No pick selected for the week, you have until `;
        dateMessage = !passedDue(pick, season) ? moment(season.weeks[week.id]?.firstGameDate).local().format('MMM Do YYYY, h:mm a') : '';
    } else {
        if (ls?.weeklyResults.length === 0) {
            eligibilityMessage = 'This league has not started yet';
        } else {
            textDecoration = 'strike-through'
            eligibilityMessage = `You're no longer eligible to compete`;
        }
    }
    return (
        <div className={`text-start ${colorClass} ${textDecoration}`}>
                <span>
                    {
                        `${leagueName}: ${teamName} ${lockedMessage} ${aliveMessage} ${eligibilityMessage}`
                    }
                </span>
            <span className="underline">
                    {
                        dateMessage
                    }
                </span>
        </div>
    );
}
const passedDue = (pick, season) => {
    return !pick?.locked && (new Date()).getTime() > (new Date(season?.weeks.find(f => f.isCurrent).firstGameDate)).getTime();
}

export default Home;