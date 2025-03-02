
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import axiosInstance from '../services/axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const login = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post("/auth/login", loginData)

            const responseData = await response.data
            localStorage.setItem("token", responseData.token)
            console.log(responseData)
            navigate('/products')

        } catch (err) {
            console.error("Error:", err)
        }
    }

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }
    return (<>
        <Container>
            <Form onSubmit={login}>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                value={loginData.email}
                                onChange={handleChange}
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
                                value={loginData.password}
                                onChange={handleChange}
                                required
                            >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit">Login</Button>
                    </Col>
                </Row>
            </Form>
        </Container>

    </>);
}

export default LoginPage;