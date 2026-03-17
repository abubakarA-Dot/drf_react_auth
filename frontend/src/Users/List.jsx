import {
  Table, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from 'reactstrap';
import Page from "../Page";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa"
import { useQuery } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { useModal } from "../useModal";
import { useState } from 'react';

const UsersList = () => {
    const [userId, setUserId] = useState(null);
    const { isOpen, close, toggle } = useModal();
    const {data: users, loading, refetch} = useQuery({
        queryKey: ["users"],
        queryFn: () => apiClient.get("/users/").then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });

    const handleDelete = async () => {
        await apiClient.delete(`/users/${userId}/`);
        close();
        refetch();
        alert("User deleted successfully");
    }
    
    return (
        <>
        <Page title="Users">
            <div className="container mt-2 border rounded p-4 shadow-sm">
                <Table>
                <tbody>
                    {users?.map((user, idx) => (
                        <tr key={idx}>
                            <td>{user?.name}</td>
                            <td>{user?.email}</td>
                            <td>
                                <span>
                                        <Link to={`/edit_user/${user.id}`}>
                                            <FaEdit className='text-info mx-2' />
                                        </Link>
                                    <i className='fa fa-danger' onClick={() => {toggle(), setUserId(user?.id)}}><FaTrash className='text-danger' /></i>
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        </Page>
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Delete User</ModalHeader>
            <ModalBody>
                Are you sure you want to delete this user?
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={close}>Cancel</Button>
                <Button color="primary" onClick={handleDelete}>Confirm</Button>
            </ModalFooter>
        </Modal>
        </>
    );
}

export default UsersList;
