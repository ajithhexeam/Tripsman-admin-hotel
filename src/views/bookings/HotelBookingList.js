import React, { useState, useEffect,useContext } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar.js";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import CommonNav from "../../Components/Navbars/CommonNav";
import axios from 'axios';
import Swal from 'sweetalert2'
import toast, { Toaster } from 'react-hot-toast';
import { Pagination } from '@mui/material';
import HoteluserTable from "../../Components/HotelTables/HoteluserTable";
import Skeleton from 'react-loading-skeleton'
import { AppContext } from "../../App";
import 'react-loading-skeleton/dist/skeleton.css'
import DatePicker from "react-datepicker";
import HotelBookTable from "../../Components/HotelTables/HotelBookTable";
const { REACT_APP_AUTH_SERVER } = process.env;
const { REACT_APP_SERVER_URL } = process.env;
const HotelBookingList = () => {
  const user = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [addUser, setAddUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limitPage, setLimitPerPage] = useState(1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const token= localStorage.getItem('hotel_admin_tkn');
  const [userList, setUserlist] = useState([]);
  const [userTypeList, setUserTypelist] = useState([])
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const HotelId=localStorage.getItem('hotel_id');
  const [dataRecord, setDataRecord] = useState("");
  const [filter, setFilter] = useState({ BookingNo: "", Mobile: "", Status: "" })
  useEffect(() => {
    console.log(HotelId,'aa');
    userListing();
    user.setIsopenHotel(true)

  }, [])

  const changeHandler = (name) => async (event) => {
    setFilter({ ...filter, [name]: event.target.value })

  }
  console.log(filter,'fil');
  const handleCanceluser = (e) => {
    setFilter({ BookingNo: "", Mobile: "", Status: "" });
    setStartDate(null)
    // userListing();

    userListingReset();

  }

  const pageSize = 10;
  const userListing = async (temp) => {

    setLoading(true)
    let datefrom = "";

    if (startDate) {
      datefrom = moment(startDate).format("YYYY-MM-DD");
    }

    await axios({
      url:`${REACT_APP_SERVER_URL}/api/HotelVendorBooking/GetHotelVendorBookingList?BookingNo=${filter.BookingNo}&BookingDate=${datefrom}&Offset=${temp ? temp : 0}&RecordCount=${pageSize}&PaymentDate=&Phoneno=${filter.Mobile}&IsCancelled=${filter.Status}`,
      method: 'GET',
      headers: {
        "Authorization" : `Bearer ${token}`,
        "HotelId":`${HotelId}`
      }

    }).then((response) => {
      console.log(response.data.data,'list');

      if (response.data.status == 1) {
        if (response.data.totalRecords === 0) {
          setDataRecord(response.data.totalRecords)
          setUserlist(response.data.data);
          setTotalPages(response.data.totalRecords);
          setLoading(false)
          // toast.error("No matching data found")
        }
        else {
          setDataRecord(response.data.totalRecords)
          setUserlist(response.data.data);
          setTotalPages(response.data.totalRecords);
          setLoading(false)
        }
      }
    })

      .catch((error) => {
        // console.log(error)
        toast.error('Something went wrong')
        setLoading(false)
        console.log(error.data,'error');
      })

    setLoading(false)


  }
  const userListingReset = async () => {
    setLoading(true)
    await axios({
    url:`${REACT_APP_SERVER_URL}/api/HotelVendorBooking/GetHotelVendorBookingList?BookingNo=&BookingDate=&Offset=0&RecordCount=${pageSize}&PaymentDate=&Phoneno=&IsCancelled=`,
      method: 'GET',
      headers: {
        "Authorization" : `Bearer ${token}`,
        "HotelId":`${HotelId}`
      }


    }).then((response) => {

      if (response.data.status == 1) {
        if (response.data.totalRecords === 0) {
          setDataRecord(response.data.totalRecords)
          setUserlist(response.data.data);
          setTotalPages(response.data.totalRecords);
          setLoading(false)
          // toast.error("No matching data found")
        }
        else {
          setDataRecord(response.data.totalRecords)
          setUserlist(response.data.data);
          setTotalPages(response.data.totalRecords);
          setLoading(false)
        }
      }
    })

      .catch((error) => {
        setLoading(false)
      })

    setLoading(false)


  }
  const changePage = (value) => {
    console.log(value);
    let temp = (value - 1) * 10;
    userListing(temp);
  };

  function preventOtherCharactersFromNumberInputlimit(evt) {
    if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
      //  || evt.target.value.length == 20) {
        evt.preventDefault();
    }
}
  const ceil = Math.ceil(totalPages / pageSize);
  const handleAdduser = (e) => {

    navigate("/hotel-booking-add");
  }
  return (<>
    <Sidebar />
    <div className="relative md:ml-64 bg-blueGray-100">
      <CommonNav headers={"HOTEL BOOKINGS"} />

      {/* Header */}
      {/* <HeaderStats /> */}
      <div className="relative md:pt-8 pb-32 pt-8">
        {/* <div className="relative md:pt-32 pb-32 pt-12"> */}

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
                      htmlFor="name"
                    >
                      Booking No
                    </label>
                    <input
                      onChange={changeHandler('BookingNo')}
                      value={filter.BookingNo}
                      name="BookingNo"
                      type="text"
                      autoComplete="off"
                      placeholder="Booking No"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                  </div>
                  <div className="relative w-full lg:w-6/12 mb-3 px-2">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="Mobile"
                    >
                      Mobile
                    </label>
                    <input
                      value={filter.Mobile}
                      type="text"
                      name="Mobile"
                      placeholder='Mobile'
                      onChange={changeHandler("Mobile")}
                      onKeyPress={preventOtherCharactersFromNumberInputlimit}
                      autoComplete="off"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                    />

                  </div>


                  <div className="relative w-full lg:w-6/12 mb-3 px-2">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="name"
                    >
                      Booking Date
                    </label>
                    <DatePicker
                      isClearable
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Booking Date"
                      selected={startDate}
                      onChange={date => setStartDate(date)}
                      selectsStart // tells this DatePicker that it is part of a range*
                      startDate={startDate}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />

                  </div>
                  
                  <div className="relative w-full lg:w-6/12 mb-3 px-2">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="Status"
                    >
                     Booking Status
                    </label>
                    <select value={filter.Status} onChange={changeHandler('Status')}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Booking Status"
                      name="Status">
                      <option value="">--All--</option>
                      <option value="0">Confirmed</option>
                      <option value="1">Cancelled</option>
                    </select>
                  </div>


                </div>

                <div className="relative w-full mb-0 px-2" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="text-center  lg:w-2/12  mt-2 mr-2">
                    <button
                      className="bg-yellow-500 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      // type="submit"
                      style={{ cursor: "pointer" }}
                      onClick={() => userListing()}
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
          <div className="flex flex-wrap px-4" id="couponid">
            <div className="text-center flex">
              <div className="text-center mr-2">
              </div>
              <div className="text-center">
              </div>
            </div>
            <div className="text-center">
              {/* <button
                className="bg-lightBlue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
                style={{ cursor: "pointer" }}
               onClick={(e) => handleAdduser(e)}

              >
                <i className="fa fa-plus-circle mr-2" aria-hidden="true" />
                Add New
              </button> */}
            </div>
          </div>




          <div className="flex flex-wrap mt-4">

            <div className="w-full mb-12 px-4">
              {loading ? <Skeleton count={5} /> :
                <HotelBookTable data={userList} Listing={userListing} dataRecord={dataRecord} />}

              <div className="flex flex-wrap float-right">
                <Pagination
                  count={ceil}
                  color="primary"
                  variant="outlined"
                  onChange={(e, value) => changePage(value)}
                />
                {/* {userList.length >= 10 ? <Pagination

                  count={limitPage}
                  color="primary"
                  variant='outlined'
                  defaultPage={page}


                  onChange={(e, value) => changePage(value)} /> : <></>} */}
              </div>
            </div>
          </div>
        </div>

        {/* <FooterAdmin /> */}
      </div>

    </div>

  </>
  );
}
export default HotelBookingList;
