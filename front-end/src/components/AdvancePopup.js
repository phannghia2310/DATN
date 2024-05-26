import React, { useState } from "react";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

import { RiRestartLine, RiSearch2Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { ImSpinner2 } from 'react-icons/im';

import { HouseContext } from "./HouseContext";

//import api
import { addFormToData } from "../api/advanceApi";

const AdvancePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    age: '',
    maritalStatus: '',
    children: '',
    month_income: '',
    monthly_amt: '',
    avai_amt: '',
    desired_location: '',
    desired_interiorStatus: ''
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleReset = (event) => {
    event.preventDefault();
    setFormValues({
      age: '',
      maritalStatus: '',
      children: '',
      month_income: '',
      monthly_amt: '',
      avai_amt: '',
      desired_location: '',
      desired_interiorStatus: ''
    });
  };

  const handleChange = (event) => {
    let value = event.target.value;
    if (
      event.target.name === 'month_income' ||
      event.target.name === 'monthly_amt' ||
      event.target.name === 'avai_amt'
    ) {
      value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    setFormValues({
      ...formValues,
      [event.target.name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const { maritalStatus, children, ...data } = formValues;
    const formData = {
      ...data,
      is_married: maritalStatus === "Đã kết hôn" ? 1 : 0,
      no_child: parseInt(children),
    };

    try {
      const response = await addFormToData(formData);
      console.log('Data added successfully!', response.data);
      handleClose();
    } catch (err) {
      console.error('Error fetching data: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const mangso = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];

  function dochangchuc(so, daydu) {
    let chuoi = "";
    const chuc = Math.floor(so / 10);
    const donvi = so % 10;
    if (chuc > 1) {
      chuoi = " " + mangso[chuc] + " mươi";
      if (donvi === 1) {
        chuoi += " mốt";
      }
    } else if (chuc === 1) {
      chuoi = " mười";
      if (donvi === 1) {
        chuoi += " một";
      }
    } else if (daydu && donvi > 0) {
      chuoi = " lẻ";
    }
    if (donvi === 5 && chuc > 1) {
      chuoi += " lăm";
    } else if (donvi > 1 || (donvi === 1 && chuc === 0)) {
      chuoi += " " + mangso[donvi];
    }
    return chuoi;
  }

  function dochangtram(so, daydu) {
    let chuoi = " ";
    const tram = Math.floor(so / 100);
    so = so % 100;
    if (daydu || tram > 0) {
      chuoi = " " + mangso[tram] + " trăm";
      chuoi += dochangchuc(so, true);
    } else {
      chuoi = dochangchuc(so, false);
    }
    return chuoi;
  }

  function docblock(so, daydu) {
    let chuoi = "";
    const ty = Math.floor(so / 1000000000);
    so = so % 1000000000;
    if (ty > 0) {
      chuoi += dochangtram(ty, daydu) + " tỷ";
      daydu = true;
    }
    const trieu = Math.floor(so / 1000000);
    so = so % 1000000;
    if (trieu > 0) {
      chuoi += dochangtram(trieu, daydu) + " triệu";
      daydu = true;
    }
    const ngan = Math.floor(so / 1000);
    so = so % 1000;
    if (ngan > 0) {
      chuoi += dochangtram(ngan, daydu) + " ngàn";
      daydu = true;
    }
    if (so > 0) {
      chuoi += dochangtram(so, daydu);
    }
    return chuoi;
  }

  function dochonso(so) {
    if (so === 0) return mangso[0];
    let chuoi = "",
      hauto = "";
    do {
      const ty = so % 1000000000;
      so = Math.floor(so / 1000000000);
      if (so > 0) {
        chuoi = docblock(ty, true) + hauto + chuoi;
      } else {
        chuoi = docblock(ty, false) + hauto + chuoi;
      }
      hauto = " tỷ";
    } while (so > 0);
    return chuoi;
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-red-800 hover:bg-red-700 transition duration-500 w-full lg:max-w-[100px] h-14 rounded-lg flex justify-center items-center text-white text-lg"
      >
        Nâng cao
      </button>
      <Dialog
        open={isOpen}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle className="flex justify-between">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "Poppins" }}
          >
            Tìm kiếm theo tiêu chí cá nhân
          </span>
          <button
            onClick={handleClose}
            className="hover:text-red-800 hover:bg-red-100 transition duration-300 px-[5px] rounded-lg text-3xl"
          >
            <IoMdClose />
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="flex justify-between">
            <TextField
              name="age"
              value={formValues.age}
              onChange={handleChange}
              type="text"
              label="Tuổi"
              placeholder="30"
              variant="standard"
              style={{ width: "150px" }}
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
            />

            <FormControl
              variant="standard"
              label="Tình trạng hôn nhân"
              style={{ width: "212px" }}
            >
              <InputLabel style={{ fontSize: "17px", fontFamily: "Poppins" }}>
                Tình trạng hôn nhân
              </InputLabel>
              <Select
                name="maritalStatus"
                value={formValues.maritalStatus}
                onChange={handleChange}
                style={{ fontSize: "17px", fontFamily: "Poppins" }}
              >
                <MenuItem
                  value="Độc thân"
                  style={{ fontSize: "17px", fontFamily: "Poppins" }}
                >
                  Độc thân
                </MenuItem>
                <MenuItem
                  value="Đã kết hôn"
                  style={{ fontSize: "17px", fontFamily: "Poppins" }}
                >
                  Đã kết hôn
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex justify-between">
            <TextField
              name="children"
              value={formValues.children}
              onChange={handleChange}
              type="text"
              label="Con cái"
              placeholder="3"
              variant="standard"
              style={{ width: "100px" }}
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
            />

            <TextField
              name="month_income"
              value={formValues.month_income}
              onChange={handleChange}
              label="Thu nhập hằng tháng"
              placeholder="3,000,000"
              variant="standard"
              helperText={
                formValues.month_income
                  ? dochonso(parseInt(formValues.month_income.replace(/,/g, ""))).toString() +
                    " VND"
                  : ""
              }
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: "13px",
                  fontFamily: "Poppins",
                  fontStyle: 'italic',
                  color: 'black'
                }
              }}
            />
          </div>
          <div className="flex justify-between">
            <TextField
              name="monthly_amt"
              value={formValues.monthly_amt}
              onChange={handleChange}
              label="Chi trả hằng tháng"
              placeholder="3,000,000"
              variant="standard"
              style={{ marginRight: "10px" }}
              helperText={
                formValues.monthly_amt
                  ? dochonso(parseInt(formValues.monthly_amt.replace(/,/g, ""))).toString() +
                    " VND"
                  : ""
              }
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: "13px",
                  fontFamily: "Poppins",
                  fontStyle: 'italic',
                  color: 'black'
                }
              }}
            />  
            <TextField
              name="avai_amt"
              value={formValues.avai_amt}
              onChange={handleChange}
              label="Số tiền sẵn có"
              placeholder="3,000,000,000"
              variant="standard"
              helperText={
                formValues.avai_amt
                  ? dochonso(parseInt(formValues.avai_amt.replace(/,/g, ""))).toString() +
                    " VND"
                  : ""
              }
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: "13px",
                  fontFamily: "Poppins",
                  fontStyle: 'italic',
                  color: 'black'
                }
              }}
            />  
          </div>
          <div className="flex justify-between">
            <TextField
              name="desired_location"
              value={formValues.desired_location}
              onChange={handleChange}
              type="text"
              label="Địa điểm mong muốn (quận/huyện)"
              placeholder="Bình Tân"
              variant="standard"
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
            />

            <FormControl
              variant="standard"
              label="Tình trạng ngôi nhà"
              style={{ width: "212px" }}
            >
              <InputLabel style={{ fontSize: "17px", fontFamily: "Poppins" }}>
                Tình trạng ngôi nhà
              </InputLabel>
              <Select
                name="desired_interiorStatus"
                value={formValues.desired_interiorStatus}
                onChange={handleChange}
                style={{ fontSize: "17px", fontFamily: "Poppins" }}
              >
                <MenuItem
                  value="Nội thất cơ bản"
                  style={{ fontSize: "17px", fontFamily: "Poppins" }}
                >
                  Nội thất cơ bản
                </MenuItem>
                <MenuItem
                  value="Nội thất đầy đủ"
                  style={{ fontSize: "17px", fontFamily: "Poppins" }}
                >
                  Nội thất đầy đủ
                </MenuItem>
                <MenuItem
                  value="Không có nội thất"
                  style={{ fontSize: "17px", fontFamily: "Poppins" }}
                >
                  Không có nội thất
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <button 
           onClick={handleReset}
           className="text-red-800 border border-red-700 hover:bg-red-700 hover:text-white transition duration-500 w-full lg:max-w-[100px] h-14 rounded-lg flex justify-center items-center text-lg"
          >
            <RiRestartLine />
          </button>
          <button 
           type="submit"
           className="bg-red-800 hover:bg-red-700 transition duration-500 w-full lg:max-w-[100px] h-14 mx-[15px] rounded-lg flex justify-center items-center text-white text-lg"
           disabled={isLoading}
          >
          {isLoading ? <ImSpinner2 className="animate-spin" /> : <RiSearch2Line /> }
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdvancePopup;
