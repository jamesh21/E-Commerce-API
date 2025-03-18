import Table from 'react-bootstrap/Table';
import RoleDropdown from './RoleDropdown';
import { useState, useEffect } from "react";
import axiosInstance from '../services/axios'

function ManageUserPanel() {
    const [users, setUsers] = useState([])

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
            const response = await axiosInstance.put('/user/role', { isAdmin: isNewRoleAdmin, userId })
            // Need to update users state?
        } catch (err) {
            console.error('Error: ', err)
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