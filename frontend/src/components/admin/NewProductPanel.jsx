import { useState } from "react";
import { useProduct } from '../../context/ProductContext'
import { useError } from '../../context/ErrorContext'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import AttentionModal from '../common/AttentionModal';
import { TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'

function NewProductForm() {
    const { addProduct } = useProduct()
    const { showError } = useError()
    const [showModal, setShowModal] = useState(false)
    const [formErrors, setFormErrors] = useState(null)
    const [formData, setFormData] = useState({
        productName: "",
        stock: 0,
        price: 0.00,
        productSku: "",
        imageUrl: ""
    })

    /**
     * This function checks if any formData fields are invalid.
     * @returns true if no errors were found in formData, else false
     */
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
        if (formData.stock < 0) {
            errors.stock = 'Please enter a valid quantity'
        }
        setFormErrors(errors)
        return Object.keys(errors).length === 0;
    }

    /**
     * This fires everytime a form field is changed and will update corresponding field in formData object.
     * @param {*} e 
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    /**
     * This function is called to handle adding a new product to our backend.
     * @param {*} e 
     * @returns 
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Checks if field format\ is valid before proceeding.
        if (!isValid()) {
            return
        }
        const productData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
        }
        try {
            await addProduct(productData)
            setShowModal(true)
            clearFields()

        } catch (err) {
            if (err.status === 409) {
                showError('Product sku is already in use')
            } else if (err.code === TIMED_OUT_CASE) {
                showError(TIMED_OUT_ERR_MSG)
            } else if (!err.response) {
                showError(NETWORK_ERR_MSG)
            } else {
                showError('Failed to add new product, please try again')
            }
        }
    };

    const clearFields = () => {
        // Reset form after submission
        setFormData({ productName: "", price: 0.00, imageUrl: "", productSku: "", stock: 0 });
    }

    return (
        <>
            <AttentionModal
                showModal={showModal}
                closeModal={() => setShowModal(false)}
                titleIcon="bi bi-check-circle"
                modalBodyText="New Product Added"
                modalButtonText="Got it"
            >
            </AttentionModal>

            <Form className="shadow-lg rounded p-5" onSubmit={handleSubmit} style={{ width: '65%', margin: "0 auto" }}>
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

                                />
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
                                    required
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