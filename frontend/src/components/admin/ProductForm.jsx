
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from "react";
import { useProduct } from '../../context/ProductContext'
import ConfirmModal from '../common/ConfirmModal';
import { useCart } from '../../context/CartContext'

function ProductForm({ product, closeModal }) {
    const { updateProduct } = useProduct()
    const { updateProductInCart } = useCart()
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [formData, setFormData] = useState({
        productName: product.productName,
        stock: product.stock,
        price: product.price,
        productSku: product.productSku,
        imageUrl: product.imageUrl
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

    const handleUpdateProduct = () => {
        if (isValid()) {
            // Need to check for confirmation
            setShowConfirmModal(true)
        }

    }

    const confirmUpdateProduct = async () => {
        // check if there's anything new to update first
        if (isUpdateDifferent()) {
            // only after confirming should we call update product
            await updateProduct(product.productId, {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            })
            updateProductInCart(product.productId, formData)
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
                            <FloatingLabel className={errors?.productName && "validation-error-label"} label="Product Name">
                                <Form.Control
                                    className={errors?.productName && 'validation-error-form'}
                                    type="text"
                                    placeholder="Product Name"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                >
                                </Form.Control>
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
            </Form >

        </>
    );
}


export default ProductForm