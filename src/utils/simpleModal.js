import { Modal, Button } from 'react-bootstrap';

export const SimpleModal = (props) => {
    const { show, handleClose, modalTitle, modalBody, callback } = props;
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
                <Button variant="primary" onClick={callback}>Do Work</Button>
            </Modal.Footer>
        </Modal>
    );
    
}
export default SimpleModal;



