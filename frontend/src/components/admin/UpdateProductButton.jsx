import Button from 'react-bootstrap/Button';
import ProductForm from './ProductForm';
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'

function UpdateProductButton({ product }) {
    const [showModal, setShowModal] = useState(false);

    const closeModal = () => setShowModal(false)

    const openUpdateModal = () => {
        setShowModal(true)
    }

    return (
        <>
            <Button className="mt-auto mb-1 mx-2" variant="dark" onClick={() => { openUpdateModal() }}>
                Update Product
            </Button>

            <Modal size="lg" centered show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Product</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-2">
                    <ProductForm closeModal={closeModal} product={product}></ProductForm>
                </Modal.Body>
            </Modal>
        </>

    )
}

export default UpdateProductButton