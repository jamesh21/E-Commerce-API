import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ConfirmModal from '../common/ConfirmModal'
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

    const confirmRoleChange = async () => {
        setIsAdmin(possiblAdminRole)
        const isUpdated = await updateRole(possiblAdminRole, user.userId)
        console.log(isUpdated)
        if (!isUpdated) { // Failed, revert to old role
            setIsAdmin(!possiblAdminRole)
        }
        setShowModal(false)
    }

    return (
        <>
            <DropdownButton variant="secondary" title={!isAdmin ? 'User' : 'Admin'}>
                <Dropdown.Item active={!isAdmin} onClick={() => handleRoleChange(false)}>User</Dropdown.Item>
                <Dropdown.Item active={isAdmin} onClick={() => handleRoleChange(true)}>Admin</Dropdown.Item>
            </DropdownButton>

            <ConfirmModal
                modalTitle="Confirm Role Change"
                modalBody="Are you sure you want to update role?"
                handleConfirm={confirmRoleChange}
                showModal={showModal}
                onClose={() => setShowModal(false)}
            ></ConfirmModal>
        </>
    )
}

export default RoleDropdown