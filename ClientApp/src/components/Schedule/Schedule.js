import {useCurrentSeason} from '../../state/season';
import {useNFLSeason} from '../../state/nfl';
import moment from 'moment';

const Schedule = () => {
    const season = useCurrentSeason();
    const nflSchedule = useNFLSeason('2023');
    const weekly = Object.groupBy(nflSchedule.data.body, ({gameWeek}) => gameWeek);
    const weeklySchedule = Object.keys(weekly).map((key) => weekly[key]);

    return <div className="page container py-1">
        <div className="text-center">
            <div style={{fontSize: '3em'}} className="grey-begin text-shadow-black">{`Schedule - ${season.data[0].year}`}</div>
        </div>
        <div className="p-3 shadow-sm rounded bg-white mx-3 mt-5">
            <div className="accordion" id="accordionWeeklySchedule">
                {
                    weeklySchedule.map((week, i) => {
                        return (
                            <div key={i} className="accordion-item">
                                <h2 className="accordion-header" id={`heading${i}`}>
                                    <button className="accordion-button" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${i}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse${i}`}>
                                        {`Week ${i + 1}`}
                                    </button>
                                </h2>
                                <div id={`collapse${i}`}
                                     className={`accordion-collapse collapse ${i === 0 ? 'show' : ''} `}
                                     aria-labelledby={`heading${i}`} data-bs-parent="#accordionWeeklySchedule">
                                    <div className="accordion-body">
                                        {
                                            week.map((week, j) => <div className="card" key={i + j}>
                                                <div className="card-body">
                                                    <h6 className="card-subtitle mb-2 text-muted">{`${week.away} vs ${week.home}`}</h6>
                                                    <p className="card-text">{`${moment(week.gameDate, "YYYYMMDD").format('MMM Do YYYY')}, @${week.gameTime}`}</p>
                                                </div>
                                            </div>)
                                        }
                                    </div>
                                </div>
                            </div>


                        )
                    })
                }
            </div>
        </div>
    </div>
}
export default Schedule;