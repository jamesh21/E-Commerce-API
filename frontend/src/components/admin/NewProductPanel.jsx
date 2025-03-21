import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from "react";
import { useProduct } from '../../context/ProductContext'

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
    const [errors, setErrors] = useState(null)

    const isValid = () => {
        let errors = {}
        if (formData.productName.length === 0) {
            errors.productName = 'Please enter a product name'
        }
        if (formData.productSku.length === 0) {
            errors.productSku = 'Please enter a product sku'
        }
        if (formData.price <= 0) {
            errors.price = 'Please enter a valid price'
        }
        setErrors(errors)
        return Object.keys(errors).length === 0;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid()) {
            return
        }
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
                            <FloatingLabel className={errors?.productName && "validation-error-label"} label="Product Name">
                                <Form.Control
                                    className={errors?.productName && 'validation-error-form'}
                                    type="text"
                                    placeholder="Product Name"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}

                                />
                            </FloatingLabel>
                            {errors?.productName && <p className="validation-error-msg ">{errors.productName}</p>}
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel className={errors?.productSku && "validation-error-label"} label="Product Sku">
                                <Form.Control
                                    className={errors?.productSku && 'validation-error-form'}
                                    type="text"
                                    placeholder="Product Sku"
                                    name="productSku"
                                    value={formData.productSku}
                                    onChange={handleChange}

                                />
                            </FloatingLabel>
                            {errors?.productSku && <p className="validation-error-msg ">{errors.productSku}</p>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel className={errors?.price && "validation-error-label"} label="Price">
                                <Form.Control
                                    className={errors?.price && 'validation-error-form'}
                                    type="number"
                                    placeholder="Price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}

                                />
                            </FloatingLabel>
                            {errors?.price && <p className="validation-error-msg ">{errors.price}</p>}
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