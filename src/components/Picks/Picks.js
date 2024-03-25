import { useWeeklySchedule } from '../../state/season';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import {useState, useRef} from 'react';
import {SavePickModal} from './SavePickModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
    pick: yup.string().required("must make a pick")
}).required()


const Picks = ({currentSelectedLeague}) => {
    const currentWeeklySchedule = useWeeklySchedule('2023', 1);
    const createModalRef = useRef();
    const [pickLocked, ] = useState(false); // from get pick
    // get pick, save pick
    
    const {
        register,
        handleSubmit,
        formState: { isValid}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            pick: null
        },
        mode: 'onChange'
    })
    const handleOnSubmit = (data) => {
        console.log('data', data);
        createModalRef.current.show(
            {
                pick: data.pick,
                week: currentWeeklySchedule
            }
        )
    }

    return <>
        <div className="page container py-4 py-sm-5">
            <div className="mb-2 p-2 bg-primary text-white rounded text-center">
                <h2>Picks - {currentSelectedLeague.value.name}</h2>
            </div>
            <div className="mb-1 p-3 bg-success shadow-sm rounded text-success bg-white mx-3">
                pick for the week:
            </div>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="row p-2 shadow-sm rounded bg-white mx-3" style={{maxHeight: '47vh', overflow: 'auto'}}>
                    {
                        currentWeeklySchedule.map(game => {
                            return (
                                <div key={game.gameID} className="card">
                                    <div className="card-body">
                                        <div className="card-subtitle mb-2 text-muted">
                                            {
                                                `${game.away} vs ${game.home} ${moment(game.gameDate, "YYYYMMDD").format('MMM Do YYYY')}, @${game.gameTime}`
                                            }
                                        </div>
                                        <div className="card-text mb-2 text-muted">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" {...register('pick')}
                                                       disabled={pickLocked}
                                                       id="exampleRadios1" value={`${game.away}_${game.gameID}`} />
                                                <label className="form-check-label"
                                                       htmlFor={`${game.away}_${game.gameID}`}>
                                                    {
                                                        game.away
                                                    }
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" {...register('pick')}
                                                       disabled={pickLocked}
                                                       id="exampleRadios1" value={`${game.home}_${game.gameID}`} />
                                                <label className="form-check-label"
                                                       htmlFor={`${game.home}_${game.gameID}`}>
                                                    {
                                                        game.home
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="p-3 shadow-sm rounded bg-body-secondary mx-3 mt-5 text-end">
                    <button type="submit" className="btn btn-primary" aria-label="Save Pick" disabled={!isValid}>
                        Save Pick
                    </button>
                </div>
            </form>
        </div>
        <SavePickModal actionRef={createModalRef}/>
    </>
}
export default Picks;