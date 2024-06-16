import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Icon } from "@iconify/react";
import { BiBed, BiBath } from "react-icons/bi";
import { IoLocation } from "react-icons/io5";

const House = ({
  house,
  isSelected,
  onSelect,
  showCompareButton,
  selectedHouses,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (selectedHouses.length === 0) {
      navigate(`/house-details/${house.meta_code}`);
    } else {
      onSelect();
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect();
  };

  let houseName;
  !house.overall_info
    ? (houseName = "")
    : (houseName = house.overall_info.split("\n")[0]);
  return (
    <div
      className={`relative ${
        isSelected ? "bg-gray-200" : "bg-white"
      } shadow-1 p-5 rounded-2xl w-full max-w-[352px] mx-auto cursor-pointer hover:shadow-2xl transition`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className="text-black font-bold text-xl mb-2 text-wrap overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {houseName}
      </div>
      <div className="mb-4 gap-x-2 text-sm">
        <div className="text-gray-600 text-[17px] inline-block">
          {house.meta_code}
        </div>
        <div className="flex content-center text-gray-500 text-[15px] inline-block">
          <IoLocation className="mt-[3px]" />
          <span>
            {house.address_street}, {house.address_ward},{" "}
            {house.address_district}, {house.address_city}
          </span>
        </div>
      </div>
      <div className="flex gap-x-4 my-4">
        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px] rounded-full">
            <BiBed />
          </div>
          <div className="text-base">{house.in_room_noBed}</div>
        </div>
        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px] rounded-full">
            <BiBath />
          </div>
          <div className="text-base">{house.in_room_noBath}</div>
        </div>
        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px] rounded-full">
            <Icon icon="pixelarticons:drop-area" className="text-gray-700" />
          </div>
          <div className="text-base">{house.area}m²</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold text-red-800">
          {house.price
            .toString()
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          VNĐ
        </div>
        <div>
          {house.housePerformance ? (
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              {house.housePerformance >= 80 ? (
                <CircularProgress
                  variant="determinate"
                  value={house.housePerformance}
                  color="success"
                />
              ) : (
                <CircularProgress
                  variant="determinate"
                  value={house.housePerformance}
                  color="warning"
                />
              )}

              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  {`${Math.round(house.housePerformance)}%`}
                </Typography>
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </div>
      </div>
      {showCompareButton && (
        <button
          onClick={handleSelect}
          className={`absolute right-0 left-0 bottom-0 h-[100px] bg-gradient-to-t from-red-800 to-red-800/0 text-white text-[17px] p-2 rounded-b-lg shadow-md transition-transform duration-500 transform ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          So sánh với
        </button>
      )}
    </div>
  );
};

export default House;
