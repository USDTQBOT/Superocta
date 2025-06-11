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
      
      {/* Rest of the dashboard components... */}
    </div>
  );
};

export default UserDashboard;