import React, {useEffect, useRef, useState} from 'react';
import { getOpenLeagues } from '../../api/league';
import { LoadingOverlay } from '../../utils/loading';
import {useRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';
import {useCurrentSeason, useRefreshLeague} from '../../state/season';
import {JoinPublicLeagueModal} from './JoinPublicLeagueModal';
import {generateUUID} from '../../utils/helpers';

const Join = ({refreshSideMenu}) => {
    const [leagues, setLeagues] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const currentSeason = useCurrentSeason();
    const handleRefresh = useRefreshLeague();
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount]= useState(0);
    const [refresh, setRefresh] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [currentUser,] = useRecoilState(currentUserAtom);
    const joinModalRef = useRef();
    const leaguesPerPage = 3;

    useEffect(() => {
        setLoading(true)
        const loadLeague = async (page) => {
            const result = await getOpenLeagues(page, currentUser.id);
            setLeagues(result.leagues?.filter(f => f.userId !== currentUser.id) || []);
            setSeasons(result.leagueSeasons?.filter(f => !f.members.map(m => m).includes(currentUser.id)) || []);
            const count = Math.ceil(result.count / leaguesPerPage);
            setPageCount(count);
        }

        loadLeague(currentPage).then(() => {
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(true);
            setMessage(err.message);
        })

    }, [currentPage, refresh]);

    const getElimination = (elimination) => {
        switch (elimination){
            case 'hardCore':
                return `Hard Core: You're allowed no losses`;
            case 'oneMulligan':
                return `One Mulligan: You're allowed one losses`;
            case 'TwoMulligan':
                return `Two Mulligan: You're allowed two losses`;
            default:
                return `Never Out: You're never out of the season`
        }
    }
    const join = (league, season) => {
        joinModalRef.current.show(
            {
                currentUser,
                league,
                season: season
            }
        )
    }
    const joinRefresher = () => {
        if (currentPage > 0) {
            setCurrentPage(0);
        } else {
            setRefresh(generateUUID());
        }
        handleRefresh({member: {userId: currentUser.id}});
        refreshSideMenu();
    }

    const onPrevious = () => {
        setCurrentPage((prev) => {
            if (prev === 0) return prev;
            return prev - 1
        })
    }
    const onNext = () => {
        setCurrentPage((prev) => {
            if ((prev + 1) === pageCount) return prev;
            return prev + 1
        })
    }

    return (<>
        {loading && <LoadingOverlay message={message}/>}
        <div className="page container py-1">
            <div className="text-center">
                <div className="header-fontSize grey-begin text-shadow-black">Join A New League
                </div>
            </div>
            <div className="standard-background">
                <div>
                    {
                        leagues.map(league => {
                            const season = seasons.find(f => f.leagueId === league._id);
                            return (
                                <div key={league._id} className="standard-background card-join">
                                    <div className="text-center">
                                        <h5 className="text-white text-shadow-black">{`${league.name} - ${currentSeason.year}`}</h5>
                                        <h6>{league.description}</h6>
                                    </div>
                                    <div>
                                        <div>{`Members: ${season.members.length}`}</div>
                                        <div>{`Max Members: ${season.maxMembers}`}</div>
                                        <div className="text-center text-white text-shadow-black"
                                             style={{fontSize: '1.5em'}}>
                                            Rules
                                        </div>
                                        <ol className="rules-list">
                                            <li>{season.rules.gameType === 'survivor' ? 'Knockout Survivor' : 'Loser Pool'}</li>
                                            <li>{season.rules.cantPickSame ? `You're allowed to pick the same Team` : `You're not allowed to pick the same Team`}</li>
                                            <li>{getElimination(season.rules.elimination)}</li>
                                            <li>{season.rules.earlyPoint ? 'Losses early in the season count more against you' : 'Losses late in the season count more against you'}</li>
                                            <li>{season.rules.canSeePick ? `You can see other's pick before you make yours` : `You're not allowed to see other's picks before you make yours`}</li>
                                            <li>{season.rules.ties ? 'Ties count as Wins' : 'Ties count as Losses'}</li>
                                        </ol>
                                    </div>
                                    <div className="text-center mb-1">
                                        <div className="button-3D m-auto">
                                            <button type="button" onClick={() => join(league, currentSeason)}>Join this
                                                League
                                            </button>
                                        </div>
                                    </div>
                                </div>)
                        })
                    }
                </div>
                <div>
                    <div className="float-start" style={{marginLeft: '10px'}}>
                        {
                            `Current Page: ${currentPage + 1}`
                        }
                    </div>
                    <div className="float-end" style={{marginRight: '10px'}}>
                        {
                            `Total Pages: ${pageCount}`
                        }
                    </div>
                </div>
            </div>
            <div className="standard-background flex-container mt-3 p-4">


                <div className="button-3D">
                <button disabled={currentPage === 0} className={`${currentPage === 0 ? ' disabled-button ' : ''}`}
                        onClick={onPrevious}>Previous</button>
                </div>
                <div className="button-3D">
                    <button disabled={(currentPage + 1) === pageCount} className={`${(currentPage + 1) === pageCount ? ' disabled-button ' : ''}`}
                            onClick={onNext} >Next</button>
                </div>
            </div>
        </div>
        <JoinPublicLeagueModal actionsRef={joinModalRef} afterSubmit={joinRefresher}/>
    </>)
}

export default Join;
