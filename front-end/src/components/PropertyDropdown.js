import React, { useState, useContext } from 'react';
import { RiHome5Line, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { Menu } from '@headlessui/react';
import { HouseContext } from './HouseContext';

const PropertyDropdown = () => {
  const { property, setProperty, properties } = useContext(HouseContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu as='div' className='dropdown relative'>
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
        className='dropdown-btn w-full text-left'
      >
        <RiHome5Line className='dropdown-icon-primary text-red-800' />
        <div>
          <div className='text-[15px] font-medium leading-tight'>
            {property}
          </div>
          <div className='text-[13px]'>Chọn loại nhà đất</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className='dropdown-icon-secondary text-red-800' />
        ) : (
          <RiArrowDownSLine className='dropdown-icon-secondary text-red-800' />
        )}
      </Menu.Button>

      <Menu.Items className='dropdown-menu'>
        {properties.map((property, index) => {
          return (
            <Menu.Item
              as='li'
              onClick={() => setProperty(property)}
              key={index}
              className='cursor-pointer hover:text-red-800 transition'
            >
              {property}
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

export default PropertyDropdown;