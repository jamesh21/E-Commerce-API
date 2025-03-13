import Container from 'react-bootstrap/container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'


function NavBar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth()
    const handleLogout = () => {
        logout(navigate)
    }
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" className="">
                <Container>
                    <Navbar.Brand as={NavLink} to="/"><i className="bi bi-box-seam"></i></Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
                        {user && user.isAdmin && <Nav.Link as={NavLink} to="/new-product">Manage Products</Nav.Link>}
                        {user && user.isAdmin && <Nav.Link as={NavLink} to="/new-product">Manage Users</Nav.Link>}
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

                        <Nav.Link as={NavLink} to="/cart"><i className="bi bi-cart mx-3"></i></Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <br />
        </>
    )
}

export default NavBar