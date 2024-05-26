import React, { useState, useContext } from 'react';
import { RiMapPinLine, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { Menu } from '@headlessui/react';
import { HouseContext } from './HouseContext';

const DistrictDropdown = () => {
  const { district, setDistrict, districts } = useContext(HouseContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu as='div' className='dropdown relative'>
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
        className='dropdown-btn w-full text-left'
      >
        <RiMapPinLine className='dropdown-icon-primary text-red-800' />
        <div>
          <div className='text-[15px] font-medium leading-tight'>{district}</div>
          <div className='text-[13px]'>Chọn địa điểm</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className='dropdown-icon-secondary text-red-800' />
        ) : (
          <RiArrowDownSLine className='dropdown-icon-secondary text-red-800' />
        )}
      </Menu.Button>

      <Menu.Items className='dropdown-menu overflow-auto h-[200px] z-20'>
        {districts.map((district, index) => {
          return (
            <Menu.Item
              as='li'
              onClick={() => setDistrict(district)}
              key={index}
              className='cursor-pointer hover:text-red-800 transition'
            >
              {district}
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

export default DistrictDropdown;