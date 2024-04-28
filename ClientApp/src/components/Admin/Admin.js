import {getLastTenSeason} from '../../api/season'
import React, {useEffect, useState, useRef} from 'react';
import {LoadingOverlay} from '../../utils/loading';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import {CreateNewSeasonModal} from './CreateNewSeasonModal';
import {ProcessWeekModal} from './ProcessWeekModal';
import {SetCurrentWeekModal} from './SetCurrentWeekModal';
import {SetNewCurrentYearModal} from './SetNewCurrentYearModal';
import useSound from 'use-sound';
import chime from '../../assets/nfl-draft-chime.mp3'

const Admin = () => {
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSeason, setCurrentSeason] = useState(null);
    const [displaySeason, setDisplaySeason] = useState(null);
    const createSeasonModalRef = useRef();
    const processWeekModalRef = useRef();
    const setCurrentWeekModalRef = useRef();
    const setNewCurrentYearModalRef = useRef();
    const [play] = useSound(chime);

    useEffect(() => {
        setLoading( true);
        const loadSeasons = async () => {
            const res = await getLastTenSeason();
            const current = res.find(f => f.isCurrent);
            setSeasons(res);
            setCurrentSeason(current);
            setDisplaySeason(current);
        };

        loadSeasons().then(() => setLoading(false));
    }, []);
    const setSelectedYear = (season) => {
        setDisplaySeason(season);
    }
    const createNewSeason = () => {
        play();
        createSeasonModalRef.current.show(
            {
                season: currentSeason
            }
        )
    }
    const setCurrentWeek = (week) => {
        setCurrentWeekModalRef.current.show(
            {
                season: currentSeason,
                week
            }
        )
    }
    const processWeek = (week) => {
        processWeekModalRef.current.show(
            {
                season: currentSeason,
                week
            }
        )
    }
    const setNewCurrentYear = () => {
        setNewCurrentYearModalRef.current.show(
            {
                season: currentSeason
            }
        )
    }
    const refreshWeeks = (season) => {
        setDisplaySeason(season.currentWeekResult);
    }

    return (<>
        {loading && <LoadingOverlay message={'Loading Please Wait'}/>}
        <div className="page container py-1">
            <div className="text-center">
                <div className="header-fontSize grey-begin text-shadow-black">Administration Page</div>
            </div>
            <div className="p-2 standard-background">
                <div className="button-3D">
                    <label className="button-3D" style={{marginRight: '0px', height: '46px'}}>Year: </label>
                    <Dropdown>
                        <DropdownButton title={displaySeason?.year ?? 'Select Current Year'} id="yearSelect">
                            {
                                seasons.map(season => <Dropdown.Item key={season._id} onClick={() => setSelectedYear(season)} >{season.year}</Dropdown.Item>)
                            }
                        </DropdownButton>
                    </Dropdown>
                </div>
                <div className="mt-2 p-2">
                    <div className="text-center">
                        <div className="header-fontSize-medium grey-begin text-shadow-black">
                            Weeks
                        </div>
                    </div>
                    <div className="week-grid">
                        {
                            displaySeason?.weeks.map((week) => {
                                return (
                                    <div key={week.id} className="button-3D mt-4 p-3" style={{width: '250px'}}>
                                        <button type="button" style={{color: week.isCurrent ? 'green' : ''}} onClick={() => setCurrentWeek(week)} >
                                            {
                                                week.name
                                            }
                                        </button>
                                        <button type="button" style={{color: week.isCurrent ? 'green' : ''}} onClick={() => processWeek(week)} >Run</button>

                                    </div>
                            )})
                        }
                    </div>
                </div>
                <div className="mt-5 flex-container">
                    <div className="button-3D">
                        <button type="button" onClick={createNewSeason}>Create New Season</button>
                    </div>
                    <div className="button-3D">
                        <button type="button" onClick={setNewCurrentYear}>Update Current Year</button>
                    </div>
                </div>
            </div>
            <CreateNewSeasonModal actionsRef={createSeasonModalRef}/>
            <ProcessWeekModal actionsRef={processWeekModalRef}/>
            <SetCurrentWeekModal actionsRef={setCurrentWeekModalRef} afterSubmit={refreshWeeks} />
            <SetNewCurrentYearModal actionsRef={setNewCurrentYearModalRef} />
        </div>
    </>);
}

export default Admin;