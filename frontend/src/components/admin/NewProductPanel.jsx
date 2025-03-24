import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from "react";
import { useProduct } from '../../context/ProductContext'
import AttentionModal from '../common/AttentionModal';

function NewProductForm() {
    const { addProduct } = useProduct()
    const [showModal, setShowModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errors, setErrors] = useState(null)
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
        setErrors(errors)
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
                setErrors({ modal: 'Product sku is already in use' })
            } else {
                setErrors({ modal: 'Product adding failed, please try again' })
            }
            setShowErrorModal(true)
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
            <AttentionModal
                showModal={showErrorModal}
                closeModal={() => setShowErrorModal(false)}
                titleIcon="bi bi-exclamation-circle"
                modalBodyText={errors?.modal}
                modalButtonText="Got it"
            ></AttentionModal>
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
                            <FloatingLabel className={errors?.stock && "validation-error-label"} label="Quantity">
                                <Form.Control
                                    className={errors?.stock && 'validation-error-form'}
                                    type="number"
                                    placeholder="Quantity"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </FloatingLabel>
                            {errors?.stock && <p className="validation-error-msg ">{errors.stock}</p>}
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