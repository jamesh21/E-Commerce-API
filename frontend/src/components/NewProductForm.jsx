import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { FloatingLabel } from 'react-bootstrap';

function NewProductForm() {
    const apiUrl = process.env.REACT_APP_API_URL

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

        try {
            const response = await fetch(`${apiUrl}/product"`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                console.log(response)
                throw new Error("Failed to create product");
            }

            const newProduct = await response.json();
            console.log("Product Created:", newProduct);

            clearFields()


        } catch (error) {
            console.error("Error:", error);
        }
    };

    const clearFields = () => {
        // Reset form after submission
        setFormData({ productName: "", price: 0.00, imageUrl: "", productSku: "", quantity: 0 });
    }


    return (
        <>
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
                        <Button variant="primary" type="submit">Add Product</Button>
                    </Col>

                    <Col xs="auto">
                        <Button variant="secondary" onClick={clearFields}>Clear Fields</Button>
                    </Col>
                </Row>
            </Form>
        </>);
}


export default NewProductForm;