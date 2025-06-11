import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Form, Alert, Badge, Container, Row, Col } from 'react-bootstrap';
import { ArrowLeftRight, Person, ClockHistory, Wallet, ArrowLeft } from 'react-bootstrap-icons';

const UserDashboard = ({ users, transactions, addTransaction }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [transferData, setTransferData] = useState({
    toUserId: '',
    amount: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user data and transactions
  useEffect(() => {
    const foundUser = users.find(u => u.id === id);
    if (!foundUser) {
      navigate('/');
      return;
    }
    
    setUser(foundUser);
    
    // Filter transactions involving this user
    const userTxns = transactions.filter(
      t => t.fromUserId === id || t.toUserId === id
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setUserTransactions(userTxns);
  }, [id, users, transactions, navigate]);

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferData({
      ...transferData,
      [name]: value
    });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    
    if (!transferData.toUserId || !transferData.amount) {
      setError('Recipient and amount are required');
      return;
    }

    if (transferData.toUserId === id) {
      setError('Cannot transfer to yourself');
      return;
    }

    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) {
      setError('Invalid amount');
      return;
    }

    if (amount <= 0) {
      setError('Amount must be positive');
      return;
    }

    if (user.balance < amount) {
      setError('Insufficient balance');
      return;
    }

    const newTransaction = {
      id: `txn_${Date.now()}`,
      fromUserId: id,
      toUserId: transferData.toUserId,
      amount: amount,
      date: new Date().toISOString(),
      description: transferData.description || 'Transfer',
      status: 'completed'
    };

    addTransaction(newTransaction);
    setSuccess(`Successfully transferred $${amount.toFixed(2)}`);
    setError('');
    setTransferData({
      toUserId: '',
      amount: '',
      description: ''
    });

    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)} 
        className="mb-3"
      >
        <ArrowLeft className="me-1" /> Back
      </Button>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <Person className="me-2" />
                {user.name}'s Dashboard
              </h4>
              <Badge bg={user.status === 'active' ? 'success' : 'secondary'}>
                {user.status}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-4">
                    <Wallet size={32} className="me-3 text-primary" />
                    <div>
                      <h6 className="mb-0">Available Balance</h6>
                      <h2 className="mb-0">${user.balance.toFixed(2)}</h2>
                      <small className="text-muted">Non-editable by user</small>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-4">
                    <ClockHistory size={32} className="me-3 text-primary" />
                    <div>
                      <h6 className="mb-0">Member Since</h6>
                      <h5 className="mb-0">{new Date(user.joinDate).toLocaleDateString()}</h5>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <ArrowLeftRight className="me-2" />
                Make a Transfer
              </h5>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleTransferSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Transfer To</Form.Label>
                  <Form.Select
                    name="toUserId"
                    value={transferData.toUserId}
                    onChange={handleTransferChange}
                    required
                  >
                    <option value="">Select recipient</option>
                    {users
                      .filter(u => u.id !== id)
                      .map(recipient => (
                        <option key={recipient.id} value={recipient.id}>
                          {recipient.name} ({recipient.email})
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={transferData.amount}
                    onChange={handleTransferChange}
                    min="0.01"
                    step="0.01"
                    max={user.balance}
                    placeholder="Enter amount"
                    required
                  />
                  <Form.Text className="text-muted">
                    Available: ${user.balance.toFixed(2)}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={transferData.description}
                    onChange={handleTransferChange}
                    placeholder="Purpose of transfer"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Transfer Funds
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <ClockHistory className="me-2" />
                Recent Transactions
              </h5>
            </Card.Header>
            <Card.Body>
              {userTransactions.length === 0 ? (
                <p className="text-muted">No transactions yet</p>
              ) : (
                <div className="transaction-list">
                  {userTransactions.slice(0, 5).map(txn => (
                    <div key={txn.id} className="mb-3 pb-2 border-bottom">
                      <div className="d-flex justify-content-between">
                        <strong>
                          {txn.fromUserId === id ? 'Sent to' : 'Received from'} { 
                            users.find(u => u.id === (txn.fromUserId === id ? txn.toUserId : txn.fromUserId))?.name || 'Unknown'
                          }
                        </strong>
                        <span className={txn.fromUserId === id ? 'text-danger' : 'text-success'}>
                          {txn.fromUserId === id ? '-' : '+'}${txn.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between text-muted small">
                        <span>{new Date(txn.date).toLocaleString()}</span>
                        <Badge bg={txn.status === 'completed' ? 'success' : 'warning'}>
                          {txn.status}
                        </Badge>
                      </div>
                      {txn.description && (
                        <div className="text-muted small mt-1">
                          <em>{txn.description}</em>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {userTransactions.length > 5 && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="w-100 mt-2"
                  onClick={() => navigate(`/users/${id}`)}
                >
                  View All Transactions
                </Button>
              )}
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Button variant="outline-secondary" className="w-100 mb-2">
                Request Payment
              </Button>
              <Button variant="outline-secondary" className="w-100 mb-2">
                View Statements
              </Button>
              <Button variant="outline-secondary" className="w-100">
                Contact Support
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;