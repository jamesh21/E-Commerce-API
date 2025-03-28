import { useAuth } from '../../context/AuthContext'
import { useError } from '../../context/ErrorContext'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../services/axios'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'

function RegisterForm() {
    const navigate = useNavigate()
    const { showError } = useError()
    const { login } = useAuth()

    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        name: ""
    })
    const [formErrors, setFormErrors] = useState(null)

    const handleChanges = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    const registerUser = async (e) => {
        e.preventDefault()
        if (!isFormValid()) {
            return
        }
        try {
            const response = await axiosInstance.post('/auth/register', registerData)
            login(response.data.user, response.data.token)
            navigate('/products')
        } catch (error) {
            if (error.status === 409) {
                setFormErrors({ email: 'Email already in use' })
            } else if (error.code === TIMED_OUT_CASE) {
                showError(TIMED_OUT_ERR_MSG)
            } else if (!error.response) {
                showError(NETWORK_ERR_MSG)
            } else {
                showError('Something went wrong, please try again')
            }
        }
    }

    const isFormValid = () => {
        let errors = {}
        if (registerData.email.length === 0) {
            errors.email = 'Please enter your email'
        } else if (!registerData.email.includes('@')) {
            errors.email = 'Please enter a valid email'
        }
        if (registerData.password.length === 0) {
            errors.password = 'Please enter your password'
        } else if (registerData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long"
        }
        if (registerData.name.length === 0) {
            errors.name = 'Please enter your name'
        }
        setFormErrors(errors)
        return Object.keys(errors).length === 0;
    }

    return (
        <>
            <Container>
                <Form className="form-width shadow-lg rounded p-5" onSubmit={registerUser}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel className={formErrors?.name && "validation-error-label"} label="Full name">
                                    <Form.Control
                                        className={formErrors?.name && 'validation-error-form'}
                                        type="text"
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleChanges}
                                        placeholder='full name'
                                    >
                                    </Form.Control>
                                </FloatingLabel>
                                {formErrors?.name && <p className="validation-error-msg ">{formErrors.name}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel className={formErrors?.email && "validation-error-label"} label="Email address">
                                    <Form.Control
                                        className={formErrors?.email && 'validation-error-form'}
                                        type="text"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleChanges}
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
                                        value={registerData.password}
                                        onChange={handleChanges}
                                        placeholder='password'
                                    >
                                    </Form.Control>

                                </FloatingLabel>
                                {formErrors?.password && <p className="validation-error-msg ">{formErrors.password}</p>}
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

export default RegisterForm