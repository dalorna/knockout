import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState } from 'react';

export const ShowPrivateCodeModal = ({actionsRef}) => {
    const [modal, modalRef] = useModalInstance();
    const [privateCode, setPrivateCode] = useState('');

    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setPrivateCode(details.privateCode);
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );

    const copyToClipboard = () => {
        navigator.clipboard.writeText(privateCode)
            .then(() => {modal.hide()});
    }
    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '700px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        Private Code
                    </div>
                    <div className="modal-body">
                        <div className="flex-container">
                            <div>{privateCode}</div>
                            <div className="button-3D" style={{zoom: '50%'}}>
                                <button type="button" onClick={copyToClipboard}>
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer bg-dark-subtle flex-container">
                        <div className="button-3D">
                            <button type="button"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}