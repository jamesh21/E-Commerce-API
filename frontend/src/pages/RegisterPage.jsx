import { Button, Row, Col, Form, Container, FloatingLabel } from 'react-bootstrap'
import { useState } from 'react'
import axiosInstance from '../services/axios'
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate()
    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        name: ""
    })
    const handleChanges = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    const registerUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post('/auth/register', registerData)
            const responseData = await response.data
            localStorage.setItem("token", responseData.token)
            navigate('/products')
        } catch (error) {
            console.error('Error: ', error)
        }

    }
    return (
        <>
            <Container>
                <Form className="form-width shadow-lg rounded p-5" onSubmit={registerUser}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Full name">
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleChanges}
                                        placeholder='full name'
                                        required
                                    >
                                    </Form.Control>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Email address">
                                    <Form.Control
                                        type="text"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleChanges}
                                        placeholder='email address'
                                        required
                                    >
                                    </Form.Control>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Password">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleChanges}
                                        required
                                        placeholder='password'
                                    >
                                    </Form.Control>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="my-2 text-center">
                        <Col>
                            <Button className="large-width-button" size='md' variant="primary" type="submit">Register</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    )
}

export default RegisterPage;