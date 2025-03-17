import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useState } from 'react'

function RoleDropdown({ user, updateRole }) {
    const [isAdmin, setIsAdmin] = useState(user.isAdmin)


    const handleRoleChange = (isRoleAdmin) => {
        setIsAdmin(isRoleAdmin)
        console.log('user from frontend ', user)
        updateRole(isRoleAdmin, user.userId)
    }

    return (
        <DropdownButton variant="secondary" title={!isAdmin ? 'User' : 'Admin'}>
            <Dropdown.Item active={!isAdmin} onClick={() => handleRoleChange(false)}>User</Dropdown.Item>
            <Dropdown.Item active={isAdmin} onClick={() => handleRoleChange(true)}>Admin</Dropdown.Item>
        </DropdownButton>
    )
}

export default RoleDropdown