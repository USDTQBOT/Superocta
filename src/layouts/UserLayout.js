import React from 'react';
import { Container } from 'react-bootstrap';
import UserNavbar from '../components/user/UserNavbar';
import UserSidebar from '../components/user/UserSidebar';

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <UserNavbar />
      <div className="d-flex">
        <UserSidebar />
        <Container fluid className="main-content">
          {children}
        </Container>
      </div>
    </div>
  );
};

export default UserLayout;