import React, { useContext } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { Pencil, Trash, PersonPlus } from 'react-bootstrap-icons';

const AdminUsers = () => {
  const { users, updateUser } = useContext(AuthContext);
  
  const handleStatusChange = (userId, newStatus) => {
    updateUser(userId, { status: newStatus });
  };

  const handleBalanceUpdate = (userId, newBalance) => {
    if (!isNaN(newBalance)) {
      updateUser(userId, { balance: parseFloat(newBalance) });
    }
  };

  return (
    <div className="admin-users">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <Button variant="primary">
          <PersonPlus className="me-2" /> Add User
        </Button>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id.substring(0, 8)}...</td>
              <td>
                <div className="d-flex align-items-center">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="user-avatar me-2" 
                    width="32"
                  />
                  {user.name}
                </div>
              </td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                  {user.role}
                </Badge>
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={user.balance}
                  onChange={(e) => handleBalanceUpdate(user.id, e.target.value)}
                  style={{ width: '100px' }}
                />
              </td>
              <td>
                <Form.Select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  style={{ width: '120px' }}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </Form.Select>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2">
                  <Pencil />
                </Button>
                <Button variant="outline-danger" size="sm">
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsers;