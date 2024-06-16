import React from "react";

import { IoMdClose } from "react-icons/io";

const LoanDetailPopup = ({ schedule, loanAmount, onClose }) => {
  console.log(schedule);
  return (
    <div className="fixed inset-0 bg-gray-6s00 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-3/4 max-w-4xl">
        <div className="flex justify-between p-4 border-b">
          <span className="text-2xl font-semibold">Chi tiết khoản vay</span>
          <button
            onClick={onClose}
            className="hover:text-red-800 hover:bg-red-200 transition duration-300 px-[5px] rounded-lg text-2xl"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="overflow-auto h-[500px]">
          <table className="table-auto w-full mt-4 border-collapse border border-gray-200">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Kỳ trả lãi</th>
                <th className="border border-gray-300 px-4 py-2">Số tiền gốc phải trả</th>
                <th className="border border-gray-300 px-4 py-2">Số tiền lãi phải trả</th>
                <th className="border border-gray-300 px-4 py-2">Tổng tiền gốc và lãi</th>
                <th className="border border-gray-300 px-4 py-2">Số tiền gốc còn lại</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">0</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">0</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">0</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">0</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{loanAmount}</td>
              </tr>
              {schedule["Schedule"].map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.month}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(item.principal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(item.interest).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(item.total_payment).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(item.remaining_principal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                </tr>
              ))}
              <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">Tổng</td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">{loanAmount}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">{Math.round(schedule["Total Interest"]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">{Math.round(schedule["Total Payment"]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailPopup;
