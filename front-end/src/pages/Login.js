import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import TextField from "@mui/material/TextField";

import Logo from "../assets/img/logo.svg";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { IconButton } from "@mui/material";
import { BiShow, BiHide } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";

import { LoginUser, GetUser, GoogleLoginUser } from "../api/userApi";
import { UserContext } from "../components/UserContext";
import ForgotPasswordPopup from "../components/ForgotPasswordPopup";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [emailOrPhoneError, setEmailOrPhoneError] = useState(
    "Vui lòng nhập email hoặc số điện thoại"
  );
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("Vui lòng nhập mật khẩu");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateLogin = () => {
    setIsSubmitted(true);

    let valid = true;

    // check email or phone is correct
    const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9\d)\d{7}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailOrPhone) {
      setEmailOrPhoneError("Vui lòng nhập email hoặc số điện thoại");
      return false;
    } else if (
      !phoneRegex.test(emailOrPhone) &&
      !emailRegex.test(emailOrPhone)
    ) {
      setEmailOrPhoneError("Email hoặc số điện thoại không hợp lệ");
      return false;
    } else {
      setEmailOrPhoneError("");
    }

    //check password is correct
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      return false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await LoginUser(emailOrPhone, password);
        if (response.status === 200) {
          const userResponse = await GetUser(response.data.id);
          localStorage.setItem("user", JSON.stringify(userResponse.data));
          setUser(userResponse.data);
          setIsLoading(true);
          setTimeout(() => {
            navigate("/");
            setIsLoading(false);
          }, 2000);
        }
      } catch (error) {
        console.log(error.response);
        if (error.response) {
          if (error.response.status === 400) {
            setEmailOrPhoneError(error.response.data);
          } else if (error.response.status === 401) {
            setPasswordError(error.response.data);
          }
        }
      }
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const token = response.credential;
      const apiResponse = await GoogleLoginUser(token);

      const data = apiResponse.data;
      if (apiResponse.status === 200) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setIsLoading(true);
        setTimeout(() => {
          navigate("/");
          setIsLoading(false);
        }, 2000);
      } else {
        console.error("Google login failed: ", data);
      }
    } catch (err) {
      console.error("Google login error: ", err);
    }
  };

  const handleGoogleLoginFailure = (response) => {
    console.error("Google login failed: ", response);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ImSpinner2 className="animate-spin text-red-800 text-4xl" />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider 
      clientId="864707476707-u61028sfa4isftnerqaralk9df0tta05.apps.googleusercontent.com"
    >
      <div className="flex mt-7 items-center justify-center">
        <div className="bg-white px-10 py-10 rounded-3xl border-2 w-[500px]">
          <h1 className="flex text-2xl font-semibold">
            <img className="mr-2" src={Logo} alt="" /> xin chào!
          </h1>
          <p className="font-medium text-lg text-gray-500 mt-2">
            Đăng nhập để tiếp tục.
          </p>
          <div className="mt-4">
            <div>
              <TextField
                name="email-or-phone"
                type="text"
                label="Email hoặc số điện thoại"
                variant="outlined"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                error={isSubmitted && emailOrPhoneError}
                helperText={
                  isSubmitted && emailOrPhoneError ? emailOrPhoneError : ""
                }
                fullWidth
                style={{ marginBottom: "10px" }}
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
            </div>
            <div>
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                label="Nhập mật khẩu của bạn"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={isSubmitted && passwordError}
                helperText={isSubmitted && passwordError ? passwordError : ""}
                InputProps={{
                  style: {
                    fontSize: "17px",
                    fontFamily: "Poppins",
                  },
                  endAdornment: (
                    <IconButton onClick={handlePassword} edge="end">
                      {showPassword ? <BiShow /> : <BiHide />}
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
              <ForgotPasswordPopup />
            </div>

            <div className="mt-2 flex flex-col gap-y-4 items-center">
              <button
                className="w-full hover:bg-red-700 transition duration-500 px-10 py-3 rounded-xl bg-red-800 text-white text-lg font-bold"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>
              <div className="flex items-center my-2">
                <div className="border-t border-gray-300 w-[175px]"></div>
                <span className="mx-4 text-gray-500 text-[17px]">Hoặc</span>
                <div className="border-t border-gray-300 w-[175px]"></div>
              </div>
              <button className="flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-500 py-[4px] px-[10px] border border-gray-400 text-[15px] rounded w-[250px]">
                <AiFillFacebook className="text-blue-500 text-3xl" /> Đăng nhập
                với Facebook
              </button>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onFailure={handleGoogleLoginFailure}
                cookiePolicy={"single_host_login"}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    style={{ backgroundColor: "blue", color: "white"}}
                  >
                    <FcGoogle className="text-3xl" /> Đăng nhập với Google
                  </button>
                )}
              />
              <p>
                Bạn chưa có tài khoản?
                <a href="/register" className="px-1 text-red-800 font-medium">
                  {" "}
                  Đăng ký
                </a>
                tại đây.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
