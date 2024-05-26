import React, { useContext, useState } from 'react';
import { HouseContext } from './HouseContext';
import House from './House';
import { Link } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';
import { Pagination } from '@mui/material';

const HouseList = () => {
  const itemsPerPage = 18;
  const { houseResult, loading } = useContext(HouseContext);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentHouses = houseResult.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(houseResult.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <ImSpinner2 className='mx-auto animate-spin text-red-800 text-4xl mt-[200px]' />
    );
  }

  if (houseResult.length < 1) {
    return (
      <div className='text-center text-3xl text-gray-400 mt-48'>
        Không tìm thấy kết quả phù hợp.
      </div>
    );
  }

  return (
    <section className='mt-[150px] mb-10'>
      <div className='container mx-auto'>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-14'>
          {currentHouses.map((house, index) => {
            return (
              <Link to={`/housedetails/${house.meta_code}`} key={index}> 
                <House house={house} />
              </Link>
            );
          })}
        </div>
        <div className='m-[20px] flex justify-center'>
        <Pagination
          count={Math.ceil(houseResult.length / itemsPerPage)}
          color="error"
          variant="outlined"
          shape="rounded"
          size="normal"
          showFirstButton
          showLastButton
          page={currentPage}
          onChange={handlePageChange}
        />
        </div>
      </div>
    </section>
  );
};

export default HouseList;