import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConfirmModal({ modalTitle, modalBody, handleConfirm, showModal, onClose }) {

    return (
        <Modal centered show={showModal} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle ? modalTitle : "Confirm"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalBody ? modalBody : "Are you sure you want to continue?"} </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleConfirm}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>)
}

export default ConfirmModal