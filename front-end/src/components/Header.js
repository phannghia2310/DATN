import React from 'react';

import { Link } from 'react-router-dom';
import Logo from '../assets/img/logo.svg';

const Header = () => {
  return (
    <header className='py-6 mb-12 border-b'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link to='/'>
          <img src={Logo} alt='' />
        </Link>
        <div className='flex items-center gap-6'>
          <Link className='hover:text-red-700 duration-500 transition' to='/login'>
            Đăng nhập
          </Link>
          <Link
            className='bg-red-800 hover:bg-red-700 duration-500 text-white px-4 py-3 rounded-lg transition'
            to='/register'
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;