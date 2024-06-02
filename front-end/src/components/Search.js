import React, { useContext, useState } from 'react';

import SearchBox from './SearchBox';
import DistrictDropdown from './DistrictDropdown';
import PropertyDropdown from './PropertyDropdown';
import PriceRangeDropdown from './PriceRangeDropdown';
import AreaRangeDropdown from './AreaRangeDropdown';
import MoreOptionDropdown from './MoreOptionDropdown';
import DeepSearchPopup from './DeepSearchPopup';

import { HouseContext } from './HouseContext';

import { RiRestartLine, RiSearch2Line } from 'react-icons/ri';

const Search = () => {
  const { handleClick, resetSearch } = useContext(HouseContext);

  return (
    <div className='px-[30px] py-1 max-w-[1170px] mx-auto flex flex-col lg:flex-col justify-between gap-4 lg:gap-x-3 relative lg:-top-4 lg:shadow-1 bg-white lg:bg-transparent lg:backdrop-blur rounded-lg'>
      <div className='flex flex-row items-center justify-center gap-4 lg:gap-x-3'>
        <PropertyDropdown />
        <SearchBox />
          <button
            onClick={() => {
              handleClick();
            }}
            className='bg-red-800 hover:bg-red-700 transition duration-500 w-full lg:max-w-[100px] h-14 rounded-lg flex justify-center items-center text-white text-lg'
          >
            <RiSearch2Line />
          </button>
        </div>
      <div className='flex flex-row items-center justify-center gap-4 lg:gap-x-3'>
        <DistrictDropdown />
        <PriceRangeDropdown />
        <AreaRangeDropdown />
        <MoreOptionDropdown />
        <button
            onClick={() => {
              resetSearch();
            }}
            className='text-red-800 border border-red-700 hover:bg-red-700 hover:text-white transition duration-500 w-full lg:max-w-[100px] h-14 rounded-lg flex justify-center items-center text-lg'
          >
            <RiRestartLine />
        </button>
        <DeepSearchPopup />
      </div>
    </div>
  );
};

export default Search;