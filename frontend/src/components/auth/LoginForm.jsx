import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'
import { useError } from '../../context/ErrorContext'
import axiosInstance from '../../services/axios'
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'

function LoginForm() {
    const navigate = useNavigate()
    const { login } = useAuth() //import login function from context
    const { showError } = useError()

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const [formErrors, setFormErrors] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!isFormValid()) {
            return
        }
        try {
            const response = await axiosInstance.post("/auth/login", loginData)
            // login using auth context
            login(response.data.user, response.data.token)
            // reroute to products
            navigate('/products')

        } catch (err) {
            if (err.status === 401) {
                showError('The password you entered is incorrect. Please try again')
            } else if (err.status === 404) {
                showError('The email you entered does not exist')
            } else if (err.code === TIMED_OUT_CASE) {
                showError(TIMED_OUT_ERR_MSG)
            } else if (!err.response) {
                showError(NETWORK_ERR_MSG)
            }
            else {
                showError('Something went wrong, please try again')
            }
        }
    }

    const isFormValid = () => {
        let errors = {}
        if (loginData.email.length === 0) {
            errors.email = 'Please enter your email'
        } else if (!loginData.email.includes('@')) {
            errors.email = 'Please enter a valid email'
        }
        if (loginData.password.length === 0) {
            errors.password = 'Please enter your password'
        }
        setFormErrors(errors)

        return Object.keys(errors).length === 0;
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

    return (
        <>
            <Container>
                <Form className="form-width shadow-lg rounded p-5" onSubmit={handleLogin}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel className={formErrors?.email && "validation-error-label"} label="Email address">
                                    <Form.Control
                                        className={formErrors?.email && 'validation-error-form'}
                                        type="text"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleChange}
                                        placeholder='email address'
                                    >
                                    </Form.Control>
                                </FloatingLabel>
                                {formErrors?.email && <p className="validation-error-msg ">{formErrors.email}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel className={formErrors?.password && "validation-error-label"} label="Password">
                                    <Form.Control
                                        className={formErrors?.password && 'validation-error-form'}
                                        type="password"
                                        name="password"
                                        value={loginData.password}
                                        placeholder='password'
                                        onChange={handleChange}
                                    >
                                    </Form.Control>
                                </FloatingLabel>
                                {formErrors?.password && <p className="validation-error-msg ">{formErrors.password}</p>}
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
            </Container >

        </>);
}

export default LoginForm