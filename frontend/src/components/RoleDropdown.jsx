import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react'

function RoleDropdown({ user, updateRole }) {
    const [isAdmin, setIsAdmin] = useState(user.isAdmin)
    const [showModal, setShowModal] = useState(false);
    const [possiblAdminRole, setPossiblAdminRole] = useState(null)

    const handleRoleChange = (isRoleAdmin) => {
        if (isRoleAdmin !== isAdmin) {
            setPossiblAdminRole(isRoleAdmin)
            setShowModal(true)
        }
    }

    const confirmRoleChange = () => {
        updateRole(possiblAdminRole, user.userId)
        setIsAdmin(possiblAdminRole)
        setShowModal(false)
    }

    return (
        <>
            <DropdownButton variant="secondary" title={!isAdmin ? 'User' : 'Admin'}>
                <Dropdown.Item active={!isAdmin} onClick={() => handleRoleChange(false)}>User</Dropdown.Item>
                <Dropdown.Item active={isAdmin} onClick={() => handleRoleChange(true)}>Admin</Dropdown.Item>
            </DropdownButton>


            <Modal centered show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Role Change</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to update role? </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={confirmRoleChange}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RoleDropdown