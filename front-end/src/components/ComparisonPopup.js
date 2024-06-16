import React from "react";

import { IoMdClose } from "react-icons/io";

const ComparisonPopup = ({ houses, onClose, onShowLoanComparison }) => {
  const house1 = houses[0];
  const house2 = houses[1];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-3/4 max-w-4xl">
        <div className="flex justify-between p-4 border-b">
          <span className="text-2xl font-semibold">So sánh bất động sản</span>
          <button
            onClick={onClose}
            className="hover:text-red-800 hover:bg-red-200 transition duration-300 px-[5px] rounded-lg text-2xl"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="flex p-4 mb-5 overflow-auto h-[500px]">
          <div className="w-1/2 border-r pr-4">
            <h3 className="text-xl font-semibold mb-2">Bất động sản 1</h3>
            <p className="text-[17px]">
              <strong>Mã nhà đất:</strong> {house1.meta_code}
            </p>
            <p className="text-[17px]">
              <strong>Địa chỉ:</strong> {house1.address_street},{" "}
              {house1.address_ward}, {house1.address_district},{" "}
              {house1.address_city}
            </p>
            <p className="text-[17px]">
              <strong>Số phòng ngủ:</strong> {house1.in_room_noBed}
            </p>
            <p className="text-[17px]">
              <strong>Số phòng tắm:</strong> {house1.in_room_noBath}
            </p>
            <p className="text-[17px]">
              <strong>Diện tích:</strong> {house1.area}m²
            </p>
            <p className="text-[17px]">
              <strong>Giá:</strong>{" "}
              {house1.price
                .toString()
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              NVĐ
            </p>
            {house1.housePerformance && (
              <p className="text-[17px]">
                <strong>Mức độ phù hợp:</strong> {house1.housePerformance}%
              </p>
            )}
            <p className="text-[17px]">
              <strong>Tổng quan:</strong>
            </p>
            {house1.overall_info.split("\n").map((line, index) => (
              <p key={index} className="flex items-center text-[17px] ml-3">
                {line}
              </p>
            ))}
          </div>
          <div className="w-1/2 pl-4">
            <h3 className="text-xl font-semibold mb-2">Bất động sản 2</h3>
            <p className="text-[17px]">
              <strong>Mã nhà đất:</strong> {house2.meta_code}
            </p>
            <p className="text-[17px]">
              <strong>Địa chỉ:</strong> {house2.address_street},{" "}
              {house2.address_ward}, {house2.address_district},{" "}
              {house2.address_city}
            </p>
            <p className="text-[17px]">
              <strong>Số phòng ngủ:</strong> {house2.in_room_noBed}
            </p>
            <p className="text-[17px]">
              <strong>Số phòng tắm:</strong> {house2.in_room_noBath}
            </p>
            <p className="text-[17px]">
              <strong>Diện tích:</strong> {house2.area}m²
            </p>
            <p className="text-[17px]">
              <strong>Giá:</strong>{" "}
              {house2.price
                .toString()
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              NVĐ
            </p>
            {house2.housePerformance && (
              <p className="text-[17px]">
                <strong>Mức độ phù hợp:</strong> {house2.housePerformance}%
              </p>
            )}
            <p className="text-[17px]">
              <strong>Tổng quan:</strong>
            </p>
            {house2.overall_info.split("\n").map((line, index) => (
              <p key={index} className="flex items-center text-[17px] ml-3">
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="flex justify-center p-4 border-t">
        <button
          onClick={onShowLoanComparison}
          className="hover:bg-red-700 bg-red-800 transition duration-500 w-full lg:max-w-[250px] h-14 rounded-lg text-white text-lg"
        >
          So sánh khoản vay tài chính
        </button>
      </div>
      </div>
    </div>
  );
};

export default ComparisonPopup;
