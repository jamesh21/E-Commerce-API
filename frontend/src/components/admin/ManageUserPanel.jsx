import { useState, useEffect } from "react";
import { useError } from '../../context/ErrorContext';
import axiosInstance from '../../services/axios'
import Table from 'react-bootstrap/Table';
import RoleDropdown from './RoleDropdown';
import { TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'

function ManageUserPanel() {
    const [users, setUsers] = useState([])
    const { showError } = useError()

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axiosInstance.get('/user/all')
                setUsers(response.data.data)
            } catch (err) {
                console.error('Error: ', err)
            }
        }
        getUsers()
    }, [])

    const updateRole = async (isNewRoleAdmin, userId) => {
        try {
            await axiosInstance.put('/user/role', { isAdmin: isNewRoleAdmin, userId })
            return true
        } catch (err) {
            if (err.code === TIMED_OUT_CASE) {
                showError(TIMED_OUT_ERR_MSG)
            } else if (!err.response) {
                showError(NETWORK_ERR_MSG)
            } else {
                showError('Failed updating user, please try again')
            }
            return false
        }
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.email}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                            <RoleDropdown user={user} updateRole={updateRole}></RoleDropdown>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default ManageUserPanel