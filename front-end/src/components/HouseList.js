import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";

import { HouseContext } from "./HouseContext";
import House from "./House";
import ComparisonPopup from "./ComparisonPopup";
import LoanComparisonPopup from "./LoanComparisonPopup";

import { ImSpinner2 } from "react-icons/im";

const HouseList = () => {
  const itemsPerPage = 18;
  const { housesResult, loading } = useContext(HouseContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHouses, setSelectedHouses] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showLoanComparison, setShowLoanComparison] = useState(false);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentHouses = housesResult.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(housesResult.length / itemsPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectHouse = (meta_code) => {
    setSelectedHouses((prevSelectedHouses) => {
      const updatedSelection = prevSelectedHouses.includes(meta_code)
        ? prevSelectedHouses.filter((code) => code !== meta_code)
        : [...prevSelectedHouses, meta_code];

      if (updatedSelection.length === 2) {
        setShowComparison(true);
      } else {
        setShowComparison(false);
      }

      return updatedSelection;
    });
  };

  const selectedHouseObjects = selectedHouses.map((meta_code) =>
    housesResult.find((house) => house.meta_code === meta_code)
  );

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedHouses([]);
  };

  const handleShowLoanComparison = () => {
    setShowComparison(false);
    setShowLoanComparison(true);
  };

  const handleCloseLoanComparison = () => {
    setShowLoanComparison(false);
    setShowComparison(true);
  };

  if (loading) {
    return (
      <ImSpinner2 className="mx-auto animate-spin text-red-800 text-4xl mt-[200px]" />
    );
  }

  if (housesResult.length < 1) {
    return (
      <div className="text-center text-3xl text-gray-400 mt-48">
        Không tìm thấy kết quả phù hợp.
      </div>
    );
  }

  return (
    <section className="mt-[150px] mb-10 z-0">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-14">
          {currentHouses.map((house, index) => {
            return (
              // <Link to={`/house-details/${house.meta_code}`} key={index}>
              <House
                key={index}
                house={house}
                isSelected={selectedHouses.includes(house.meta_code)}
                onSelect={() => handleSelectHouse(house.meta_code)}
                showCompareButton={selectedHouses.length === 0}
                selectedHouses={selectedHouses}
              />
              // </Link>
            );
          })}
        </div>
        <div className="m-[20px] flex justify-center">
          <Pagination
            count={Math.ceil(housesResult.length / itemsPerPage)}
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
      {showComparison && selectedHouseObjects.length === 2 && (
        <ComparisonPopup
          houses={selectedHouseObjects}
          onClose={handleCloseComparison}
          onShowLoanComparison={handleShowLoanComparison}
        />
      )}
      {showLoanComparison && (
        <LoanComparisonPopup
          houses={selectedHouseObjects}
          onClose={handleCloseLoanComparison}
        />
      )}
    </section>
  );
};

export default HouseList;
