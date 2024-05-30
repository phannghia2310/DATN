import React, { useState, useEffect, useContext } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { Menu } from "@headlessui/react";
import { HouseContext } from "./HouseContext";

const MoreOptionDropdown = () => {
    const { bedroom, setBedroom } = useContext(HouseContext);
    const { direction, setDirection } = useContext(HouseContext);
    const [ isOpen, setIsOpen ] = useState(false);

    const bedroomNo = [
        {
            value: '1',
        },
        {
            value: '2',
        },
        {
            value: '3',
        },
        {
            value: '4',
        },
        {
            value: '5+',
        },
    ];

    const directions = [
        {
            value: 'Đông',
        },
        {
            value: 'Tây',
        },
        {
            value: 'Nam',
        },
        {
            value: 'Bắc',
        },
        {
            value: 'Đông - Bắc',
        },
        {
            value: 'Tây - Nam',
        },
        {
            value: 'Tây - Bắc',
        },
        {
            value: 'Đông - Nam',
        },
    ];

    return (
        <Menu as='div' className='dropdown relative'>
            <Menu.Button
             onClick={() => setIsOpen(!isOpen)}
             className='dropdown-btn w-full'
            >
                <div>
                    <div className='text-[15px] font-medium leading-tight'>
                    {bedroom && direction ? `${bedroom} phòng ngủ, hướng nhà ${direction.replace(' - ', ' ')}` : 
                        bedroom ? `${bedroom} phòng ngủ` : 
                        direction ? `Hướng nhà ${direction.replace(' - ', ' ')}` : ''}
                    </div>
                    <div className={bedroom || direction ? 'text-[13px]' : 'text-[15px]'}>Lọc thêm</div>
                </div>
                {isOpen ? (
                 <RiArrowUpSLine className='dropdown-icon-secondary text-red-800' />
                 ) : (
                 <RiArrowDownSLine className='dropdown-icon-secondary text-red-800' />
                 )
                }
            </Menu.Button>

            <Menu.Items className='dropdown-menu w-72'>
             <div>
                <strong>Số phòng ngủ</strong>
                <div className='flex'>
                   {bedroomNo.map((bedroomOption, index) => {
                       return (
                        <Menu.Item
                         as='button'
                         onClick={() => setBedroom(bedroom === bedroomOption.value ? "" : bedroomOption.value)}
                         key={index}
                         className='cursor-pointer rounded-full bg-slate-200 mx-[5px] px-[15px] py-[3px] hover:text-red-800 hover:bg-slate-300 transition'
                        >
                            {bedroomOption.value}
                        </Menu.Item>
                       );
                   })}
                </div>
             </div>
             <div>
                <strong>Hướng nhà</strong>
                <div className='flex flex-wrap'>
                   {directions.map((directionOption, index) => {
                       return (
                        <Menu.Item
                         as='button'
                         onClick={() => setDirection(direction === directionOption.value ? '' : directionOption.value)}
                         key={index}
                         className='cursor-pointer rounded-full bg-slate-200 px-[10px] py-[5px] m-[5px] hover:text-red-800 hover:bg-slate-300 transition'
                        >
                            {directionOption.value}
                        </Menu.Item>
                       );
                   })}
                </div>
             </div>
            </Menu.Items>
        </Menu>
    );
};

export default MoreOptionDropdown;