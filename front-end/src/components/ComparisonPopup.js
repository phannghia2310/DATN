import React, { useContext } from "react";

import { IoMdClose } from "react-icons/io";
import { UserContext } from "./UserContext";

const ComparisonPopup = ({ houses, onClose, onShowLoanComparison }) => {
  const { user } = useContext(UserContext);
  const house1 = houses[0];
  const house2 = houses[1];

  const userGroup = user ? user.group : "";

  const highlightClass = "bg-green-200";

  // Tạo một object để lưu trữ các yếu tố quan trọng cho từng nhóm khách hàng
  const importantFactors = {
    1: ["Số phòng ngủ", "Số phòng tắm", "Diện tích", "Giá", "Mức độ phù hợp"],
    2: ["Số phòng ngủ", "Số phòng tắm", "Diện tích", "Giá", "Mức độ phù hợp"],
    3: [
      "Số phòng ngủ",
      "Số phòng tắm",
      "Diện tích",
      "Tiện nghi cho nhiều thế hệ",
      "Nội thất đầy đủ",
      "Nội thất cơ bản",
      "Mức độ phù hợp"
    ],
    4: [
      "Địa chỉ",
      "Diện tích",
      "Giá",
      "Tiện nghi cao cấp",
      "Nội thất đầy đủ",
      "Nội thất cơ bản",
      "Mức độ phù hợp"
    ],
    5: ["Diện tích", "Giá", "Sổ hồng", "Mức độ phù hợp"],
  };

  // Hàm kiểm tra xem một yếu tố có phải là quan trọng cho nhóm khách hàng hay không
  const isImportantForGroup = (factor) => {
    return importantFactors[userGroup]?.includes(factor);
  };

  const highlightIfImportant = (house1Value, house2Value, factor) => {
    if (isImportantForGroup(factor)) {
      // Kiểm tra từng nhóm khách hàng và tô màu dựa trên yếu tố
      switch (userGroup) {
        case 1:
          if (
            factor === "Giá" ||
            factor === "Diện tích" ||
            factor === "Số phòng ngủ" ||
            factor === "Số phòng tắm"
          ) {
            return house1Value < house2Value ? highlightClass : "";
          }
          if (factor === "Mức độ phù hợp") {
            return house1Value > house2Value ? highlightClass : "";
          }
          break;
        case 2:
          if (factor === "Giá") {
            return house1Value < house2Value ? highlightClass : "";
          }
          if (
            factor === "Diện tích" ||
            factor === "Số phòng ngủ" ||
            factor === "Số phòng tắm"
          ) {
            return house1Value > house2Value ? highlightClass : "";
          }
          if (factor === "Mức độ phù hợp") {
            return house1Value > house2Value ? highlightClass : "";
          }
          break;
        case 3:
          if (
            factor === "Diện tích" ||
            factor === "Số phòng ngủ" ||
            factor === "Số phòng tắm"
          ) {
            return house1Value > house2Value ? highlightClass : "";
          }
          if (
            factor === "Tiện nghi cho nhiều thế hệ" ||
            factor === "Nội thất đầy đủ" ||
            factor === "Nội thất cơ bản"
          ) {
            const amenitiesScore1 = house1Value.includes("Đầy đủ nội thất")
              ? 1
              : house1Value.includes("Nội thất cơ bản")
              ? 0.5
              : 0;
            const amenitiesScore2 = house2Value.includes("Đầy đủ nội thất")
              ? 1
              : house2Value.includes("Nội thất cơ bản")
              ? 0.5
              : 0;
            return amenitiesScore1 > amenitiesScore2 ? highlightClass : "";
          }
          if (factor === "Mức độ phù hợp") {
            return house1Value > house2Value ? highlightClass : "";
          }
          break;
        case 4:
          if (
            factor === "Tiện nghi cao cấp" ||
            factor === "Nội thất đầy đủ" ||
            factor === "Nội thất cơ bản"
          ) {
            const luxuryScore1 = house1Value.includes("Đầy đủ nội thất")
              ? 1
              : house1Value.includes("Nội thất cơ bản")
              ? 0.5
              : 0;
            const luxuryScore2 = house2Value.includes("Đầy đủ nội thất")
              ? 1
              : house2Value.includes("Nội thất cơ bản")
              ? 0.5
              : 0;
            return luxuryScore1 > luxuryScore2 ? highlightClass : "";
          }
          if (factor === "Mức độ phù hợp") {
            return house1Value > house2Value ? highlightClass : "";
          }
          break;
        case 5:
          if (factor === "Giá") {
            return house1Value > house2Value ? highlightClass : "";
          }
          if (factor === "Diện tích") {
            return house1Value > house2Value ? highlightClass : "";
          }
          if (factor === "Sổ hồng") {
            const goodLegalStatusScore1 = house1Value.includes("Sổ hồng")
              ? 1
              : 0;
            const goodLegalStatusScore2 = house2Value.includes("Sổ hồng")
              ? 1
              : 0;
            return goodLegalStatusScore1 > goodLegalStatusScore2
              ? highlightClass
              : "";
          }
          if (factor === "Mức độ phù hợp") {
            return house1Value > house2Value ? highlightClass : "";
          }
          break;
        default:
          return "";
      }
    }
    return "";
  };

  const highlightOverallInfo = (line) => {
    if (isImportantForGroup("Pháp lý") && line.includes("Pháp lý"))
      return highlightClass;
    if (
      isImportantForGroup("Nội thất đầy đủ") &&
      line.includes("Đầy đủ nội thất")
    )
      return highlightClass;
    if (
      isImportantForGroup("Nội thất cơ bản") &&
      line.includes("Nội thất cơ bản")
    )
      return highlightClass;
    return "";
  };

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
            <p className={`text-[17px]`}>
              <strong>Địa chỉ:</strong> {house1.address_street},{" "}
              {house1.address_ward}, {house1.address_district},{" "}
              {house1.address_city}
            </p>
            <p
              className={`text-[17px] ${highlightIfImportant(
                house1.in_room_noBed,
                house2.in_room_noBed,
                "Số phòng ngủ"
              )}`}
            >
              <strong>Số phòng ngủ:</strong> {house1.in_room_noBed}
            </p>
            <p
              className={`text-[17px] ${highlightIfImportant(
                house1.in_room_noBath,
                house2.in_room_noBath,
                "Số phòng tắm"
              )}`}
            >
              <strong>Số phòng tắm:</strong> {house1.in_room_noBath}
            </p>
            <p
              className={`text-[17px] ${highlightIfImportant(
                house1.area,
                house2.area,
                "Diện tích"
              )}`}
            >
              <strong>Diện tích:</strong> {house1.area}m²
            </p>
            <p
              className={`text-[17px] ${highlightIfImportant(
                house1.price,
                house2.price,
                "Giá"
              )}`}
            >
              <strong>Giá:</strong>{" "}
              {house1.price
                .toString()
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              NVĐ
            </p>
            {house1.housePerformance && (
              <p
                className={`text-[17px] ${highlightIfImportant(
                  house1.housePerformance,
                  house2.housePerformance,
                  "Mức độ phù hợp"
                )}`}
              >
                <strong>Mức độ phù hợp:</strong> {house1.housePerformance}%
              </p>
            )}
            <p className="text-[17px]">
              <strong>Tổng quan:</strong>
            </p>
            {house1.overall_info.split("\n").map((line, index) => (
              <p
                key={index}
                className={`flex items-center text-[17px] ml-3 ${highlightOverallInfo(
                  line
                )}`}
              >
                {line}
              </p>
            ))}
          </div>
          <div className="w-1/2 pl-4">
            <h3 className="text-xl font-semibold mb-2">Bất động sản 2</h3>
            <p className="text-[17px]">
              <strong>Mã nhà đất:</strong> {house2.meta_code}
            </p>
            <p className={`text-[17px]`}>
              <strong>Địa chỉ:</strong> {house2.address_street},{" "}
              {house2.address_ward}, {house2.address_district},{" "}
              {house2.address_city}
            </p>
            <p
              className={`text-[17px] ${highlightIfImportant(
                house2.in_room_noBed,
                house1.in_room_noBed,
                "Số phòng ngủ"
              )}`}
            >
              <strong>Số phòng ngủ:</strong> {house2.in_room_noBed}
            </p>
            <p
              className={`text-[17px] ${highlightIfImportant(
                house2.in_room_noBath,
                house1.in_room_noBath,
                "Số phòng tắm"
              )}`}
            >
              <strong>Số phòng tắm:</strong> {house2.in_room_noBath}
            </p>
            <p
              className={`text-[17px] ${highlightIfImportant(
                house2.area,
                house1.area,
                "Diện tích"
              )}`}
            >
              <strong>Diện tích:</strong> {house2.area}m²
            </p>
            <p
              className={`text-[17px] ${highlightIfImportant(
                house2.price,
                house1.price,
                "Giá"
              )}`}
            >
              <strong>Giá:</strong>{" "}
              {house2.price
                .toString()
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              NVĐ
            </p>
            {house2.housePerformance && (
              <p
                className={`text-[17px] ${highlightIfImportant(
                  house2.housePerformance,
                  house1.housePerformance,
                  "Mức độ phù hợp"
                )}`}
              >
                <strong>Mức độ phù hợp:</strong> {house2.housePerformance}%
              </p>
            )}
            <p className="text-[17px]">
              <strong>Tổng quan:</strong>
            </p>
            {house2.overall_info.split("\n").map((line, index) => (
              <p
                key={index}
                className={`flex items-center text-[17px] ml-3 ${highlightOverallInfo(
                  line
                )}`}
              >
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
