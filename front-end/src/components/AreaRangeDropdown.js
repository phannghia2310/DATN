import React, { useState, useEffect, useContext } from 'react';
import { Icon } from '@iconify/react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { Menu } from '@headlessui/react';
import { HouseContext }  from './HouseContext';

const AreaRangeDropdown = () => {
    const { area, setArea } = useContext(HouseContext);
    const [ isOpen, setIsOpen ] = useState(false);
    
    const areas = [
        {
            value: 'Tất cả diện tích',
        },
        {
            value: 'Dưới 50m²',
        },
        {
            value: '50 - 100m²',
        },
        {
            value: '100 - 300m²',
        },
        {
            value: '300 - 500m²',
        },
        {
            value: '500 - 700m²',
        },
        {
            value: '700 - 1000m²',
        },
        {
            value: 'Trên 1000m²',
        },
    ];

    return (
        <Menu as='div' className='dropdown relative'>
            <Menu.Button 
             onClick={() => setIsOpen(!isOpen)}
             className='dropdown-btn w-full'
            >
             <Icon icon="pixelarticons:drop-area"  className='dropdown-icon-primary text-red-800'/>
             <div>
                <div className='text-[15px] font-medium leading-tight'>{area}</div>
                <div className='text-[13px]'>Chọn diện tích</div>
             </div>
             {isOpen ? (
             <RiArrowUpSLine className='dropdown-icon-secondary text-red-800' />
             ) : (
             <RiArrowDownSLine className='dropdown-icon-secondary text-red-800' />
             )}
            </Menu.Button>

            <Menu.Items 
             className='dropdown-menu overflow-auto h-[200px]'
            >
                {areas.map((area, index) => {
                    return (
                        <Menu.Item 
                         as='li' 
                         onClick={() => setArea(area.value)}
                         key={index}
                         className='cursor-pointer hover:text-red-800 transition'
                        >
                            {area.value}
                        </Menu.Item>
                    );
                })}
            </Menu.Items>
        </Menu>
    );
};

export default AreaRangeDropdown;