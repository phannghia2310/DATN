import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { IoMdClose } from "react-icons/io";
import { HiArrowNarrowRight } from "react-icons/hi";
import { RiLoader4Line } from "react-icons/ri";

import { UserContext } from "./UserContext";
import { HouseContext } from "./HouseContext";

import { getHousesFromModel } from "../api/houseApi";

const DeepSearchPopup = () => {
  const { user } = useContext(UserContext);
  const { setHouses, setHousesResult } = useContext(HouseContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    age: "",
    maritalStatus: "",
    children: "",
    month_income: "",
    monthly_amt: "",
    avai_amt: "",
    desired_location: "",
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        age: user.age,
        maritalStatus: user.is_married,
        children: user.no_child,
        month_income: user.month_income
          ? user.month_income
              .toString()
              .replace(/\D/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null,
        monthly_amt: user.monthly_amt
          ? user.monthly_amt
              .toString()
              .replace(/\D/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null,
        avai_amt: user.avai_amt
          ? user.avai_amt
              .toString()
              .replace(/\D/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null,
        desired_location: user.desired_location,
      });
    }
  }, [user]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = (event) => {
    event?.preventDefault();
    setIsOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const checkNullValue = (formValues) => {
    return Object.values(formValues).some(
      (value) => value === null || value === ""
    );
  };

  const handleProfile = () => {
    navigate(`user-profile/${user.id}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    try {
      const response = await getHousesFromModel(user.id);
      if (response.status === 200) {
        const houses = await response.data;
        setHouses(houses);
        setHousesResult(houses);
        handleClose();
      } else {
        console.error("Error fetching houses from model");
      }
    } catch (error) {
      console.error("Error fetching houses from model", error);
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-red-800 hover:bg-red-700 w-full transition duration-500 h-14 rounded-lg text-white text-lg"
      >
        Tìm kiếm chuyên sâu
      </button>
      <Dialog
        open={isOpen}
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle className="flex justify-end">
          <button
            onClick={(event) => handleClose(event)}
            className="hover:text-red-800 hover:bg-red-100 transition duration-300 px-[5px] rounded-lg text-3xl"
          >
            <IoMdClose />
          </button>
        </DialogTitle>
        <DialogContent>
          {user ? (
            <div className="flex flex-col justify-center items-center h-[200px] w-[500px]">
              {!checkNullValue(formValues) ? (
                <div className="flex flex-col justify-center items-center">
                  {isSubmitted ? (
                    <>
                      <span className="text-[17px] mb-[5px] italic">
                        Hệ thống đang thực hiện tìm kiếm vui lòng chờ...
                      </span>
                      <RiLoader4Line className="animate-spin text-[45px] text-red-800" />
                    </>
                  ) : (
                    <>
                      <span className="text-[17px] mb-[5px] italic">
                        Hệ thống sẽ sử dụng thông tin cá nhân của bạn để thực
                        hiện tìm kiếm. Bạn có muốn tiếp tục không?
                      </span>
                      <button
                        onClick={handleSubmit}
                        className="bg-red-800 hover:bg-red-700 transition duration-500 rounded-lg text-white text-lg px-[15px] py-[10px]"
                      >
                        Tiếp tục
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <span className="text-[17px] mb-[5px] italic">
                    Có vẻ như thông tin cá nhân của bạn chưa được hoàn thiện,
                    vui lòng hoàn thiện thông tin để tiếp tục.
                  </span>
                  <button
                    onClick={handleProfile}
                    className="flex justify-around items-center text-[18px] w-[270px] text-red-800 underline"
                  >
                    Đi đến trang thông tin các nhân{" "}
                    <HiArrowNarrowRight className="text-[25px]" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-[200px] w-[500px]">
              <span className="text-[17px] mb-[5px] italic">
                Có vẻ như bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.
              </span>
              <button
                onClick={handleLogin}
                className="bg-red-800 hover:bg-red-700 transition duration-500 rounded-lg text-white text-lg px-[10px] py-[10px]"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeepSearchPopup;
