
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useState } from 'react'
import axiosInstance from '../../services/axios'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'
import AttentionModal from '../common/AttentionModal'

function RegisterForm() {
    const navigate = useNavigate()
    const { login } = useAuth() //import login function from context
    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        name: ""
    })
    const [errors, setErrors] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const handleChanges = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    const registerUser = async (e) => {
        e.preventDefault()
        if (!isValid()) {
            return
        }
        try {
            const response = await axiosInstance.post('/auth/register', registerData)
            login(response.data.user, response.data.token)
            navigate('/products')
        } catch (error) {
            if (error.status === 409) {
                setErrors({ email: 'Email already in use' })
            } else {
                // open modal
                setErrors({ modal: 'Something went wrong, please try again' })
                setShowModal(true)
            }
        }
    }
    const isValid = () => {
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
        setErrors(errors)
        return Object.keys(errors).length === 0;
    }

    return (
        <>
            <Container>
                <AttentionModal
                    modalButtonText="Got it"
                    modalBodyText={errors?.modal}
                    showModal={showModal}
                    closeModal={() => setShowModal(false)}
                >
                </AttentionModal>
                <Form className="form-width shadow-lg rounded p-5" onSubmit={registerUser}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel className={errors?.name && "validation-error-label"} label="Full name">
                                    <Form.Control
                                        className={errors?.name && 'validation-error-form'}
                                        type="text"
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleChanges}
                                        placeholder='full name'
                                    >
                                    </Form.Control>
                                </FloatingLabel>
                                {errors?.name && <p className="validation-error-msg ">{errors.name}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel className={errors?.email && "validation-error-label"} label="Email address">
                                    <Form.Control
                                        className={errors?.email && 'validation-error-form'}
                                        type="text"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleChanges}
                                        placeholder='email address'
                                    >
                                    </Form.Control>
                                </FloatingLabel>
                                {errors?.email && <p className="validation-error-msg ">{errors.email}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <FloatingLabel className={errors?.password && "validation-error-label"} label="Password">
                                    <Form.Control
                                        className={errors?.password && 'validation-error-form'}
                                        type="password"
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleChanges}
                                        placeholder='password'
                                    >
                                    </Form.Control>

                                </FloatingLabel>

                                {errors?.password && <p className="validation-error-msg ">{errors.password}</p>}
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