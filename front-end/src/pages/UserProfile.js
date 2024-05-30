import React, { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../components/UserContext";
import { HouseContext } from "../components/HouseContext";
import DefaultLogo from "../assets/img/user/default.png";
import ChangePasswordPopup from "../components/ChangePasswordPopup";

import TextField from "@mui/material/TextField";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import { UpdateUser, UploadImage } from "../api/userApi";

const UserProfile = () => {
  const { user } = useContext(UserContext);
  const { districts } = useContext(HouseContext);
  const [image, setImage] = useState(user ? user.image : null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMarried, setIsMarried] = useState(user ? (user.is_married ? "Đã kết hôn" : "Độc thân") : "");
  const [selectedLocation, setSelectedLocation] = useState(user ? user.desired_location : "");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    name: "",
    age: "",
    image: "",
    email: "",
    phone: "",
    address: "",
    maritalStatus: "",
    children: "",
    month_income: "",
    monthly_amt: "",
    avai_amt: "",
    desired_location: "",
    desired_interiorStatus: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    image: "",
    email: "",
    phone: "",
    address: "",
    maritalStatus: "",
    children: "",
    month_income: "",
    monthly_amt: "",
    avai_amt: "",
    desired_location: "",
    desired_interiorStatus: "",
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.name,
        age: user.age,
        image: user.image,
        email: user.email,
        phone: user.phone_number,
        address: user.address,
        maritalStatus: user.is_married === 1 ? "Đã kết hôn" : "Độc thân",
        children: user.no_child,
        month_income: user.month_income ? user.month_income.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "",
        monthly_amt: user.monthly_amt ? user.monthly_amt.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "",
        avai_amt: user.avai_amt ? user.avai_amt.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "",
        desired_location: user.desired_location,
        desired_interiorStatus: user.desired_interiorStatus,
      });

      setImage(formValues.image);
      setSelectedLocation(formValues.desired_location);
      setIsMarried(formValues.maritalStatus);
      setIsLoading(false);

    }
  }, [user, formValues.image, formValues.desired_location, formValues.maritalStatus]);

  useEffect(() => {
    if (isMarried !== "Đã kết hôn") {
      setFormValues((prevValues) => ({
        ...prevValues,
        children: "0",
      }));
    }
  }, [isMarried]);
  
  const getUserImage = (image) => {
    try {
      return require(`../assets/img/user/${image}`);
    } catch (err) {
      console.log(err);
      return DefaultLogo;
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (event) => {
    let value = event.target.value;
    if (
      event.target.name === "month_income" ||
      event.target.name === "monthly_amt" ||
      event.target.name === "avai_amt"
    ) {
      value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    setFormValues({
      ...formValues,
      [event.target.name]: value,
    });
  };

  const validateUpdate = () => {
    let valid = true;
    const newErrors = {};

    const nameRegex = /^[a-zA-Z\sàáạảãăắằẳẵặâấầẩẫậèéẹẻẽêếềểễệđìíịỉĩòóọỏõôốồổỗộơớờởỡợùúụủũưứừửữựỳỵỷỹÀÁẠẢÃĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊẾỀỂỄỆĐÌÍỊỈĨÒÓỌỎÕÔỐỒỔỖỘƠỚỜỞỠỢÙÚỤỦŨƯỨỪỬỮỰỲỴỶỸ]+$/u;
    const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9\d)\d{7}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const numberRegex = /^[0-9]+$/;

    // name validation
    if (!formValues.name) {
      newErrors.name = "Vui lòng nhập họ tên";
      valid = false;
    } else if (!nameRegex.test(formValues.name)) {
      newErrors.name = "Họ tên không được chứa kí tự đặc biệt hoặc số";
      valid = false;
    }

    //age validation
    if (!formValues.age) {
      newErrors.age = "Vui lòng nhập tuổi";
      valid = false;
    } else if (!numberRegex.test(formValues.age)) {
      newErrors.age = "Tuổi chỉ được nhập số";
      valid = false;
    }

    // email validation
    if (!formValues.email) {
      newErrors.email = "Vui lòng nhập email";
      valid = false;
    } else if (!emailRegex.test(formValues.email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    }

    // phone validation
    if (!formValues.phone) {
      newErrors.phone = "Vui lòng nhập số điên thoại";
      valid = false;
    } else if (!phoneRegex.test(formValues.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      valid = false;
    }

    // address validation
    if (!formValues.address) {
      newErrors.address = "Vui lòng nhập địa chỉ";
      valid = false;
    }

    // marital status validation
    if (!formValues.maritalStatus) {
      newErrors.maritalStatus = "Vui lòng chọn tình trạng hôn nhân";
      valid = false;
    }

    // children validation
    if (isMarried === "Đã kết hôn" && !formValues.children) {
      newErrors.children = "Vui lòng nhập số con trong gia đình";
      valid = false;
    }

    // month income validation
    if (!formValues.month_income) {
      newErrors.month_income = "Vui lòng nhập thu nhập hằng tháng";
      valid = false;
    } else if (!numberRegex.test(formValues.month_income.replace(/,/g, ""))) {
      newErrors.month_income = "Thu nhập hằng tháng chỉ được nhập số";
      valid = false;
    }

    // monthly amt validation
    if (!formValues.monthly_amt) {
      newErrors.monthly_amt = "Vui lòng nhập chi trả hằng tháng";
      valid = false;
    } else if (!numberRegex.test(formValues.monthly_amt.replace(/,/g, ""))) {
      newErrors.monthly_amt = "Chi trả hằng tháng chỉ được nhập số";
      valid = false;
    }

    // avai amt validation
    if (!formValues.avai_amt) {
      newErrors.avai_amt = "Vui lòng nhập số tiền có sẵn";
      valid = false;
    } else if (!numberRegex.test(formValues.avai_amt.replace(/,/g, ""))) {
      newErrors.avai_amt = "Số tiền có sẵn chỉ được nhập số";
      valid = false;
    }

    // desired location validation
    if (!formValues.desired_location) {
      newErrors.desired_location = "Vui lòng chọn địa điểm mong muốn";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    validateUpdate();

    console.log(validateUpdate(), errors);
    
    if(validateUpdate()) {
      const { email, phone, children, ...data } = formValues;
      const file = selectedFile;
      const formData = {
        ...data,
        email: email,
        phone_number: phone,
        is_married: isMarried === "Đã kết hôn" ? 1 : 0,
        no_child: parseInt(children),
        desired_location: selectedLocation,
        image: selectedFile ? selectedFile.name : user.image,
      };

      try {
        const response = await UpdateUser(user.id, formData);
        console.log('User updated successfully!', response);

        if(file) {
          const imageResponse = await UploadImage(file);
          console.log(imageResponse);
        }

        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(formData));
      } catch (err) {
        console.error('Error fetching data: ', err);
      } finally {
        window.location.reload();
      }
    }
  };
 
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center">
        <img
          className="rounded-full w-44 h-44"
          src={image ? (image === user.image ? getUserImage(image) : image) : DefaultLogo}
          alt="User Image"
          style={{ objectFit: "cover" }}
        />
        <button
          className="font-medium my-[10px] p-[4px] border border-2 bg-green-700 hover:bg-green-800 text-white"
          onClick={handleButtonClick}
        >
          Tải ảnh lên
        </button>
        <input
          type="file"
          name="image"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
          accept="image/*"
        />
      </div>
      <div className="flex ml-[395px] my-[20px]">
        <TextField
          name="name"
          value={formValues.name}
          onChange={handleChange}
          type="text"
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          variant="outlined"
          style={{ width: "300px", marginRight: "50px" }}
          error={errors.name}
          helperText={errors.name ? errors.name : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
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
              color: 'red'
            }
          }}
        />

        <TextField
          name="age"
          value={formValues.age}
          onChange={handleChange}
          type="text"
          label="Tuổi"
          placeholder="30"
          variant="outlined"
          style={{ width: "100px" }}
          error={errors.age}
          helperText={errors.age ? errors.age : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
          }}
          InputProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
          }}
          FormHelperTextProps={{
            style: {
              width: "150px",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontStyle: 'italic',
              color: 'red'
            }
          }}
        />
      </div>

      <div className="flex justify-center my-[20px]">
        <TextField
          name="email"
          value={formValues.email}
          onChange={handleChange}
          type="email"
          label="Email"
          placeholder="test@gmail.com"
          variant="outlined"
          style={{ width: "300px", marginRight: "50px" }}
          error={errors.email}
          helperText={errors.email ? errors.email : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
          }}
          InputProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
          }}
          FormHelperTextProps={{
            style: {
              width: "150px",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontStyle: 'italic',
              color: 'red'
            }
          }}
        />

        <TextField
          name="phone"
          value={formValues.phone}
          onChange={handleChange}
          type="text"
          label="Số điện thoại"
          placeholder="0987654321"
          variant="outlined"
          style={{ width: "300px" }}
          error={errors.phone}
          helperText={errors.phone ? errors.phone : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
          }}
          InputProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
          }}
          FormHelperTextProps={{
            style: {
              width: "150px",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontStyle: 'italic',
              color: 'red'
            }
          }}
        />
      </div>

      <div className="flex justify-center my-[20px]">
        <TextField
          name="address"
          value={formValues.address}
          onChange={handleChange}
          type="text"
          label="Địa chỉ"
          placeholder="Quận 9, TP. Hồ Chí Minh"
          variant="outlined"
          style={{ width: "300px", marginLeft: "150px", marginRight: "50px" }}
          error={errors.address}
          helperText={errors.address ? errors.address : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
          }}
          InputProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
          }}
          FormHelperTextProps={{
            style: {
              width: "150px",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontStyle: 'italic',
              color: 'red'
            }
          }}
        />

        <FormControl
          variant="outlined"
          style={{ width: "300px", marginRight: "50px" }}
        >
          <InputLabel
            htmlFor="marital-status"
            style={{ fontSize: "17px", fontFamily: "Poppins" }}
            shrink={true}
          >
            Tình trạng hôn nhân
          </InputLabel>
          <Select
            id="marital-status"
            name="maritalStatus"
            value={isMarried}
            onChange={(event) => setIsMarried(event.target.value)}
            style={{ fontSize: "17px", fontFamily: "Poppins" }}
            input={<OutlinedInput label="Tình trạng hôn nhân" />}
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

        <TextField
          name="children"
          value={formValues.children}
          onChange={handleChange}
          type="number"
          label="Con cái"
          placeholder="3"
          variant="outlined"
          style={{ width: "100px" }}
          error={errors.children}
          helperText={errors.children ? errors.children : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
          }}
          InputProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
          }}
          disabled={isMarried !== "Đã kết hôn"}
        />
      </div>

      <div className="flex justify-center my-[20px]">
        <TextField
          name="month_income"
          value={formValues.month_income}
          onChange={handleChange}
          type="text"
          label="Thu nhập hằng tháng"
          placeholder="30,000,000"
          variant="outlined"
          style={{ width: "300px", marginRight: "50px" }}
          error={errors.month_income}
          helperText={errors.month_income ? errors.month_income : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
          }}
          InputProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
          }}
          FormHelperTextProps={{
            style: {
              width: "150px",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontStyle: 'italic',
              color: 'red'
            }
          }}
        />

        <TextField
          name="monthly_amt"
          value={formValues.monthly_amt}
          onChange={handleChange}
          type="text"
          label="Chi trả hằng tháng"
          placeholder="30,000,000"
          variant="outlined"
          style={{ width: "300px" }}
          error={errors.monthly_amt}
          helperText={errors.monthly_amt ? errors.monthly_amt : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
          }}
          InputProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
          }}
          FormHelperTextProps={{
            style: {
              width: "150px",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontStyle: 'italic',
              color: 'red'
            }
          }}
        />
      </div>

      <div className="flex my-[20px]">
        <TextField
          name="avai_amt"
          value={formValues.avai_amt}
          onChange={handleChange}
          type="text"
          label="Số tiền sẵn có"
          placeholder="30,000,000"
          variant="outlined"
          style={{ width: "300px", marginLeft: "395px" }}
          error={errors.avai_amt}
          helperText={errors.avai_amt ? errors.avai_amt : ""}
          InputLabelProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
            shrink: true,
          }}
          InputProps={{
            style: {
              fontSize: "17px",
              fontFamily: "Poppins",
            },
          }}
          FormHelperTextProps={{
            style: {
              width: "150px",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontStyle: 'italic',
              color: 'red'
            }
          }}
        />
      </div>

      <div className="flex justify-center my-[20px]">
        <FormControl
          variant="outlined"
          style={{ width: "300px", marginRight: "50px" }}
        >
          <InputLabel
            htmlFor="desired_location"
            style={{ fontSize: "17px", fontFamily: "Poppins" }}
            shrink={true}
          >
            Địa điểm mong muốn (quận/huyện)
          </InputLabel>
          <Select
            id="desired_location"
            name="desiredLocation"
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
            style={{ fontSize: "17px", fontFamily: "Poppins" }}
            input={<OutlinedInput label="Địa điểm mong muốn (quận/huyện)" />}
          >
            {districts.slice(1, districts.length).map((district) => (
              <MenuItem
                value={district}
                style={{ fontSize: "17px", fontFamily: "Poppins" }}
              >
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          label="Tình trạng ngôi nhà"
          style={{ width: "300px" }}
        >
          <InputLabel style={{ fontSize: "17px", fontFamily: "Poppins" }} shrink={true}>
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

      <div className="flex justify-center my-[20px]">
        <button 
          className="bg-red-800 hover:bg-red-700 transition duration-500 w-full lg:max-w-[150px] h-14 rounded-lg text-white text-lg mr-[50px]"
          onClick={handleUpdate}
        >
          Cập nhật
        </button>

        <ChangePasswordPopup user={user}/>
      </div>
    </>
  );
};

export default UserProfile;
