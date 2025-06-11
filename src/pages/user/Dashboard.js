import React, { useContext } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Wallet, ClockHistory, ArrowLeftRight, Person } from 'react-bootstrap-icons';
import { AuthContext } from '../../context/AuthContext';

const UserDashboard = () => {
  const { currentUser, transactions } = useContext(AuthContext);
  
  const recentTransactions = transactions
    .filter(t => t.fromUserId === currentUser.id || t.toUserId === currentUser.id)
    .slice(0, 3);

  return (
    <div className="user-dashboard">
      <h2 className="mb-4">Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card balance-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <Wallet size={32} className="me-3" />
                <div>
                  <h6 className="mb-0">Available Balance</h6>
                  <h2 className="mb-0">${currentUser.balance.toFixed(2)}</h2>
                  <small className="text-muted">Last updated: Just now</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <ClockHistory size={32} className="me-3" />
                <div>
                  <h6 className="mb-0">Account Age</h6>
                  <h4 className="mb-0">
                    {Math.floor((new Date() - new Date(currentUser.joinDate)) / (1000 * 60 * 60 * 24))} days
                  </h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <ArrowLeftRight size={32} className="me-3" />
                <div>
                  <h6 className="mb-0">Total Transactions</h6>
                  <h4 className="mb-0">
                    {recentTransactions.length}
                  </h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <Card className="action-card transfer">
                    <Card.Body className="text-center">
                      <ArrowLeftRight size={24} className="mb-2" />
                      <h6>Make Transfer</h6>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-3">
                  <Card className="action-card request">
                    <Card.Body className="text-center">
                      <Person size={24} className="mb-2" />
                      <h6>Request Money</h6>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-3">
                  <Card className="action-card history">
                    <Card.Body className="text-center">
                      <ClockHistory size={24} className="mb-2" />
                      <h6>View History</h6>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              {recentTransactions.length === 0 ? (
                <p className="text-muted">No recent transactions</p>
              ) : (
                <div className="activity-list">
                  {recentTransactions.map(txn => (
                    <div key={txn.id} className="activity-item">
                      <div className="d-flex justify-content-between">
                        <span className="activity-description">
                          {txn.fromUserId === currentUser.id ? 'Sent to' : 'Received from'} User
                        </span>
                        <span className={`amount ${txn.fromUserId === currentUser.id ? 'text-danger' : 'text-success'}`}>
                          {txn.fromUserId === currentUser.id ? '-' : '+'}${txn.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between text-muted small">
                        <span>{new Date(txn.date).toLocaleDateString()}</span>
                        <Badge bg="success">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;