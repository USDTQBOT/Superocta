import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserTransfer = () => {
  const { currentUser, users, addTransaction } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    toUserId: '',
    amount: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.toUserId) {
      setError('Please select a recipient');
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amount > currentUser.balance) {
      setError('Insufficient balance');
      return;
    }
    
    if (formData.toUserId === currentUser.id) {
      setError('Cannot transfer to yourself');
      return;
    }

    // Create transaction
    const transaction = {
      fromUserId: currentUser.id,
      toUserId: formData.toUserId,
      amount: amount,
      description: formData.description || 'Funds transfer'
    };

    try {
      addTransaction(transaction);
      setSuccess(`Successfully transferred $${amount.toFixed(2)}`);
      setError('');
      setFormData({
        toUserId: '',
        amount: '',
        description: ''
      });
      
      setTimeout(() => {
        navigate('/history');
      }, 1500);
    } catch (err) {
      setError('Transfer failed: ' + err.message);
    }
  };

  const otherUsers = users.filter(user => user.id !== currentUser.id);

  return (
    <div className="transfer-page">
      <h2 className="mb-4">Make a Transfer</h2>
      
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Recipient</Form.Label>
              <Form.Select
                name="toUserId"
                value={formData.toUserId}
                onChange={handleChange}
                required
              >
                <option value="">Select a user</option>
                {otherUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  max={currentUser.balance}
                  placeholder="0.00"
                  required
                />
              </div>
              <Form.Text className="text-muted">
                Available balance: ${currentUser.balance.toFixed(2)}
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What's this transfer for?"
              />
            </Form.Group>
            
            <div className="d-grid">
              <Button variant="primary" type="submit" size="lg">
                Confirm Transfer
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserTransfer;