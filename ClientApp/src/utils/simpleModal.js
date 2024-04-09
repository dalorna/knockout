import { Modal, Button } from 'react-bootstrap';
import {  useEffect, useState, useRef,  } from 'react';
import { Modal as BootstrapModal } from 'bootstrap';

export const SimpleModal = ({props, show}) => {
    const { handleClose, modalTitle, modalBody, callback, buttonTitle } = props;
    return (
        <Modal show={show} onHide={handleClose} centered data-bs-theme="superhero">
            <Modal.Header closeButton={handleClose}>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{modalBody}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                { callback && buttonTitle && <Button variant="primary" onClick={callback}>{buttonTitle}</Button>}
            </Modal.Footer>
        </Modal>
    );
    
}
export default SimpleModal;

export const useModalInstance = (options) => {
    const optionsRef = useRef(options);
    const [modal, setModal] = useState();
    const modalRef = useRef();

    useEffect(() => setModal(new BootstrapModal(modalRef.current, optionsRef.current)), []);

    return [modal, modalRef];
};