import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with sample data
    const adminUser = {
      id: uuidv4(),
      name: 'Poco Admin',
      email: 'admin@poco.com',
      password: 'admin123',
      role: 'admin',
      balance: 10000,
      joinDate: new Date().toISOString(),
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=1'
    };

    const sampleUser = {
      id: uuidv4(),
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      balance: 1500,
      joinDate: new Date().toISOString(),
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=2'
    };

    const sampleTxns = [{
      id: uuidv4(),
      fromUserId: adminUser.id,
      toUserId: sampleUser.id,
      amount: 500,
      date: new Date().toISOString(),
      description: 'Initial transfer',
      status: 'completed'
    }];

    setUsers([adminUser, sampleUser]);
    setTransactions(sampleTxns);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (userData) => {
    const newUser = {
      id: uuidv4(),
      ...userData,
      role: 'user',
      balance: 0,
      joinDate: new Date().toISOString(),
      status: 'active',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const addTransaction = (txnData) => {
    const newTxn = {
      id: uuidv4(),
      ...txnData,
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    // Update balances
    setUsers(users.map(user => {
      if (user.id === txnData.fromUserId) {
        return { ...user, balance: user.balance - txnData.amount };
      }
      if (user.id === txnData.toUserId) {
        return { ...user, balance: user.balance + txnData.amount };
      }
      return user;
    }));
    
    setTransactions([newTxn, ...transactions]);
    return newTxn;
  };

  const updateUser = (userId, updates) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      transactions,
      loading,
      login,
      logout,
      register,
      addTransaction,
      updateUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};