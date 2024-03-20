import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';
import {saveRule, updateRule} from '../../api/rules';
import {saveRulesBody, submitRulesBody} from '../../utils/constants';

export const SaveRulesModal = ({actionsRef, isSubmit}) => {
    const [modal, modalRef] = useModalInstance();
    const [rules, setRules] = useState(null);
    const [currentRulesId, setCurrentRulesId] = useState(null);

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setRules(details.rules);
                setCurrentRulesId(details.currentRulesId)
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );

    const onSave = async () => {
        console.log('rules', rules);
        await saveCurrentRules(rules, currentRulesId);
        toast.success('League Successfully Saved')
        modal.hide();
    }
    
    const saveCurrentRules = async (rules, currentRulesId) => {
        if (currentRulesId) {
            await updateRule(rules);
        } else {
            await saveRule(rules);
        }
    }
    
    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        {
                            isSubmit ? 'Submit Rules' : 'Save Rules'
                        }
                    </div>
                    <div className="modal-body">
                        {
                            isSubmit ? submitRulesBody : saveRulesBody
                        }
                    </div>
                    <div className="modal-footer bg-dark-subtle">
                        <button type="button" className="btn btn-outline-secondary btn-standard-width"
                                data-bs-dismiss="modal"
                                aria-label="Close">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-secondary btn-margin-right btn-standard-width"
                                onClick={onSave}>Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}