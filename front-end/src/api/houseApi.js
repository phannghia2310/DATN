import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getAllHouses = () => {
    return axios.get(`${API_URL}/get_all_houses`);
};

export const getHouseByMetaCode = (meta_code) => {
    return axios.get(`${API_URL}/get_house/${meta_code}`);
}

export const getHousesFromModel = () => {
    return axios.get(`${API_URL}/get_house_from_model`);
};