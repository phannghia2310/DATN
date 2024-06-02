import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BiBed, BiBath } from "react-icons/bi";
import { Icon } from "@iconify/react";
import { BsDash, BsDashLg } from "react-icons/bs";
import { IoMdCompass } from "react-icons/io";
import { Link } from "react-router-dom";
import { HouseContext } from "../components/HouseContext";
import axios from "axios";

const HouseDetails = () => {
  const { meta_code } = useParams();
  const { houses, fetchHouses } = useContext(HouseContext);
  const [houseDetails, setHouseDetails] = useState(null);

  console.log(meta_code);

  useEffect(() => {
    if (houses.length === 0) {
      fetchHouses();
    } else {
      const details = houses.find(house => house.meta_code === meta_code);
      setHouseDetails(details);
    }
  }, [houses, fetchHouses, meta_code]);

  useEffect(() => {
    if (houseDetails) {
      const address = `${houseDetails.address_street}, ${houseDetails.address_ward}, ${houseDetails.address_district}, ${houseDetails.address_city}`;
      const apiKey = "600240e966e2431da599388aac4fe100";

      const initMap = (lat, lng) => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: { lat, lng },
        });
        new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
        });
      };

      axios
        .get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            address
          )}&key=${apiKey}`
        )
        .then((response) => {
          const location = response.data.results[0].geometry;
          initMap(location.lat, location.lng);
        })
        .catch((error) => {
          console.log("Error fetching the geocode data", error);
        });
    }
  }, [houseDetails]);

  if (!houseDetails) {
    return <p>Không tìm thấy ngôi nhà {meta_code}</p>;
  }

  return (
    <div className="container flex justify-between mx-auto min-h-[800px] mb-14">
      <div>
        <div>
          <h6 className="text-lg text-[17px] text-gray-600 mb-2">
            {houseDetails.address_street}, {houseDetails.address_ward}, {houseDetails.address_district}, {houseDetails.address_city}
          </h6>
        </div>
        <div className="text-[30px] font-bold mb-2">
          {houseDetails.overall_info.split("\n")[0]}
        </div>
        <div className="text-[17px] text-gray-600">
          Mã nhà đất:{" "}
          <strong className="text-black">{houseDetails.meta_code}</strong>
        </div>
        <div className="text-[17px] text-gray-600 w-[700px]">
          Chi tiết:{" "}
          <Link to={houseDetails.meta_url}>
            <span className="text-blue-400">{houseDetails.meta_url}</span>
          </Link>
        </div>
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <div className="max-w-[768px]">
            <div className="flex gap-x-6 items-center text-gray-800 mb-4 pb-4 border-b-slate-300 border-b">
              <div className="text-[25px] font-semibold text-red-800">
                {houseDetails.price / 1000000000} tỷ
              </div>
              <BsDashLg className="rotate-90 text-[25px] text-gray-500" />
              <div className="flex gap-x-2 items-center">
                <BiBed className="text-2xl" />
                <div className="text-lg font-medium">
                  {houseDetails.in_room_noBed}
                </div>
              </div>
              <div className="flex gap-x-2 items-center">
                <BiBath className="text-2xl" />
                <div className="text-lg font-medium">
                  {houseDetails.in_room_noBath}
                </div>
              </div>
              <div className="flex gap-x-2 items-center">
                <Icon icon="pixelarticons:drop-area" className="text-2xl" />
                <div className="text-lg font-medium">
                  {houseDetails.area}m²
                </div>
              </div>
              <div className="flex gap-x-2 items-center">
                <IoMdCompass className="text-2xl" />
                <div className="text-lg font-medium">
                  {houseDetails.house_direction}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-[27px] font-bold">Tổng quan</p>
              {houseDetails.overall_info.split("\n").map((line, index) => (
                <p key={index} className="flex items-center text-[17px]">
                  {index === 0 ||
                  index ===
                    houseDetails.overall_info.split("\n").length - 2 ? (
                    ""
                  ) : (
                    <BsDash />
                  )}{" "}
                  {line}
                </p>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-[27px] font-bold">Ưu điểm ngôi nhà</p>
              <table>
                <tbody>
                  {!houseDetails.other_good_outstandingCharacteristics ? (
                    ""
                  ) : (
                    <tr className="border-b">
                      <td className="w-1/4 font-bold">ĐẶC ĐIỂM NỔI BẬT</td>
                      <td className="py-[20px] text-[17px]">
                        {houseDetails.other_good_outstandingCharacteristics}
                      </td>
                    </tr>
                  )}
                  {!houseDetails.other_good_locationDesc ? (
                    ""
                  ) : (
                    <tr className="border-b">
                      <td className="w-1/4 font-bold">MÔ TẢ VỊ TRÍ</td>
                      <td className="py-[20px] text-[17px]">
                        {houseDetails.other_good_locationDesc}
                      </td>
                    </tr>
                  )}
                  {!houseDetails.other_good_community ? (
                    ""
                  ) : (
                    <tr className="border-b">
                      <td className="w-1/4 font-bold">CỘNG ĐỒNG CƯ DÂN</td>
                      <td className="py-[20px] text-[17px]">
                        {houseDetails.other_good_community}
                      </td>
                    </tr>
                  )}
                  {!houseDetails.other_good_education ? (
                    ""
                  ) : (
                    <tr className="border-b">
                      <td className="w-1/4 font-bold">VỀ GIÁO DỤC</td>
                      <td className="py-[20px] text-[17px]">
                        {houseDetails.other_good_education}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full ml-[20px]">
        <p className="text-[27px] font-bold">Vị trí địa lý</p>
        <div id="map" style={{ height: "300px", width: "100%" }}></div>
      </div>
    </div>
  );
};

export default HouseDetails;
