
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from "react";
import { useProduct } from '../context/ProductContext'
import ConfirmModal from './ConfirmModal';
function ProductForm({ product, closeModal }) {
    const { products, updateProduct } = useProduct()
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [formData, setFormData] = useState({
        productName: product.productName,
        stock: product.stock,
        price: product.price,
        productSku: product.productSku,
        imageUrl: product.imageUrl
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleUpdateProduct = () => {
        // Need to check for confirmation
        setShowConfirmModal(true)
    }

    const confirmUpdateProduct = () => {
        // check if there's anything new to update first
        if (isUpdateDifferent()) {
            // only after confirming should we call update product
            updateProduct(product.productId, {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            })
        }
        setShowConfirmModal(false)
        closeModal()
    }

    const isUpdateDifferent = () => {
        let isDifferent = false
        for (let attr of Object.keys(formData)) {
            if (product[attr] != formData[attr]) {
                return true
            }
        }
        return isDifferent
    }
    return (
        <>
            <ConfirmModal
                modalTitle="Confirm Product Update"
                modalBody="Are you sure you want to update this product?"
                handleConfirm={confirmUpdateProduct}
                showModal={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
            >
            </ConfirmModal>
            <Form className="p-5">
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
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
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
                <Row className="mt-3 d-flex justify-content-center">
                    <Col xs="auto" >
                        <Button variant="danger" onClick={handleUpdateProduct}>Save Changes</Button>
                    </Col>

                    <Col xs="auto">
                        <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                    </Col>
                </Row>
            </Form>

        </>
    );
}


export default ProductForm