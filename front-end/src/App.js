import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HouseDetails from './pages/HouseDetails';
import Layout from './components/Layout';

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/home' 
        element={
          <Layout>
            <Home />
          </Layout>
        } 
      />
      <Route 
        path='/housedetails/:meta_code' 
        element={
          <Layout>
            <HouseDetails />
          </Layout>
        } 
      /> 
    </Routes>
  );
};

export default App;