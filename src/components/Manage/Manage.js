import { useForm } from 'react-hook-form';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const Manage = () => {
    const [gameType, setGameType] = useState('')
    const navigate = useNavigate();

    //TODO: Modal window
    //TODO: Loading Spinner

    const {
        register,
        handleSubmit
    } = useForm({})
    const handleOnSubmit = (data) => {
        console.log('data', data);
    };

    return <div className="page container py-4 py-sm-5 form-background-color">
        <div className="mb-2 p-5 bg-primary text-white rounded">
            <div className="text-center">
                <h2>Manage</h2>
                <p>As the administrator of the league, you will decide what type of game you will be playing this year,
                    once the game type is set. You can then pick all of the rules of the league</p>
            </div>

        </div>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="row">
                <div className="col-3"/>
                <div className="col-3">
                    <div className="card border-info" data-tooltip-id="survivor-tip" data-tooltip-content="Survivor Series" data-tooltip-variant="info">
                        <Tooltip id="survivor-tip" />
                        <div className="card-header text-center bg-info">
                            Survivor Series
                        </div>
                        <div className="card-body">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" {...register("gameType")}
                                       value="survivor" onChange={(x) => {
                                    setGameType(x.target.value)
                                }}/>
                                <label className="form-check-label" htmlFor="flexCheckDefault">
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
                                <input className="form-check-input" type="radio" {...register("gameType")} value="loser"
                                       onChange={(x) => {
                                           setGameType(x.target.value)
                                       }}/>
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    Must Pick a <strong>Loser</strong> each week
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                gameType === 'survivor' &&
                <div className="p-3 shadow-sm rounded bg-white mx-3 mt-5">
                    <div className="text-center">
                        <h5>Survivor Series Rules</h5>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox"  {...register("hardCore")} id="hardCore"/>
                        <label className="form-check-label" htmlFor="HardCore">
                            Hard Core
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" {...register("hardCore")} id="noMulligan"/>
                        <label className="form-check-label" htmlFor="noMulligan">
                            No Mulligans
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" {...register("hardCore")} id="oneMulligan"/>
                        <label className="form-check-label" htmlFor="oneMulligan">
                            One Mulligan
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" {...register("hardCore")} id="twoMulligan"/>
                        <label className="form-check-label" htmlFor="twoMulligan">
                            Two Mulligans
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" {...register("hardCore")} id="NeverOut"/>
                        <label className="form-check-label" htmlFor="NeverOut">
                            Never Out - requires Point system
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" {...register("hardCore")} id="tiesCount"/>
                        <label className="form-check-label" htmlFor="tiesCount">
                            Ties Count as Losses
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" {...register("canSeePick")} id="tiesCount"/>
                        <label className="form-check-label" htmlFor="tiesCount">
                            See Other's picks
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" {...register("earlyPoint")} id="tiesCount"/>
                        <label className="form-check-label" htmlFor="tiesCount">
                            Early losses Count more
                        </label>
                    </div>
                </div>
            }
            {
                gameType === "loser" &&
                <div className="p-3 shadow-sm rounded bg-white mx-3 mt-5">
                    Loser Rules
                    {/*                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1"
                           value="option1"/>
                    <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                           value="option2"/>
                    <label className="form-check-label" htmlFor="inlineRadio2">2</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3"
                           value="option3" disabled/>
                    <label className="form-check-label" htmlFor="inlineRadio3">3 (disabled)</label>
                </div>*/}
                </div>
            }
            <div className="p-3 shadow-sm rounded bg-body-secondary mx-3 mt-5 text-end">
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-margin-right btn-standard-width"
                    aria-label="Home"
                    onClick={() => navigate('/home')}>
                    Home
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-margin-right btn-standard-width"
                    aria-label="Save Form"
                >
                    Save
                </button>
                <button
                    type="submit"
                    className="btn btn-primary btn-standard-width"
                    aria-label="Save Form"
                >
                    Submit
                </button>

            </div>
        </form>

    </div>
}
export default Manage;