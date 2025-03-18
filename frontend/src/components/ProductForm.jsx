
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from "react";
import { useProduct } from '../context/ProductContext'

function ProductForm({ product, closeModal }) {
    const { products, updateProduct } = useProduct()

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
        updateProduct(product.productId, {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
        })
    }
    return (
        <>
            <Form className="p-5" onSubmit={handleUpdateProduct}>
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
                        <Button variant="danger" type="submit">Save Changes</Button>
                    </Col>

                    <Col xs="auto">
                        <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                    </Col>
                </Row>
            </Form>
        </>);
}


export default ProductForm