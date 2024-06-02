import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { BiShow, BiHide } from "react-icons/bi";

import { UserContext } from "./UserContext";

import { ChangePassword } from "../api/userApi";

const ChangePasswordPopup = ({ user }) => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    reNewPassword: "",
  });

  const handleOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleConPassword = () => {
    setShowConPassword(!showConPassword);
  };


  const handleOpen = () => {
    setIsOpen(true);
  };

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
    let valid = true;
    const newErrors = {};
    setIsSubmitted(true);

    // old password validation
    if (!oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
      valid = false;
    } else if (oldPassword !== user.password) {
      newErrors.oldPassword = "Mật khẩu cũ không đúng";
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

    //re new password validation
    if (!conPassword) {
      newErrors.reNewPassword = "Vui lòng nhập lại mật khẩu mới";
      valid = false;
    } else if (conPassword !== newPassword) {
      newErrors.reNewPassword = "Mật khẩu không trùng khớp";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (validateChangePassword()) {
      try {
        const response = await ChangePassword(user.id, newPassword);
        if(response.status === 200) {
            setTimeout(() => {
              handleClose();
              localStorage.removeItem('user');
              setUser(null);
              navigate('/');
            }, 1000);
        }
      } catch (err) {
        console.log(err.response);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="hover:bg-red-700 hover:text-white border border-red-800 transition duration-500 w-full lg:max-w-[150px] h-14 rounded-lg text-red-800 text-lg"
      >
        Đổi mật khẩu
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
            style={{ fontFamily: "Poppins" }}
          >
            Đổi mật khẩu
          </span>
          <button
            onClick={(event) => handleClose(event)}
            className="hover:text-red-800 hover:bg-red-800 transition duration-300 px-[5px] rounded-lg text-3xl"
          >
            <IoMdClose />
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col justify-center">
            <TextField
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              type={showOldPassword ? "text" : "password"}
              label="Nhập mật khẩu cũ"
              variant="standard"
              style={{ width: "350px" }}
              error={isSubmitted && errors.oldPassword}
              helperText={
                isSubmitted && errors.oldPassword ? errors.oldPassword : ""
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
                endAdornment: (
                  <IconButton onClick={handleOldPassword} edge="end">
                    {showOldPassword ? <BiShow /> : <BiHide />}
                  </IconButton>
                ),
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: "13px",
                  fontFamily: "Poppins",
                  fontStyle: "italic",
                  color: "red",
                },
              }}
            />

            <TextField
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type={showNewPassword ? "text" : "password"}
              label="Nhập mật khẩu mới"
              variant="standard"
              style={{ width: "350px" }}
              error={isSubmitted && errors.newPassword}
              helperText={
                isSubmitted && errors.newPassword ? errors.newPassword : ""
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
                endAdornment: (
                  <IconButton onClick={handleNewPassword} edge="end">
                    {showNewPassword ? <BiShow /> : <BiHide />}
                  </IconButton>
                ),
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: "13px",
                  fontFamily: "Poppins",
                  fontStyle: "italic",
                  color: "red",
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
              name="reNewPassword"
              value={conPassword}
              onChange={(e) => setConPassword(e.target.value)}
              type={showConPassword ? "text" : "password"}
              label="Nhập lại mật khẩu"
              variant="standard"
              style={{ width: "350px" }}
              error={isSubmitted && errors.reNewPassword}
              helperText={
                isSubmitted && errors.reNewPassword ? errors.reNewPassword : ""
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
                endAdornment: (
                  <IconButton onClick={handleConPassword} edge="end">
                    {showConPassword ? <BiShow /> : <BiHide />}
                  </IconButton>
                ),
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: "13px",
                  fontFamily: "Poppins",
                  fontStyle: "italic",
                  color: "red",
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

export default ChangePasswordPopup;
