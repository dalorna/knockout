import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { SimpleModal } from '../../utils/simpleModal'
import { saveRule } from '../../api/rules';
import { generateUUID } from '../../utils/helpers';
import {useCurrentLeagues } from '../../state/rule';

const Manage = () => {
    // const user = useCurrentUser();
    const leagues = useCurrentLeagues();
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [gameType, setGameType] = useState('')
    const [rules,] = useState(null);
    const [show, setShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('Save Rules');
    const [modalBody, setModalBody] = useState('Save');
    const [isSubmit, setIsSubmit] = useState(false);
    const submitRulesBody = `Submitting the Rules will no longer allow edits, these will be the final rules for the season`; 
    const saveRulesBody = `Saving the rules will still allow for editing,\r Submit the rules with you're final decision`;

    const {
        register,
        handleSubmit
    } = useForm({
        defaultValues: {
            hardCore: true,
            gameType: 'survivor'
        }
    })
    
    const handleOnSubmit = async (data) => {
        setShow(true);
        setModalTitle(isSubmit ? 'Submit Rules' : 'Save Rules');
        setModalBody(isSubmit ? submitRulesBody : saveRulesBody)
        const rules =  {
            id: generateUUID(),
            leagueID: data.leagueId,
            canSeePick: data.canSeePick,
            gameType: data.gameType,
            hardCore: data.hardCore,
            neverOut: data.neverOut,
            oneMulligan: data.oneMulligan,
            twoMulligan: data.twoMulligan,
            ties: data.ties,
            cantPick: data.cantPick,
            earlyPoint: data.earlyPoint,
            locked: isSubmit
        };
        await saveRule(rules);

    };
    const onSaveData = (isSubmit) => {
        console.log('onSaveData', isSubmit)
    }    
    const setLeague = (id) => {
        const l = leagues.data.find(f => f.Id === id);
        setSelectedLeague(l);
    }

    return(<>
        {
            !selectedLeague && <>
            <div  className="page container py-4 py-sm-5 form-background-color">
                <div className="mb-2 p-5 bg-primary text-white rounded">
                    <ul >
                        {
                            leagues.data.map((league) => 
                                <li className="select" key={league.Id} onClick={() => setLeague(league.Id)} >{league.Name}</li>
                            )
                        }
                    </ul>
                </div>
            </div>
            </>
        }
        {
        selectedLeague && <>
            <div className="page container py-4 py-sm-5 form-background-color">
                <div className="mb-2 p-5 bg-info text-white rounded">
                    <div className="text-center">
                        <h4>{`Manage - ${selectedLeague.Name}`}</h4>
                        <h6>{selectedLeague.Description}</h6>
                        <p>As the administrator of the league, you will decide what type of game you will be playing this
                            year,
                            once the game type is set. You can then pick all of the rules of the league</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <div className="row">
                        <div className="col-3"/>
                        <div className="col-3">
                            <div className="card border-info" data-tooltip-id="survivor-tip"
                                 data-tooltip-content="Survivor Series" data-tooltip-variant="info">
                                <Tooltip id="survivor-tip"/>
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
                                        <input className="form-check-input" type="radio" {...register("gameType")}
                                               value="loser"
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
                    <div className="p-3 shadow-sm rounded bg-white mx-3 mt-5">
                        <div className="text-center">
                            <h5>{gameType === 'survivor' ? 'Survivor Series Rules' : 'Loser Pot Rules'}</h5>
                        </div>
                        <div className="row">
                            <div className="col-1"></div>
                            <div className="col-5">
                                <div className="card">
                                    <div className="card-header">
                                        Elimination Rules
                                    </div>
                                    <div className="card-body">
                                        <h5>Select the Elimination rules fo the league</h5>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox"  {...register('hardCore', {disabled: !!rules})}
                                                   id="hardCore"/>
                                            <label className="form-check-label" htmlFor="HardCore">
                                                Hard Core
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('oneMulligan', {disabled: !!rules})}
                                                   id="oneMulligan"/>
                                            <label className="form-check-label" htmlFor="oneMulligan">
                                                One Mulligan
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('twoMulligan', {disabled: !!rules})}
                                                   id="twoMulligan"/>
                                            <label className="form-check-label" htmlFor="twoMulligan">
                                                Two Mulligans
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('neverOut', {disabled: !!rules})}
                                                   id="NeverOut"/>
                                            <label className="form-check-label" htmlFor="NeverOut">
                                                Never Out - requires Point system
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="card">
                                    <div className="card-header">
                                        Other Rules
                                    </div>
                                    <div className="card-body">
                                        <h5>Optional Rules</h5>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('ties', {disabled: !!rules})}
                                                   id="ties"/>
                                            <label className="form-check-label" htmlFor="ties">
                                                Ties Count as Losses
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('canSeePick', {disabled: !!rules})}
                                                   id="canSeePick"/>
                                            <label className="form-check-label" htmlFor="canSeePick">
                                                See Other's picks
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('earlyPoint', {disabled: !!rules})}
                                                   id="earlyPoint"/>
                                            <label className="form-check-label" htmlFor="earlyPoint">
                                                Early losses Count more
                                            </label>
                                        </div>
                                        {
                                            gameType === 'loser' && <div className="form-check form-check-inline">
                                                <input className="form-check-input"
                                                       type="checkbox" {...register('cantPick', {disabled: !!rules})}
                                                       id="cantPick"/>
                                                <label className="form-check-label" htmlFor="cantPick">
                                                    Can't pick the same team
                                                </label>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 shadow-sm rounded bg-body-secondary mx-3 mt-5 text-end">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-margin-right btn-standard-width"
                            aria-label="Home"
                            onClick={() => setSelectedLeague(null)}>
                            Select
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-margin-right btn-standard-width"
                            aria-label="Save Form"
                            onClick={() => setIsSubmit(false)}
                        >
                            Save
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-standard-width"
                            aria-label="Save Form"
                            onClick={() => setIsSubmit(true)}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    }
        <SimpleModal show={show}
                     handleClose={() => setShow(false)}
                     handleShow={() => setShow(true)}
                     modalTitle={modalTitle}
                     modalBody={modalBody}
                     callback={() => onSaveData(isSubmit)}
        />
    </>);
}
export default Manage;

/*<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    Launch static backdrop modal
</button>*/

