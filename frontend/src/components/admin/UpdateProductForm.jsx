import { useState } from "react";
import { useProduct } from '../../context/ProductContext'
import { useError } from '../../context/ErrorContext'
import { useCart } from '../../context/CartContext'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ConfirmModal from '../common/ConfirmModal';
import { TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'

function UpdateProductForm({ product, closeModal }) {
    const { updateProduct } = useProduct()
    const { updateProductInCart } = useCart()
    const { showError } = useError()

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [formErrors, setFormErrors] = useState(null)
    const [formData, setFormData] = useState({
        productName: product.productName,
        stock: product.stock,
        price: product.price,
        productSku: product.productSku,
        imageUrl: product.imageUrl
    })


    const isFormValid = () => {
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
        if (formData.stock < 0) {
            errors.stock = 'Please enter a valid quantity'
        }
        setFormErrors(errors)
        return Object.keys(errors).length === 0;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleUpdateProduct = () => {
        if (isFormValid()) {
            // Need to check for confirmation
            setShowConfirmModal(true)
        }
    }

    const confirmUpdateProduct = async () => {
        // check if there's anything new to update first
        if (isUpdateDifferent()) {
            try {
                // only after confirming should we call update product
                await updateProduct(product.productId, {
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock)
                })
                // Update details for product in cart if applicable
                updateProductInCart(product.productId, formData)
                closeModal()
            } catch (err) {
                if (err.status === 409) {
                    showError('Product sku is already in use')
                } else if (err.code === TIMED_OUT_CASE) {
                    showError(TIMED_OUT_ERR_MSG)
                } else if (!err.response) {
                    showError(NETWORK_ERR_MSG)
                } else {
                    showError('Updating product failed, please try again')
                }
            }
        } else { // Nothing to update, close update modal
            closeModal()
        }
        setShowConfirmModal(false)
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
                            <FloatingLabel className={formErrors?.productName && "validation-error-label"} label="Product Name">
                                <Form.Control
                                    className={formErrors?.productName && 'validation-error-form'}
                                    type="text"
                                    placeholder="Product Name"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                >
                                </Form.Control>
                            </FloatingLabel>
                            {formErrors?.productName && <p className="red-text">{formErrors.productName}</p>}
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel className={formErrors?.productSku && "validation-error-label"} label="Product Sku">
                                <Form.Control
                                    className={formErrors?.productSku && 'validation-error-form'}
                                    type="text"
                                    placeholder="Product Sku"
                                    name="productSku"
                                    value={formData.productSku}
                                    onChange={handleChange}
                                />

                            </FloatingLabel>
                            {formErrors?.productSku && <p className="red-text">{formErrors.productSku}</p>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel className={formErrors?.price && "validation-error-label"} label="Price">
                                <Form.Control
                                    className={formErrors?.price && 'validation-error-form'}
                                    type="number"
                                    placeholder="Price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                            {formErrors?.price && <p className="red-text">{formErrors.price}</p>}
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
                        <Form.Group className="mb-3">
                            <FloatingLabel className={formErrors?.stock && "validation-error-label"} label="Quantity">
                                <Form.Control
                                    className={formErrors?.stock && 'validation-error-form'}
                                    type="number"
                                    placeholder="Quantity"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                            {formErrors?.stock && <p className="red-text">{formErrors.stock}</p>}
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


export default UpdateProductForm