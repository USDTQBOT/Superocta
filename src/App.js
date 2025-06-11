import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthRoute } from './components/AuthRoute';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTransactions from './pages/admin/Transactions';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserTransfer from './pages/user/Transfer';
import UserHistory from './pages/user/History';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AuthRoute roles={['admin']}>
              <AdminLayout />
            </AuthRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>
          
          {/* User Routes */}
          <Route path="/" element={
            <AuthRoute>
              <UserLayout />
            </AuthRoute>
          }>
            <Route index element={<UserDashboard />} />
            <Route path="transfer" element={<UserTransfer />} />
            <Route path="history" element={<UserHistory />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;