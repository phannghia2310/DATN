import React, { useContext, useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { Menu } from "@headlessui/react";
import { UserContext } from "./UserContext";
import DefaultLogo from '../assets/img/user/default.png';
import { useNavigate } from "react-router-dom";

const UserDropdown = () => {
    const { user, setUser } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const getUserImage = (image) => {
        try {
            return require(`../assets/img/user/${image}`);
        } catch (err) {
            console.log(err);
            return DefaultLogo;
        }
    };

    return (
        <>
            <Menu as='div' className='dropdown relative'>
                <Menu.Button
                 onClick={() => setIsOpen(!isOpen)}
                 className='flex w-full] items-center'
                >
                    <>
                        <img src={user.image ? getUserImage(user.image) : DefaultLogo} alt='userImage' className='w-[40px] h-[40px] mx-[5px] rounded-full' style={{objectFit: "cover"}}/>
                        <span className='text-[17px] mx-[10px]'>{user.name}</span>
                    </>
                    {isOpen ? (
                     <RiArrowUpSLine className='dropdown-icon-secondary text-red-800' />
                     ) : (
                     <RiArrowDownSLine className='dropdown-icon-secondary text-red-800' />
                     )
                    }
                </Menu.Button>

                <Menu.Items className='dropdown-menu w-[200px]'>
                    <>
                        <Menu.Item
                         as='li'
                         onClick={() => navigate(`/user-profile/${user.id}`)}
                         className='cursor-pointer hover:text-red-800 transition'
                        >
                            Thông tin cá nhân
                        </Menu.Item>

                        <Menu.Item
                         as='li'
                         onClick={handleLogout}
                         className='cursor-pointer hover:text-red-800 transition'
                        >
                            Đăng xuất
                        </Menu.Item>
                    </>
                </Menu.Items>            
            </Menu>
        </>
    );
};

export default UserDropdown;