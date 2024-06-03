import axios from 'axios';

const API_URL = 'http://localhost:5000'

export const RegisterUser = (emailOrPhone, password) => {
    return axios.post(`${API_URL}/register`, {emailOrPhone, password});
};

export const LoginUser = (emailOrPhone, password) => {
    return axios.post(`${API_URL}/login`, {emailOrPhone, password});
};

export const GoogleLoginUser = (token) => {
    return axios.post(`${API_URL}/google_login`, {token}, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const GetUser = (id) => {
    return axios.get(`${API_URL}/get_user/${id}`);
};

export const UpdateUser = (id, formData) => {
    return axios.put(`${API_URL}/update_user/${id}`, {formData});
};

export const UploadImage = (file) => {
    return axios.post(`${API_URL}/upload_image`, {file}, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    });
};

export const ChangePassword = (id, password) => {
    return axios.put(`${API_URL}/change_password/${id}`, {password});
}

export const ForgotPassword = (emailOrPhone, newPassword) => {
    return axios.put(`${API_URL}/forgot_password`, {emailOrPhone, newPassword});
};