import React, { useState, useEffect,useContext } from "react";
import AdminNavbar from "../../Components/Navbars/AdminNavbar.js";
import Sidebar from "../../Components/Sidebar/Sidebar.js";
import { useNavigate, useParams } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { AppContext } from "../../App";
import CommonNav from "../../Components/Navbars/CommonNav";
import { Pagination } from '@mui/material';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import RoomTable from "../../Components/HotelTables/RoomTable";
const { REACT_APP_SERVER_URL } = process.env;
const { REACT_APP_AUTH_SERVER } = process.env;
const RoomList = () => {
  const user = useContext(AppContext);
  const HotelId=localStorage.getItem('hotel_id')
  const token= localStorage.getItem('hotel_admin_tkn')
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [limitPage, setLimitPerPage] = useState(1);
  const [addUser, setAddUser] = useState(false);
  const [room, setRoom] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [dataRecord, setDataRecord] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [roomTypeList, setroomTypeList] = useState([]);
  const [filter, setFilter] = useState({
    roomCode: "", roomType: "",
    roomStatus: ""
  })
  useEffect(() => {
    HotelView()
    roomListing()
    roomTypeListing();
    user.setIsopenHotel(true)
  }, [])
  const roomTypeListing = async () => {
    await axios({
      url: REACT_APP_SERVER_URL + "/api/CommonMaster/GetHotelRoomTypeList",
      method: 'GET',
      headers: {"Authorization" : `Bearer ${token}`}

    }).then((response) => {
      console.log(response.data,'type');
      if (response.data.status === 1) {
        setroomTypeList(response.data.data);
        setLoading(false)
      }
    })
    .catch(err => { if(err.request){ console.log(err.request) } if(err.response)
        { 
        console.log(err.response)
        setLoading(false)
        } });

      // .catch((error) => {
      //   setLoading(false)
      // })
  }

  const pageSize = 10;
  const roomListing = async (temp) => {
    setLoading(true)
    await axios({
      url: `${REACT_APP_SERVER_URL}/api/Room/GetRoomList?RoomCode=${filter.roomCode}&RoomType=${filter.roomType}&Status=${filter.roomStatus}&Offset=${temp ? temp : 0}&RecordCount=${pageSize}&HotelId=${HotelId}`,
      method: 'GET',
      headers: {"Authorization" : `Bearer ${token}`}


    }).then((response) => {
      if (response.data.status === 1) {
        if (response.data.totalRecords === 0) {
          setLoading(false)
          setDataRecord(response.data.totalRecords)
          setRoom(response.data.data);
          setTotalPages(response.data.totalRecords);
         
        }
        else {
          setDataRecord(response.data.totalRecords)
          setRoom(response.data.data);
          setTotalPages(response.data.totalRecords);
          setLoading(false)
        }
      }
    })

      .catch((error) => {
        toast.error(error.response.data.message)
        setLoading(false)
      })

    // setLoading(false)
  }
  const HotelView = async () => {
    // await axios({
    //   url: REACT_APP_SERVER_URL + "/api/Hotel/GetHotelById?HotelId=" + id,
    //   method: 'GET',

    // }).then((response) => {
    //   if (response.data.status === 1) {
    //     setHotelName(response.data.data[0].hotelName);
    //     setLoading(false)
    //   }
    // })
    //   .catch((error) => {
    //     setLoading(false)
    //   })

    // setLoading(false)
  }
  const roomListingReset = async () => {
    setLoading(true)
    await axios({
      url: `${REACT_APP_SERVER_URL}/api/Room/GetRoomList?RoomCode=&RoomType=&Status=&HotelId=${HotelId}`,
      method: 'GET',
      headers: {"Authorization" : `Bearer ${token}`}
    }).then((response) => {
      console.log(response.data,'list');
      if (response.data.status === 1) {
        if (response.data.totalRecords === 0) {
          setLoading(false)
          setDataRecord(response.data.totalRecords)
          setRoom(response.data.data);
          setTotalPages(response.data.totalRecords);
        }
        else {
          setDataRecord(response.data.totalRecords)
          setRoom(response.data.data);
          setTotalPages(response.data.totalRecords);
          setLoading(false)
        }
      }
    })
      .catch((error) => {
        setLoading(false)
      })
  }
  const changeHandler = (name) => async (event) => {
    setFilter({ ...filter, [name]: event.target.value })

  }
  const handleCanceluser = (e) => {
    setFilter({
      roomCode: "", roomType: "",
      roomStatus: ""
    });
    roomListingReset();

  }
  const changePage = (value) => {
    console.log(value);
    let temp = (value - 1) * 10;
    roomListing(temp);
  };


  const ceil = Math.ceil(totalPages / pageSize);
  const handleAdduser = (e) => {
    navigate("/add_room/" + HotelId);
  }
  return (<>
    <Sidebar />
    <div className="relative md:ml-64 bg-blueGray-100">
      <CommonNav headers={"ROOMS LIST"} />
      <div className="relative md:pt-8 pb-32 pt-8">

        <div className="px-4 md:px-10 mx-auto w-full">
          <div className="w-full lg:w-12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-left text-xl mb-3 font-bold">
                  <small>FILTERS</small>
                </div>
                <div className="relative w-full lg:w-12"
                  id="couponid"
                >
                  <div className="relative w-full lg:w-6/12 mb-3 px-2">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="roomCode"
                    >
                      Room Code
                    </label>
                    <input
                      value={filter.roomCode}
                      type="text"
                      name="roomCode"
                      placeholder='Room Code'
                      onChange={changeHandler("roomCode")}

                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                    />


                  </div>
                  <div className="relative w-full lg:w-6/12 mb-3 px-2">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="roomType"
                    >
                      Room Type
                    </label>
                    <select

                      value={filter.roomType}
                      name="roomType"
                      onChange={changeHandler("roomType")}
                      autoComplete='off'
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    >
                      <option value="">--Select--</option>
                      {roomTypeList.map((i, index) => (
                        <option value={i.name} key={index} >
                          {i.name}
                        </option>
                      ))}
                    </select>
                    {/* <input
                      value={filter.roomType}
                      type="text"
                      name="roomType"
                      placeholder='Room Type'
                      onChange={changeHandler("roomType")}

                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                    /> */}

                  </div>
                  <div className="relative w-full lg:w-6/12 mb-3 px-2">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="roomStatus"
                    >
                      Status
                    </label>
                    <select onChange={changeHandler('roomStatus')}
                      value={filter.roomStatus}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="--Status--"
                      name="roomStatus">
                      <option value="">--All--</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className="relative w-full mb-0 px-2" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="text-center  lg:w-2/12  mt-2 mr-2">
                    <button
                      className="bg-yellow-500 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      // type="submit"
                      style={{ cursor: "pointer" }}
                      onClick={() => roomListing()}
                    >
                      <i className="fa fa-filter mr-2" aria-hidden="true" />
                      FILTER
                    </button>
                  </div>
                  <div className="text-center  lg:w-2/12  mt-2">
                    <button
                      className="bg-lightBlue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      // type="submit"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => handleCanceluser(e)}
                    >

                      RESET
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="flex flex-wrap px-4" id="couponid">
            <div className="text-center flex">
              <div className="text-center mr-2">

                {/* <button
                  className="bg-lightBlue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleAdduser(e)}

                >

                  <i className="fas fa-search mr-2" aria-hidden="true" />
                  Search
                </button> */}
              </div>
              <div className="text-center">
                <h3
                  onClick={() => navigate("/hotels-list")}
                  className={
                    "font-semibold text-xl " + "txt-lightBlue-800 font-bold"
                    // (color === "light" ? "text-blueGray-700" : "text-white")
                  }

                >
                  {hotelName}
                </h3>
              </div>
            </div>
            <div className="text-center">
              <button
                className="bg-lightBlue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
                style={{ cursor: "pointer" }}
                onClick={(e) => handleAdduser(e)}

              >
                <i className="fa fa-plus-circle mr-2" aria-hidden="true" />
                Add New
              </button>
            </div>
          </div>
          <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
              {loading ? <Skeleton count={5} /> :
                <RoomTable data={room}
                  Listing={roomListing}
                  dataRecord={dataRecord} />
              }
              {/* {room.length >= 10 && */}
              <div className="flex flex-wrap mt-2 float-right">
                <Pagination
                  count={ceil}
                  color="primary"
                  variant="outlined"
                  onChange={(e, value) => changePage(value)}
                />
                {/* <Pagination
                    count={limitPage}
                    color="primary"
                    variant='outlined'
                    defaultPage={page}
                    onChange={(e, value) => changePage(value)} /> */}
              </div>

            </div>
          </div>
        </div>
        <div className="relative w-full mb-3 px-2 " id="buttonview">



        <div className="text-center  lg:w-4/12  mt-2 px-2">
            <button
              className="bg-cancel text-white active:bg-cancel-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
              type="button"
              onClick={() => navigate("/hotels-list")}
            >
              BACK
            </button>
          </div>
        </div>

        {/* <FooterAdmin /> */}
      </div>
      <>
        <Toaster />
      </>

    </div>

  </>
  );
}
export default RoomList;
