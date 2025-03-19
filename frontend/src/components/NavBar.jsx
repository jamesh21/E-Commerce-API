import Container from 'react-bootstrap/container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function NavBar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth()
    const { cartItems } = useCart()

    const handleLogout = () => {
        logout(navigate)
    }

    const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" className="">
                <Container>
                    <Navbar.Brand as={NavLink} to="/"><i className="bi bi-box-seam"></i></Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
                        {user && user.isAdmin && <Nav.Link as={NavLink} to="/manage">Manage</Nav.Link>}
                    </Nav>
                    <Nav>
                        {user ?
                            (
                                <>
                                    <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
                                        Logout
                                    </Nav.Link>
                                </>
                            ) : // Need to change variable format 
                            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>}

                        <Nav.Link as={NavLink} className="position-relative" to="/cart">
                            <i className="bi bi-cart mx-3"><Badge pill bg="danger" className="cart-badge">{totalCartQuantity > 0 && totalCartQuantity}</Badge></i>

                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <br />
        </>
    )
}

export default NavBar