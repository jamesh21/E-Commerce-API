import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from "react";
import { useProduct } from '../context/ProductContext'
function NewProductForm() {
    const { addProduct } = useProduct()
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        productName: "",
        quantity: 0,
        price: 0.00,
        productSku: "",
        imageUrl: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            quantity: Number(formData.quantity)
        }
        await addProduct(productData)
        // confirm modal should activate here
        setShowModal(true)
        clearFields()
    };
    const closeModal = () => setShowModal(false)
    const clearFields = () => {
        // Reset form after submission
        setFormData({ productName: "", price: 0.00, imageUrl: "", productSku: "", quantity: 0 });
    }


    return (
        <>
            <Modal centered show={showModal} onHide={closeModal} >
                <Modal.Body>
                    <h3>New Product Added</h3>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button onClick={closeModal} size="lg" style={{ width: '35%', margin: "0 auto" }} variant="dark">
                        Got it
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form className="shadow-lg rounded p-5" onSubmit={handleSubmit} style={{ width: '65%', margin: "0 auto" }}>
                <Row>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Product Name">
                                <Form.Control
                                    type="text"
                                    placeholder="Product Name"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    required
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Product Sku">
                                <Form.Control
                                    type="text"
                                    placeholder="Product Sku"
                                    name="productSku"
                                    value={formData.productSku}
                                    onChange={handleChange}
                                    required
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Price">
                                <Form.Control
                                    type="number"
                                    placeholder="Price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Quantity">
                                <Form.Control
                                    type="number"
                                    placeholder="Quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Image URL">
                                <Form.Control
                                    type="text"
                                    placeholder="Image URL"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Col xs="auto" >
                        <Button variant="dark" type="submit">Add Product</Button>
                    </Col>

                    <Col xs="auto">
                        <Button variant="secondary" onClick={clearFields}>Clear Fields</Button>
                    </Col>
                </Row>
            </Form>
        </>);
}


export default NewProductForm;