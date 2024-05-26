import React, { createContext, useState, useEffect } from "react";

// import api
import { getAllHouses } from "../api/houseApi";

// create context
export const HouseContext = createContext();

// provider
const HouseContextProvider = ({ children }) => {
  const [houses, setHouses] = useState([]);
  const [houseResult, setHouseResult] = useState([]);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("Tất cả địa điểm");
  const [districts, setDistricts] = useState([]);
  const [property, setProperty] = useState("Tất cả loại nhà đất");
  const [properties, setProperties] = useState([]);
  const [price, setPrice] = useState("Tất cả mức giá");
  const [area, setArea] = useState("Tất cả diện tích");
  const [bedroom, setBedroom] = useState("");
  const [direction, setDirection] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHouses = async () => {
    try {
      const response = await getAllHouses();
      setHouses(response.data);
      setHouseResult(response.data);
      setLoading(false);
    } catch (err){
      console.error('Error fetching houses: ', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    if(houses.length > 0) {
      const uniqueDistricts = [...new Set(houses.map(house => house.address_district))].sort((a, b) => a.localeCompare(b));
      uniqueDistricts.unshift("Tất cả địa điểm");
      const uniqueProperties = ["Tất cả loại nhà đất", ...new Set(houses.map(house => house.house_type))];

      setDistricts(uniqueDistricts);
      setProperties(uniqueProperties);
    }
  }, [houses]);

  const resetSearch = () => {
    setTimeout(() => {
      return (
        setDistrict("Tất cả địa điểm"),
        setProperty("Tất cả loại nhà đất"),
        setPrice("Tất cả mức giá"),
        setArea("Tất cả diện tích"),
        setSearch(""),
        setBedroom(""),
        setDirection(""),
        setLoading(false)
      );
    }, 300);
  };

  const handleClick = () => {
    setLoading(true);
    // check the string if includes 'Tất cả'
    const isDefault = (str) => {
      return str.includes("Tất cả");
    };

    //get price range
    let priceRange;
    const prices = price.match(/\d+/g);
    if(prices !== null) {
      if(prices.length === 1) {
        if(prices[0] === "500") {
          priceRange = [0, prices[0]/1000];
        } else {
          priceRange = [prices[0], Infinity];
        }
      } else {
        for(let i = 0; i<prices.length; i++) {
          if(prices[i].length === 3) {
            prices[i] /= 1000;
          }
        }
        priceRange = prices;
      }
    }

    //get area range
    let areaRange;
    const numbers = area.match(/\d+/g);
    if(numbers !== null) {
      if (numbers.length === 1) {
        if (numbers[0] === "50") {
          areaRange = [0, numbers[0]];
        } else {
          areaRange = [numbers[0], Infinity];
        }
      } else {
        areaRange = numbers;
      }
    }

    const newHouses = houses.filter((house) => {
      const housePrice = parseFloat(house.price)/1000000000;
      const houseArea = parseFloat(house.area);
      let houseName = '';
      !house.overall_info ? (houseName = '') : (houseName = house.overall_info.split('\n')[0].toLowerCase());
      const searchTerm = search.toLowerCase();
      const houseBedRoom = house.in_room_noBed.toString();
      const directionTerm = direction.replace(" - ", " ");

      // all values are selected
      if (
        house.address_district === district &&
        house.house_type === property &&
        housePrice >= priceRange[0] &&
        housePrice <= priceRange[1] &&
        houseName.includes(searchTerm) &&
        houseArea >= areaRange[0] &&
        houseArea <= areaRange[1] &&
        houseBedRoom === bedroom &&
        house.house_direction === directionTerm
      ) {
        return house;
      }
      // all values are default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        return house;
      }
      // district is not default
      if (
        !isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        return house.address_district === district;
      }
      // property is not default
      if (
        !isDefault(property) &&
        isDefault(district) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        return house.house_type === property;
      }
      // price is not default
      if (
        !isDefault(price) &&
        isDefault(district) &&
        isDefault(property) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house;
        }
      }
      // area is not default
      if (
        !isDefault(area) &&
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house;
        }
      }
      // search is not default
      if (
        searchTerm !== "" &&
        isDefault(property) &&
        isDefault(district) &&
        isDefault(price) &&
        isDefault(area) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        return houseName.includes(searchTerm);
      }
      // bedroom is not default
      if (
        bedroom !== "" &&
        isDefault(property) &&
        isDefault(district) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (bedroom === "5+") {
          return parseInt(houseBedRoom) >= 5;
        }
        return houseBedRoom === bedroom;
      }
      // house_direction is not default
      if (
        directionTerm !== "" &&
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        return house.house_direction === directionTerm;
      }
      // district and property are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        return house.address_district === district && house.house_type === property;
      }
      // district and price are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        isDefault(property) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house.address_district === district;
        }
      }
      // district and area are not default
      if (
        !isDefault(district) &&
        !isDefault(area) &&
        isDefault(property) &&
        isDefault(price) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house.address_district === district;
        }
      }
      //district and search are not default
      if (
        !isDefault(district) &&
        searchTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        return house.address_district === district && houseName.includes(searchTerm);
      }
      //district and bedroom are not default
      if (
        !isDefault(district) &&
        bedroom !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (bedroom === "5+") {
          return house.address_district === district && parseInt(houseBedRoom) >= 5;
        }
        return house.address_district === district && houseBedRoom === bedroom;
      }
      //district and house_direction are not default
      if (
        !isDefault(district) &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        return house.address_district === district && house.house_direction === directionTerm;
      }
      // property and price are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house.house_type === property;
        }
      }
      // property and area are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        isDefault(price) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house.house_type === property;
        }
      }
      // property and search are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        searchTerm !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        return house.house_type === property && houseName.includes(searchTerm);
      }
      // property and bedroom are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        bedroom !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (bedroom === "5+") {
          return house.house_type === property && parseInt(houseBedRoom) >= 5;
        }
        return house.house_type === property && houseBedRoom === bedroom;
      }
      // property and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        directionTerm !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        return house.house_type === property && house.house_direction === directionTerm;
      }
      // price and area are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house;
        }
      }
      // price and search are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        isDefault(area) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return houseName.includes(searchTerm);
        }
      }
      // price and bedroom are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        bedroom !== "" &&
        isDefault(area) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return parseInt(houseBedRoom) >= 5;
          }
          return houseBedRoom === bedroom;
        }
      }
      // price and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        directionTerm !== "" &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house.house_direction === directionTerm;
        }
      }
      // area and search are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return houseName.includes(searchTerm);
        }
      }
      // area and bedroom are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return parseInt(houseBedRoom) >= 5;
          }
          return houseBedRoom === bedroom;
        }
      }
      // area and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        !isDefault(area) &&
        directionTerm !== "" &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house.house_direction === directionTerm;
        }
      }
      // search and bedroom are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm === ""
      ) {
        if (bedroom === "5+") {
          return (
            houseName.includes(searchTerm) && parseInt(houseBedRoom) >= 5
          );
        }
        return houseName.includes(searchTerm) && houseBedRoom === bedroom;
      }
      // search and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        bedroom === ""
      ) {
        return (
          houseName.includes(searchTerm) && house.house_direction === directionTerm
        );
      }
      // bedroom and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom !== "" &&
        directionTerm !== ""
      ) {
        if (bedroom === "5+") {
          return (
            parseInt(houseBedRoom) >= 5 && house.house_direction === directionTerm
          );
        }
        return houseBedRoom === bedroom && house.house_direction === directionTerm;
      }
      // district and property and price are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house.address_district === district && house.house_type === property;
        }
      }
      // district and property and area are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        isDefault(price) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house.address_district === district && house.house_type === property;
        }
      }
      // district and property and search are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        searchTerm !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        return (
          house.address_district === district &&
          house.house_type === property &&
          houseName.includes(searchTerm)
        );
      }
      // district and property and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        bedroom !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (bedroom === "5+") {
          return (
            house.address_district === district &&
            house.house_type === property &&
            parseInt(houseBedRoom) >= 5
          );
        }
        return (
          house.address_district === district &&
          house.house_type === property &&
          houseBedRoom === bedroom
        );
      }
      // district and property and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        directionTerm !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        return (
          house.address_district === district &&
          house.house_type === property &&
          house.house_direction === directionTerm
        );
      }
      // district and price and area are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        !isDefault(area) &&
        isDefault(property) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house.address_district === district;
        }
      }
      // district and price and search are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        isDefault(property) &&
        isDefault(area) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house.address_district === district && houseName.includes(searchTerm);
        }
      }
      // district and price and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        bedroom !== "" &&
        isDefault(property) &&
        isDefault(area) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return house.address_district === district && parseInt(houseBedRoom) >= 5;
          }
          return house.address_district === district && houseBedRoom === bedroom;
        }
      }
      // district and price and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house.address_district === district && house.house_direction === directionTerm;
        }
      }
      // district and area and search are not default
      if (
        !isDefault(district) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house.address_district === district && houseName.includes(searchTerm);
        }
      }
      // district and area and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(area) &&
        bedroom !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return house.address_district === district && parseInt(houseBedRoom) >= 5;
          }
          return house.address_district === district && houseBedRoom === bedroom;
        }
      }
      // district and area and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(area) &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house.address_district === district && house.house_direction === directionTerm;
        }
      }
      // district and search and bedroom are not default
      if (
        !isDefault(district) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        directionTerm === ""
      ) {
        if (bedroom === "5+") {
          return (
            house.address_district === district &&
            houseName.includes(searchTerm && parseInt(houseBedRoom) >= 5)
          );
        }
        return (
          house.address_district === district &&
          houseName.includes(searchTerm) &&
          houseBedRoom === bedroom
        );
      }
      // district and search and house_direction are not default
      if (
        !isDefault(district) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        bedroom === ""
      ) {
        return (
          house.address_district === district &&
          houseName.includes(searchTerm) &&
          house.house_direction === directionTerm
        );
      }
      // district and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === ""
      ) {
        if (bedroom === "5+") {
          return (
            house.address_district === district &&
            parseInt(houseBedRoom) >= 5 &&
            house.house_direction === directionTerm
          );
        }
        return (
          house.address_district === district &&
          houseBedRoom === bedroom &&
          house.house_direction === directionTerm
        );
      }
      // property and price and area are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house.house_type === property;
        }
      }
      // property and price and search are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        isDefault(area) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house.house_type === property && houseName.includes(searchTerm);
        }
      }
      // property and price and bedroom are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        bedroom !== "" &&
        isDefault(area) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return house.house_type === property && parseInt(houseBedRoom) >= 5;
          }
          return house.house_type === property && houseBedRoom === bedroom;
        }
      }
      // property and price and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        directionTerm !== "" &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return house.house_type === property && house.house_direction === directionTerm;
        }
      }
      // property and area and search are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        isDefault(price) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house.house_type === property && houseName.includes(searchTerm);
        }
      }
      // property and area and bedroom are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        bedroom !== "" &&
        isDefault(price) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return house.house_type === property && parseInt(houseBedRoom) >= 5;
          }
          return house.house_type === property && houseBedRoom === bedroom;
        }
      }
      // property and area and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        directionTerm !== "" &&
        isDefault(price) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return house.house_type === property && house.house_direction === directionTerm;
        }
      }
      // property and search and bedroom are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        directionTerm === ""
      ) {
        if (bedroom === "5+") {
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            parseInt(houseBedRoom) >= 5
          );
        }
        return (
          house.house_type === property &&
          houseName.includes(searchTerm) &&
          houseBedRoom === bedroom
        );
      }
      // property and search and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        bedroom === ""
      ) {
        return (
          house.house_type === property &&
          houseName.includes(searchTerm) &&
          house.house_direction === directionTerm
        );
      }
      // property and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === ""
      ) {
        if (bedroom === "5+") {
          return (
            house.house_type === property &&
            parseInt(houseBedRoom) >= 5 &&
            house.house_direction === directionTerm
          );
        }
        return (
          house.house_type === property &&
          houseBedRoom === bedroom &&
          house.house_direction === directionTerm
        );
      }
      // price and area and search are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return houseName.includes(searchTerm);
        }
      }
      // price and area and bedroom are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return parseInt(houseBedRoom) >= 5;
          }
          return houseBedRoom === bedroom;
        }
      }
      // price and area and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        directionTerm !== "" &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house.house_direction === directionTerm;
        }
      }
      // price and search and bedroom are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(area) &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      // price and search and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(area) &&
        bedroom === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      // price and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(area) &&
        searchTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              parseInt(houseBedRoom) >= 5 && house.house_direction === directionTerm
            );
          }
          return (
            houseBedRoom === bedroom && house.house_direction === directionTerm
          );
        }
      }
      // area and search and bedroom are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              houseName.includes(searchTerm) && parseInt(houseBedRoom) >= 5
            );
          }
          return houseName.includes(searchTerm) && houseBedRoom === bedroom;
        }
      }
      // area and search and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        bedroom === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return (
            houseName.includes(searchTerm) && house.house_direction === directionTerm
          );
        }
      }
      // area and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        searchTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              parseInt(houseBedRoom) >= 5 && house.house_direction === directionTerm
            );
          }
          return (
            houseBedRoom === bedroom && house.house_direction === directionTerm
          );
        }
      }
      // search and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== ""
      ) {
        if (bedroom === "5+") {
          return (
            houseName.includes(searchTerm) &&
            parseInt(houseBedRoom) >= 5 &&
            house.house_direction === directionTerm
          );
        }
        return (
          houseName.includes(searchTerm) &&
          houseBedRoom === bedroom &&
          house.house_direction === directionTerm
        );
      }
      //district and property and price and area are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm === "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house.address_district === district && house.house_type === property;
        }
      }
      //district and property and price and search are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        isDefault(area) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm)
          );
        }
      }
      //district and property and price and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        bedroom !== "" &&
        isDefault(area) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseBedRoom === bedroom
          );
        }
      }
      //district and property and price and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        directionTerm !== "" &&
        isDefault(area) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and area and search are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm)
          );
        }
      }
      //district and property and area and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        bedroom !== "" &&
        isDefault(price) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseBedRoom === bedroom
          );
        }
      }
      //district and property and area and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        directionTerm !== "" &&
        isDefault(price) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and search and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        directionTerm === ""
      ) {
        if (bedroom === "5+") {
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            parseInt(houseBedRoom) >= 5
          );
        }
        return (
          house.address_district === district &&
          house.house_type === property &&
          houseName.includes(searchTerm) &&
          houseBedRoom === bedroom
        );
      }
      //district and property and search and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        bedroom === ""
      ) {
        return (
          house.address_district === district &&
          house.house_type === property &&
          houseName.includes(searchTerm) &&
          house.house_direction === directionTerm
        );
      }
      //district and property and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        isDefault(area) &&
        searchTerm === ""
      ) {
        if (bedroom === "5+") {
          return (
            house.address_district === district &&
            house.house_type === property &&
            parseInt(houseBedRoom) >= 5 &&
            house.house_direction === directionTerm
          );
        }
        return (
          house.address_district === district &&
          house.house_type === property &&
          houseBedRoom === bedroom &&
          house.house_direction === directionTerm
        );
      }
      //district and price and area and search are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        isDefault(property) &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house.address_district === district && houseName.includes(searchTerm);
        }
      }
      //district and price and area and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        bedroom !== "" &&
        !isDefault(area) &&
        isDefault(property) &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return house.address_district === district && parseInt(houseBedRoom) >= 5;
          }
          return house.address_district === district && houseBedRoom === bedroom;
        }
      }
      //district and price and area and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        !isDefault(area) &&
        directionTerm !== "" &&
        isDefault(property) &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house.address_district === district && house.house_direction === directionTerm;
        }
      }
      //district and area and search and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.address_district === district &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      //district and area and search and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        bedroom === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return (
            house.address_district === district &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and area and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(area) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        searchTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and search and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(price) &&
        isDefault(area)
      ) {
        if (bedroom === "5+") {
          return (
            house.address_district === district &&
            houseName.includes(searchTerm) &&
            parseInt(houseBedRoom) >= 5 &&
            house.house_direction === directionTerm
          );
        }
        return (
          house.address_district === district &&
          houseName.includes(searchTerm) &&
          houseBedRoom === bedroom &&
          house.house_direction === directionTerm
        );
      }
      //property and price and area and search are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house.house_type === property && houseName.includes(searchTerm);
        }
      }
      //property and price and area and bedroom are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return house.house_type === property && parseInt(houseBedRoom) >= 5;
          }
          return house.house_type === property && houseBedRoom === bedroom;
        }
      }
      //property and price and area and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        directionTerm !== "" &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return house.house_type === property && house.house_direction === directionTerm;
        }
      }
      //property and price and search and bedroom are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(area) &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      //property and price and search and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(area) &&
        bedroom === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and price and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(area) &&
        searchTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.house_type === property &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and area and search and bedroom are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(price) &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      //property and area and search and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        bedroom === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and area and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        searchTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.house_type === property &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and search and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        isDefault(area)
      ) {
        if (bedroom === "5+") {
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            parseInt(houseBedRoom) >= 5 &&
            house.house_direction === directionTerm
          );
        }
        return (
          house.house_type === property &&
          houseName.includes(searchTerm) &&
          houseBedRoom === bedroom &&
          house.house_direction === directionTerm
        );
      }
      //price and area and search and bedroom are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              houseName.includes(searchTerm) && parseInt(houseBedRoom) >= 5
            );
          }
          return houseName.includes(searchTerm) && houseBedRoom === bedroom;
        }
      }
      //price and area and search and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        bedroom === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return (
            houseName.includes(searchTerm) && house.house_direction === directionTerm
          );
        }
      }
      //price and area and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        searchTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              parseInt(houseBedRoom) >= 5 && house.house_direction === directionTerm
            );
          }
          return (
            houseBedRoom === bedroom && house.house_direction === directionTerm
          );
        }
      }
      //price and search and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(area)
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //area and search and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and price and area and search are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm)
          );
        }
      }
      //district and property and price and area and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        searchTerm === "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseBedRoom === bedroom
          );
        }
      }
      //district and property and price and area and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        directionTerm !== "" &&
        searchTerm === "" &&
        bedroom === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and price and search and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(area) &&
        directionTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      //district and property and price and search and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(area) &&
        bedroom === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and price and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(area) &&
        searchTerm === ""
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and area and search and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(price) &&
        directionTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      //district and property and area and search and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        bedroom === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and area and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        searchTerm === ""
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and search and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(price) &&
        isDefault(area)
      ) {
        if (bedroom === "5+") {
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            parseInt(houseBedRoom) >= 5 &&
            house.house_direction === directionTerm
          );
        }
        return (
          house.address_district === district &&
          house.house_type === property &&
          houseName.includes(searchTerm) &&
          houseBedRoom === bedroom &&
          house.house_direction === directionTerm
        );
      }
      //district and price and area and search and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        isDefault(property) &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.address_district === district &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      //district and price and area and search and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        bedroom === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return (
            house.address_district === district &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and price and area and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        searchTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and price and search and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(area)
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and area and search and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(property) &&
        isDefault(price)
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and price and area and search and bedroom are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      //property and price and area and search and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        bedroom === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and price and area and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        searchTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.house_type === property &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and price and search and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(area)
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and area and search and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(price)
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //price and area and search and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and price and area and search and bedroom are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom
          );
        }
      }
      //district and property and price and area and search and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        directionTerm !== "" &&
        bedroom === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and price and area and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        bedroom !== "" &&
        directionTerm !== "" &&
        searchTerm === ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and price and search and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(area)
      ) {
        if (housePrice >= priceRange[0] && housePrice <= priceRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and property and area and search and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(property) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(price)
      ) {
        if (houseArea >= areaRange[0] && houseArea <= areaRange[1]) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //district and price and area and search and bedroom and house_direction are not default
      if (
        !isDefault(district) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== "" &&
        isDefault(property)
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.address_district === district &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.address_district === district &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
      //property and price and area and search and bedroom and house_direction are not default
      if (
        isDefault(district) &&
        !isDefault(property) &&
        !isDefault(price) &&
        !isDefault(area) &&
        searchTerm !== "" &&
        bedroom !== "" &&
        directionTerm !== ""
      ) {
        if (
          housePrice >= priceRange[0] &&
          housePrice <= priceRange[1] &&
          houseArea >= areaRange[0] &&
          houseArea <= areaRange[1]
        ) {
          if (bedroom === "5+") {
            return (
              house.house_type === property &&
              houseName.includes(searchTerm) &&
              parseInt(houseBedRoom) >= 5 &&
              house.house_direction === directionTerm
            );
          }
          return (
            house.house_type === property &&
            houseName.includes(searchTerm) &&
            houseBedRoom === bedroom &&
            house.house_direction === directionTerm
          );
        }
      }
    });

    setTimeout(() => {
      return (
        newHouses.length < 1 ? setHouseResult([]) : setHouseResult(newHouses),
        setLoading(false)
      );
    }, 1000);
  };

  return (
    <HouseContext.Provider
      value={{
        search,
        setSearch,
        district,
        setDistrict,
        districts,
        property,
        setProperty,
        properties,
        price,
        setPrice,
        area,
        setArea,
        bedroom,
        setBedroom,
        direction,
        setDirection,
        handleClick,
        resetSearch,
        houses,
        houseResult,
        fetchHouses,
        loading,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};

export default HouseContextProvider;
