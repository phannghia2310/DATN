import axios from "axios";

const API_URL = 'http://localhost:5000';

export const addFormToData = (formData) => {
    return axios.post(`${API_URL}/add_data`, formData);
};