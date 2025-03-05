import { Button, Container } from 'react-bootstrap/';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
function NavBar() {
    const { user, logout } = useAuth()
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" className="">
                <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
                        <Nav.Link as={NavLink} to="/new-product">Add Product</Nav.Link>

                    </Nav>
                    <Nav>
                        {user ?

                            (<><span>Welcome {user.full_name}</span> <Button onClick={logout}>Logout</Button></>) : // Need to change variable format 
                            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>}

                        <Nav.Link as={NavLink} to="/cart">Cart</Nav.Link>

                    </Nav>
                </Container>
            </Navbar>
            <br />
        </>
    )
}

export default NavBar