import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { BiShow, BiHide } from "react-icons/bi";

import { ForgotPassword } from "../api/userApi";

const ForgotPasswordPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    emailOrPhone: "",
    newPassword: "",
    conPassword: "",
  });

  const handleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleConPassword = () => {
    setShowConPassword(!showConPassword);
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = (event) => {
    event?.preventDefault();
    setIsOpen(false);
  };

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      lowerCase: /[a-z]/.test(password),
      upperCase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChars: /[!@#$%^&*]/.test(password),
    };

    const validCount = Object.values(criteria).filter(Boolean).length;
    const meetsRequirement = validCount >= 3;

    return { ...criteria, meetsRequirement };
  };
  const validation = validatePassword(newPassword);

  const validateChangePassword = () => {
    const newErrors = {};
    let valid = true;
    setIsSubmitted(true);

    const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9\d)\d{7}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // email or phone validation
    if (!emailOrPhone) {
      newErrors.emailOrPhone = "Vui lòng nhập email hoặc số điện thoại";
      valid = false;
    } else if (
      !phoneRegex.test(emailOrPhone) &&
      !emailRegex.test(emailOrPhone)
    ) {
      newErrors.emailOrPhone = "Email hoặc số điện thoại không hợp lệ";
      valid = false;
    }

    // new password validation
    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      valid = false;
    } else if (!validation.meetsRequirement) {
      newErrors.newPassword = "Mật khẩu mới chưa đáp ứng đủ điều kiện";
      valid = false;
    }

    // confirm password validation
    if (!conPassword) {
      newErrors.conPassword = "Vui lòng nhập lại mật khẩu";
      valid = false;
    } else if (conPassword !== newPassword) {
      newErrors.conPassword = "Mật khẩu không trùng khớp";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (validateChangePassword()) {
      try {
        const response = await ForgotPassword(emailOrPhone, newPassword);
        if (response.status === 200) {
            window.location.reload();
        }
      } catch (err) {
        console.log(err.response);
        const newErrors = {};
        newErrors.emailOrPhone = err.response.data;
        setErrors(newErrors);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="font-medium text-base text-red-800 mt-1 mb-2"
      >
        Quên mật khẩu?
      </button>
      <Dialog
        open={isOpen}
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle className="flex justify-between">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "Poppins " }}
          >
            Quên mật khẩu
          </span>
          <button
            onClick={(event) => handleClose(event)}
            className="hover:text-red-800 hover:bg-red-100 transition duration-300 px-[5px] rounded-lg text-3xl"
          >
            <IoMdClose />
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col justify-center mt-[5px]">
            <TextField
              name="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              error={isSubmitted && errors.emailOrPhone}
              helperText={
                isSubmitted && errors.emailOrPhone ? errors.emailOrPhone : ""
              }
              type="text"
              label="Email hoặc số điện thoại"
              variant="outlined"
              style={{ width: "350px", marginBottom: "10px" }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              FormHelperTextProps={{
                style: {
                  color: "red",
                  fontStyle: "italic",
                  fontFamily: "Poppins",
                },
              }}
            />

            <TextField
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={isSubmitted && errors.newPassword}
              helperText={
                isSubmitted && errors.newPassword ? errors.newPassword : ""
              }
              type={showNewPassword ? "text" : "password"}
              label="Nhập mật khẩu mới"
              variant="outlined"
              style={{ width: "350px", marginBottom: "10px" }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
                endAdornment: (
                  <IconButton onClick={handleNewPassword} edge="end">
                    {showNewPassword ? <BiShow /> : <BiHide />}
                  </IconButton>
                ),
              }}
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              FormHelperTextProps={{
                style: {
                  color: "red",
                  fontStyle: "italic",
                  fontFamily: "Poppins",
                },
              }}
            />

            <div className="text-[14px]">
              <p>Mật khẩu của bạn phải chứa:</p>
              <ul className="list-disc ml-5">
                <li
                  className={
                    validation.length ? "text-green-700" : "text-gray-500"
                  }
                >
                  Ít nhất 8 ký tự
                </li>
                <li
                  className={
                    validation.meetsRequirement
                      ? "text-green-700"
                      : "text-gray-500"
                  }
                >
                  Ít nhất 3 tiêu chí sau:
                </li>
                <ul className="list-disc ml-5">
                  <li
                    className={
                      validation.lowerCase ? "text-green-700" : "text-gray-500"
                    }
                  >
                    Lower case letters (a-z)
                  </li>
                  <li
                    className={
                      validation.upperCase ? "text-green-700" : "text-gray-500"
                    }
                  >
                    Upper case letters (A-Z)
                  </li>
                  <li
                    className={
                      validation.number ? "text-green-700" : "text-gray-500"
                    }
                  >
                    Numbers (0-9)
                  </li>
                  <li
                    className={
                      validation.specialChars
                        ? "text-green-700"
                        : "text-gray-500"
                    }
                  >
                    Special characters (e.g. !@#$%^&*)
                  </li>
                </ul>
              </ul>
            </div>

            <TextField
              name="conPassword"
              value={conPassword}
              onChange={(e) => setConPassword(e.target.value)}
              error={isSubmitted && errors.conPassword}
              helperText={
                isSubmitted && errors.conPassword ? errors.conPassword : ""
              }
              type={showConPassword ? "text" : "password"}
              label="Nhập lại mật khẩu mới"
              variant="outlined"
              style={{ width: "350px", marginBottom: "10px" }}
              InputProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
                endAdornment: (
                  <IconButton onClick={handleConPassword} edge="end">
                    {showConPassword ? <BiShow /> : <BiHide />}
                  </IconButton>
                ),
              }}
              InputLabelProps={{
                style: {
                  fontSize: "17px",
                  fontFamily: "Poppins",
                },
              }}
              FormHelperTextProps={{
                style: {
                  color: "red",
                  fontStyle: "italic",
                  fontFamily: "Poppins",
                },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleChangePassword}
            type="submit"
            className="bg-red-800 hover:bg-red-700 transition duration-500 h-14 mx-[15px] px-[10px] rounded-lg text-white text-lg"
          >
            Xác nhận
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForgotPasswordPopup;
