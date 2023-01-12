import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import Sidebar from "../../Components/Sidebar/Sidebar.js";
import CommonNav from '../../Components/Navbars/CommonNav';
import { useNavigate, useParams,useLocation } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Pagination } from '@mui/material';
import 'react-tabs/style/react-tabs.css';
import toast, { Toaster } from 'react-hot-toast'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import RoomTableview from '../../Components/HotelTables/RoomTableview';
import Hoteltblview from '../../Components/HotelTables/Hoteltblview';
import Swal from 'sweetalert2';
const { REACT_APP_AUTH_SERVER } = process.env;
const { REACT_APP_SERVER_URL } = process.env;
const HotelViewBookingHistory = () => {
   const location = useLocation();
    const [bookid, setBookidIds] = useState(location.state.bookid)
    const [paymentid, setPaymentId] = useState(location.state.payid)
     const { id } = useParams();
    const navigate = useNavigate();
    const [bool, setBool] = useState(false);
    const [Loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
    const [Hoteldata, setHoteldata] = useState([])
    const [otherguestdata, setguestdata] = useState([])
    const [Roomdata, setRoomdata] = useState([])
    const [images, setImages] = useState("")
    const [bookingId, setBookingId] = useState("")
    const [customerId, setCustomerId] = useState("")
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(10);
    let hotelheadings = ["ORDER NO", "ORDER DATE", "ORDER AMOUNT", "ORDER TYPE", "STATUS"];
    const [activeModule, setActiveModule] = useState("HTL");
    const HotelId=localStorage.getItem('hotel_id');
    const token= localStorage.getItem('hotel_admin_tkn');
    

    const {
        register,
        formState: { errors, isValid, isDirty },
        handleSubmit,
        getValues,
        setValue,
        setFocus,
        values,
        trigger,
    } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
    });
    useEffect(() => {
        CustomerView()
        },[])
    const CustomerView = async () => {
        await axios({
            url: REACT_APP_SERVER_URL + "/api/HotelVendorBooking/GetHotelVendorBookingById?BookingId=" + bookid,
            method: 'GET',
            headers: {
                "Authorization" : `Bearer ${token}`,
                "HotelId":`${HotelId}`
              }
        
        }).then((response) => {
            if (response.data.status === 1) {

                console.log("data=>.>>", response.data.data)
                let booking_date = moment(response.data.data[0].booking_date).format('DD/MM/YYYY');
                let booking_from = moment(response.data.data[0].booking_from).format('DD/MM/YYYY');
                let booking_to = moment(response.data.data[0].booking_to).format('DD/MM/YYYY');
                setHoteldata(response.data.data[0].hoteldetails)
                setBookingId(response.data.data[0].booking_id);
                setCustomerId(response.data.data[0].customerId);
                setguestdata(response.data.data[0].hotelguest);
                const rows = response.data.data[0].roomdetails
                var num = 1
                const rowss = []
                rows.forEach((el)=>{      
                  rowss.push(
                    el['roomCode']       
                  )
                  num = num+1;  
                })
                setRoomdata(rowss)
                setStatus(response.data.data[0].is_cancelled)
                setValue("booking", {
                    booking_no: response.data.data[0].booking_no,
                    booking_date: booking_date,
                    total_amount: response.data.data[0].total_amount,
                    booking_from: booking_from,
                    booking_to: booking_to,
                    customer_code: response.data.data[0].customer_code,
                    customer_name: response.data.data[0].customer_name,
                    aR_Customername: response.data.data[0].aR_Customername,
                    service_charge: response.data.data[0].customer_name,
                    tax: response.data.data[0].tax,
                    discount: response.data.data[0].discount,
                    total_amount: response.data.data[0].total_amount,
                    total_charge: response.data.data[0].total_charge,
                    total_guest: response.data.data[0].total_guest,
                    total_price: response.data.data[0].total_price,
                    rating: response.data.data[0].rating,
                    review: response.data.data[0].review,
                    hotelguest: response.data.data[0].hotelguest,
                    primary_guest: response.data.data[0].primary_guest,
                    email_id: response.data.data[0].email_id,
                    age: response.data.data[0].age,
                    gender: response.data.data[0].gender,


                });
                setLoading(false)
            }
        })

            .catch((error) => {
                // console.log(error)
                //   toast.error('Something went wrong')
                setLoading(false)
            })

        setLoading(false)
    }
    const changePage = (value) => {
        setPage(value);

    }
   
    return (<>
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
            <CommonNav headers={"VIEW BOOKINGS"} />
            {/* Header */}
            {/* <HeaderStats /> */}
            <div className="relative md:pt-8 pb-32 pt-8">
                {/* <div className="relative md:pt-32 pb-32 pt-12"> */}
                {/* {!addUser ? <> */}
                <div className="px-4 md:px-10 mx-auto w-full">
                    <div className="px-4 md:px-10 mx-auto w-full">
                        <div className="container mx-auto px-4 h-full w-full ">
                            <div className="flex content-center items-center justify-center h-full">
                                <div className="w-full px-4">
                                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                                    {/* Booking Details primary*/}
                                        <div className="flex-auto px-4 lg:px-10 py-10 pt-2">
                                            <div className="text-blueGray-400 text-center text-xl mb-3 font-bold">
                                                <small>VIEW BOOKINGS</small>
                                            </div>
                                            <form>
                                                <div className="relative w-full lg:w-12" id="couponid">
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="booking_no">
                                                            Booking No
                                                        </label>
                                                        <input
                                                            {...register("booking.booking_no", {
                                                                required: true,

                                                            })}
                                                            disabled
                                                            name='customercode'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />

                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_date"
                                                        >
                                                            BOOKING DATE
                                                        </label>

                                                        <input
                                                            {...register("booking.booking_date", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            name="booking_date "
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                                                            bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative w-full lg:w-12 " id="couponid">
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="total_amount"
                                                        >
                                                            Total Amount
                                                        </label>
                                                        <input
                                                            {...register("booking.total_amount", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            name="total_amount"
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="total_amount"
                                                        >
                                                            Room Details
                                                        </label>
                                                        <input
                                                            value={Roomdata.toString()}
                                                            disabled
                                                            name="total_amount"
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative w-full lg:w-12" id="couponid">
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="booking_from">
                                                            BOOKING FROM
                                                        </label>
                                                        <input
                                                            {...register("booking.booking_from", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            name="booking_from"
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="booking_to">
                                                            BOOKING TO
                                                        </label>
                                                        <input
                                                            {...register("booking.booking_from", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            type="text"
                                                            name="booking_from"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative w-full lg:w-12" id="couponid">
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="customer_code"
                                                        >
                                                            CUSTOMER CODE
                                                        </label>
                                                        <input
                                                            {...register("booking.customer_code", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            type="text"
                                                            name="customer_code"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"/>
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="customer_code"
                                                        >
                                                            CUSTOMER NAME
                                                        </label>
                                                        <input
                                                            {...register("booking.customer_name", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            type="text"
                                                            name="customer_code"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"/>
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="customer_code"
                                                        >
                                                            Status
                                                        </label>
                                                        <input
                                                            value={status===0?'Confirmed':'Cancelled'}
                                                            style={{color:status===0?'green':'red'}}
                                                            disabled
                                                            dir="RTL"
                                                            type="text"
                                                            name="customer_code"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"/>
                                                    </div>
                                                </div>
                                                 {/* End Booking Details primary*/}
                                                 {/* Primary Guest details */}                                                
                                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2 px-2" id="sectionlabel">Guest Details</label>
                                                <div className="relative w-full lg:w-12" id="couponid">
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_no"
                                                        >
                                                            Total Guest(s)
                                                        </label>
                                                        <input
                                                           value={otherguestdata.length===0?1:otherguestdata.length}
                                                            disabled
                                                            name='customercode'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_date"
                                                        >
                                                            Primary Guest
                                                        </label>
                                                        <input
                                                            {...register("booking.primary_guest", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            name="booking_date "
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                                                            bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative w-full lg:w-12" id="couponid">
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_no"
                                                        >
                                                            Contact No
                                                        </label>
                                                        <input
                                                            {...register("booking.booking_no", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            name='customercode'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_date"
                                                        >
                                                            EMAIL ID
                                                        </label>
                                                        <input
                                                            {...register("booking.email_id", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            name="booking_date "
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                                                            bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative w-full lg:w-12" id="couponid">
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_no"
                                                        >
                                                            GENDER
                                                        </label>
                                                        <input
                                                            {...register("booking.gender", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            name="booking_date "
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                                                            bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_date"
                                                        >
                                                            AGE
                                                        </label>

                                                        <input
                                                            {...register("booking.age", {
                                                                required: true,
                                                            })}
                                                            disabled
                                                            name="booking_date "
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                                                            bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                </div>
                                                {/* End primary guest */}
                                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2 px-2"
                                                    id="sectionlabel">Other Guest Details
                                                </label>
                                                <div className="relative w-full lg:w-12"
                                                    id="couponid">
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_date"
                                                        >
                                                            NAME
                                                        </label>
                                                        <input
                                                            disabled
                                                            name="booking_date "
                                                            value={otherguestdata.name?otherguestdata.name:'nil'}
                                                            type="text"
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                                                            bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_no"
                                                        >
                                                            GENDER
                                                        </label>
                                                        <input
                                                            disabled
                                                            name="booking_date "
                                                            type="text"
                                                            value={otherguestdata.gender?otherguestdata.gender:'nil'}
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                                                            bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="booking_date"
                                                        >
                                                            AGE
                                                        </label>
                                                        <input
                                                            disabled
                                                            name="booking_date "
                                                            type="text"
                                                            value={otherguestdata.age?otherguestdata.age:'nil'}
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                                                            bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                
                                                <div className="relative w-full  mb-3 px-2" id="buttonview">
                                                   <div className="text-center  lg:w-4/12  mt-2 px-2">
                                                        <button
                                                            className="bg-cancel text-white active:bg-cancel-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={() => navigate('/booking_history')}
                                                        >
                                                          BACK
                                                        </button>
                                                    </div>


                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <>
                <Toaster />
            </>
        </div>

    </>
    );
}
export default HotelViewBookingHistory;
