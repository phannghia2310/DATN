import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getAllHouses = () => {
    return axios.get(`${API_URL}/get_all_houses`);
};

export const getHouseByMetaCode = (meta_code) => {
    return axios.get(`${API_URL}/get_house/${meta_code}`);
}

export const getHousesFromModel = (id) => {
    return axios.get(`${API_URL}/get_houses_from_model/${id}`);
};

export const calculateAmortizationSchedule = ({loanAmount, annualInterestRate, loanTermInMonths}) => {
    return axios.post(`${API_URL}/amortization-schedule`, {loanAmount, annualInterestRate, loanTermInMonths});
};