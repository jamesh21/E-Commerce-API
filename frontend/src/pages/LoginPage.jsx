
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axiosInstance from '../services/axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'
// import formatApiFields from '../utils/db-mapping'

function LoginPage() {
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const { login } = useAuth() //import login function from context

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post("/auth/login", loginData)
            // login using auth context


            login(response.data.user, response.data.token)
            // reroute to products
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

    const handleNewUser = () => {
        navigate('/register')
    }
    return (<>
        <Container >
            <Form className="form-width shadow-lg rounded p-5" onSubmit={handleLogin}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Email address">
                                <Form.Control
                                    type="text"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleChange}
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
                                    value={loginData.password}
                                    placeholder='password'
                                    onChange={handleChange}
                                    required
                                >
                                </Form.Control>
                            </FloatingLabel>

                        </Form.Group>
                    </Col>
                </Row>
                <div className="text-center" >
                    <Row className="my-2">
                        <Col>
                            <Button className="large-width-button" size="md" variant="primary" type="submit">Login</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button className="large-width-button" size="md" onClick={handleNewUser}>New User</Button>
                        </Col>
                    </Row>
                </div>

            </Form>
        </Container>

    </>);
}

export default LoginPage;