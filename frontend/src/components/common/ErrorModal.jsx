import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useError } from '../../context/ErrorContext';

function ErrorModal() {
    const { error, clearError } = useError();
    return (
        <Modal centered show={error} onHide={clearError} >
            <Modal.Header closeButton >
                <Modal.Title className="bi bi-exclamation-circle"></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>{error}</h3>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <Button onClick={clearError} size="lg" style={{ width: '35%', margin: "0 auto" }} variant="dark">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ErrorModal