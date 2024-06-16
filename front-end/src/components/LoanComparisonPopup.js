import React, { useState } from "react";

import { IoMdClose } from "react-icons/io";

import { calculateAmortizationSchedule } from "../api/houseApi";
import LoanDetailPopup from "./LoanDetailPopup";

const LoanComparisonPopup = ({ houses, onClose }) => {
  const house1 = houses[0];
  const house2 = houses[1];

  const [house1Price, setHouse1Price] = useState(0);
  const [house2Price, setHouse2Price] = useState(0);
  const [annualInterestRate1, setAnnualInterestRate1] = useState(0);
  const [annualInterestRate2, setAnnualInterestRate2] = useState(0);
  const [loanTermInMonths1, setLoanTermInMonths1] = useState(0);
  const [loanTermInMonths2, setLoanTermInMonths2] = useState(0);
  const [amortizationSchedule1, setAmortizationSchedule1] = useState(null);
  const [amortizationSchedule2, setAmortizationSchedule2] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState(null);

  const formatNumber = (num) => {
    return num !== 0
      ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "0";
  };

  const handleHouse1PriceChange = (e) => {
    const inputPrice = parseInt(e.target.value.replace(/,/g, "") || 0);
    const maxLoanAmount = Math.round(house1.price * 0.7);
    const adjustedPrice = Math.min(inputPrice, maxLoanAmount);
    setHouse1Price(formatNumber(adjustedPrice));
  };

  const handleHouse2PriceChange = (e) => {
    const inputPrice = parseInt(e.target.value.replace(/,/g, "") || 0);
    const maxLoanAmount = Math.round(house2.price * 0.7);
    const adjustedPrice = Math.min(inputPrice, maxLoanAmount);
    setHouse2Price(formatNumber(adjustedPrice));
  };

  const calculate = async (price, rate, term) => {
    try {
      const response = await calculateAmortizationSchedule({
        loanAmount: price,
        annualInterestRate: rate,
        loanTermInMonths: term,
      });
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleCalculate = async () => {
    const schedule1 = await calculate(
      parseInt(house1Price.toString().replace(/,/g, "")),
      annualInterestRate1,
      loanTermInMonths1
    );
    const schedule2 = await calculate(
      parseInt(house2Price.toString().replace(/,/g, "")),
      annualInterestRate2,
      loanTermInMonths2
    );

    setAmortizationSchedule1(schedule1);
    setAmortizationSchedule2(schedule2);
  };

  const handelViewLoanDetails = (schedule, loanAmount) => {
    setSelectedSchedule(schedule);
    setSelectedLoanAmount(loanAmount);
  };

  const handleCloseLoanDetails = () => {
    setSelectedSchedule(null);
    setSelectedLoanAmount(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      {!selectedSchedule && (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg w-2/3 max-w-3xl">
          <div className="flex justify-between p-4 border-b">
            <span className="text-2xl font-semibold">
              So sánh khoản vay tài chính
            </span>
            <button
              onClick={onClose}
              className="hover:text-red-800 hover:bg-red-200 transition duration-300 px-[5px] rounded-lg text-2xl"
            >
              <IoMdClose />
            </button>
          </div>
          <div className="px-4">
            <span className="italic">
              Lưu ý: Số tiền vay chỉ được tối đa là 70% giá trị bất động sản
            </span>
          </div>
          <div className="flex p-4 mb-5 overflow-auto h-[350px]">
            <div className="w-1/2 border-r pr-4">
              <h3 className="text-xl font-semibold mb-2">Bất động sản 1</h3>
              <p className="text-[17px]">
                <strong>Giá bất động sản:</strong>{" "}
                {house1.price
                  .toString()
                  .replace(/\D/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                VNĐ
              </p>
              <div className="flex justify-between items-center mb-4">
                <label className="mr-4">Số tiền vay (VNĐ): </label>
                <input
                  type="text"
                  value={house1Price}
                  onChange={handleHouse1PriceChange}
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <label className="mr-4">Lãi suất (%/năm): </label>
                <input
                  type="number"
                  value={annualInterestRate1}
                  onChange={(e) =>
                    setAnnualInterestRate1(parseFloat(e.target.value))
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <label className="mr-4">Thời hạn vay (tháng): </label>
                <input
                  type="number"
                  value={loanTermInMonths1}
                  onChange={(e) =>
                    setLoanTermInMonths1(parseInt(e.target.value))
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
              {amortizationSchedule1 && (
                <div className="mt-4">
                  <p>
                    <strong>Tháng trả cao nhất: </strong>
                    {`${
                      amortizationSchedule1["Max Payment Month"]
                    } (${Math.round(
                      amortizationSchedule1["Max Monthly Payment"]
                    )
                      .toString()
                      .replace(/\D/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ)`}
                  </p>
                  <p>
                    <strong>Tổng lãi phải trả: </strong>
                    {`${Math.round(amortizationSchedule1["Total Interest"])
                      .toString()
                      .replace(/\D/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ`}
                  </p>
                  <p>
                    <strong>Tỉ lệ lãi phải trả: </strong>
                    {`${amortizationSchedule1[
                      "Interest to Payment Ratio"
                    ].toFixed(2)}%`}
                  </p>
                  <button
                    onClick={() =>
                      handelViewLoanDetails(amortizationSchedule1, house1Price)
                    }
                    className="underline hover:text-red-800 transition duration-300"
                  >
                    Xem chi tiết
                  </button>
                </div>
              )}
            </div>
            <div className="w-1/2 pl-4">
              <h3 className="text-xl font-semibold mb-2">Bất động sản 2</h3>
              <p className="text-[17px]">
                <strong>Giá bất động sản:</strong>{" "}
                {house2.price
                  .toString()
                  .replace(/\D/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                VNĐ
              </p>
              <div className="flex justify-between items-center mb-4">
                <label className="mr-4">Số tiền vay (VNĐ): </label>
                <input
                  type="text"
                  value={house2Price}
                  onChange={handleHouse2PriceChange}
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <label className="mr-4">Lãi suất (%/năm): </label>
                <input
                  type="number"
                  value={annualInterestRate2}
                  onChange={(e) =>
                    setAnnualInterestRate2(parseFloat(e.target.value))
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <label className="mr-4">Thời hạn vay (tháng): </label>
                <input
                  type="number"
                  value={loanTermInMonths2}
                  onChange={(e) =>
                    setLoanTermInMonths2(parseInt(e.target.value))
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
              {amortizationSchedule2 && (
                <div className="mt-4">
                  <p>
                    <strong>Tháng trả cao nhất: </strong>
                    {`${
                      amortizationSchedule2["Max Payment Month"]
                    } (${Math.round(
                      amortizationSchedule2["Max Monthly Payment"]
                    )
                      .toString()
                      .replace(/\D/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ)`}
                  </p>
                  <p>
                    <strong>Tổng lãi phải trả: </strong>
                    {`${Math.round(amortizationSchedule2["Total Interest"])
                      .toString()
                      .replace(/\D/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ`}
                  </p>
                  <p>
                    <strong>Tỉ lệ lãi phải trả: </strong>
                    {`${amortizationSchedule2[
                      "Interest to Payment Ratio"
                    ].toFixed(2)}%`}
                  </p>
                  <button
                    onClick={() =>
                      handelViewLoanDetails(amortizationSchedule2, house2Price)
                    }
                    className="underline hover:text-red-800 transition duration-300"
                  >
                    Xem chi tiết
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center p-4 border-t">
            <button
              onClick={handleCalculate}
              className="hover:bg-red-700 bg-red-800 transition duration-500 w-full lg:max-w-[250px] h-14 rounded-lg text-white text-lg"
            >
              Tính toán
            </button>
          </div>
        </div>
      )}
      {selectedSchedule && (
        <LoanDetailPopup
          schedule={selectedSchedule}
          loanAmount={selectedLoanAmount}
          onClose={handleCloseLoanDetails}
        />
      )}
    </div>
  );
};

export default LoanComparisonPopup;
