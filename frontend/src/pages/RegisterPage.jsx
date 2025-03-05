import { Button, Row, Col, Form, Container } from 'react-bootstrap'
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
                <Form onSubmit={registerUser}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={registerData.name}
                                    onChange={handleChanges}
                                    required
                                >
                                </Form.Control>

                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleChanges}
                                    required
                                >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={registerData.password}
                                    onChange={handleChanges}
                                    required
                                >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary" type="submit">Register</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    )
}

export default RegisterPage;