import React, { useState, useEffect, useContext } from 'react';
import {
  RiWallet3Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from 'react-icons/ri';
import { Menu } from '@headlessui/react';
import { HouseContext } from './HouseContext';

const PriceRangeDropdown = () => {
  const { price, setPrice } = useContext(HouseContext);
  const [isOpen, setIsOpen] = useState(false);

  const prices = [
    {
      value: 'Tất cả mức giá',
    },
    {
      value: 'Dưới 500 triệu',
    },
    {
      value: '500 - 800 triệu',
    },
    {
      value: '800 triệu - 1 tỷ',
    },
    {
      value: '1 - 3 tỷ',
    },
    {
      value: '3 - 5 tỷ',
    },
    {
      value: '5 - 7 tỷ',
    },
    {
      value: '7 - 10 tỷ',
    }, 
    {
      value: '10 - 20 tỷ',
    },
    {
      value: '20 - 40 tỷ',
    }, 
    {
      value: '40 -60 tỷ',
    },
    {
      value: 'Trên 60 tỷ',
    }
  ];

  return (
    <Menu as='div' className='dropdown relative'>
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
        className='dropdown-btn w-full'
      >
        <RiWallet3Line className='dropdown-icon-primary text-red-800' />
        <div>
          <div className='text-[15px] font-medium leading-tight'>{price}</div>
          <div className='text-[13px]'>Chọn mức giá</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className='dropdown-icon-secondary text-red-800' />
        ) : (
          <RiArrowDownSLine className='dropdown-icon-secondary text-red-800' />
        )}
      </Menu.Button>

      <Menu.Items className='dropdown-menu overflow-auto h-[200px]'>
        {prices.map((price, index) => {
          return (
            <Menu.Item
              as='li'
              onClick={() => setPrice(price.value)}
              key={index}
              className='cursor-pointer hover:text-red-800 transition'
            >
              {price.value}
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

export default PriceRangeDropdown;