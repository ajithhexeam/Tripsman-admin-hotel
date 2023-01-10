import React, { useState, useEffect } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import moment from "moment";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';


const { REACT_APP_AUTH_SERVER}= process.env;
const {REACT_APP_SERVER_URL}=process.env;

const RoomTable = ({ color, data, Listing = () => { },dataRecord }) => {
 
  const navigate = useNavigate();
  // console.log("props=>", data)
  const [bool, setBool] = useState(false);
  const [Loading, setLoading] = useState(false)
  const token= localStorage.getItem('hotel_admin_tkn')
  const deleteroom = (id) => {
    confirmAlert({
      // title: 'Delete',
      message: 'Do you want to delete room ?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            setLoading(true)

            let { data } = await axios.delete(REACT_APP_SERVER_URL+"/api/VendorRoom/DeleteVendorRoomById?RoomId="+id ,{
              headers: {"Authorization" : `Bearer ${token}`}
        
            }).then((response) => {
              // Swal.fire({
              //   icon: 'success',
              //   text: 'Room Deleted successfully!',
              //   showConfirmButton: false,
              //   timer: 2000
              // })
              window.location.reload()
            })
            .catch(err => { if(err.request){ console.log(err.request) } if(err.response)
                { 
                console.log(err.response)
                } });

            setLoading(false)

            if (data.status == 1) {
              toast.success(data.message)
              // console.log("data.message",data.message)
              Listing();

            }
            else {
              toast.error(data.message)
            }

            setBool(!bool)
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color != "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " + "text-blueGray-700"
                  // (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                ROOMS LIST
              </h3>
            </div>


          </div>

        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
              <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  SI.No
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Room code
                </th>
                {/* <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  ROOM MODULE
                </th> */}
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Room Count
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Room Price
                </th>

                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Service Charge
             
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Room Type
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Status
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Action
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                ></th>
              </tr>
            </thead>
            {dataRecord === 0 ? <tbody>
              <tr className="p-6 text-xs font-bold ">
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"></td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"></td>

                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">No data available in table</td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"></td>
              </tr>
            </tbody> :
            <tbody>
              
              {data.map((item, index) => {
             

                return (


                  <tr key={index}>
                     <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      #{index+1}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {item.roomCode}
                    </td>
                    {/* <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">

                      <span
                        className={
                          "ml-3 font-bold " +
                          +(color === "light" ? "text-blueGray-600" : "text-white")
                        }
                      >
                      
                      </span>
                    </th> */}
                    
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {item.roomCount}
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {item.roomPrice
}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {item.serviceChargeValue}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

                      {item.roomType}
                    </td>
                    <td className={item.roomStatus== "1" ? "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-orange-500 font-semibold" : "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-pink-400"}>
                      {item.roomStatus == "1" ? "Active" : "Inactive"}
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <i className="fa fa-fw fa-eye"
                          onClick={() => navigate('/view_room/' + item.roomId )}
                          style={{
                            float: "right",
                            color: "rgb(248 218 33)",
                            fontSize: "15px",
                            cursor: "pointer",
                            marginRight: "1rem"
                          }}></i>
                        <i className="fa fa-fw fa-pen"
                          onClick={() => navigate('/update_room/' + item.roomId)}
                          style={{
                            float: "right",
                            color: "#12C412",
                            fontSize: "15px",
                            cursor: "pointer",
                            marginRight: "1rem"
                          }}></i>
                        <i className="fa fa-fw fa-trash"
                          onClick={() => deleteroom(item.roomId)}
                          style={{
                            float: "right",
                            color: "red",
                            fontSize: "15px",
                            cursor: "pointer",
                            marginRight: "1rem"
                          }}></i>
                        {/* <AdsDropdown id={item.couponId}/> */}

                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
}
          </table>
        </div>
        <>
          <Toaster />
        </>
      </div>
    </>
  );
}
export default RoomTable
