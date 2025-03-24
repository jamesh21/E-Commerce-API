import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AttentionModal({ modalButtonText, modalBodyText, showModal, closeModal, titleIcon }) {
    return (
        <Modal centered show={showModal} onHide={closeModal} >
            <Modal.Header closeButton className={titleIcon}>
            </Modal.Header>
            <Modal.Body>
                <h3>{modalBodyText}</h3>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <Button onClick={closeModal} size="lg" style={{ width: '35%', margin: "0 auto" }} variant="dark">
                    {modalButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AttentionModal