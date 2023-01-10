import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import Sidebar from "../../Components/Sidebar/Sidebar.js";
import CommonNav from '../../Components/Navbars/CommonNav';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import Richtexteditor from '../../Components/DraftextEditor/Richtexteditor';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from "react-select";

const { REACT_APP_SERVER_URL } = process.env;
const ViewRoom = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [bool, setBool] = useState(false);
    const [Loading, setLoading] = useState(false)
    const [description, setDescription] = useState("");
    const [optionlist, setoptionList] = useState([]);
    const [fieldvalues, setFieldvalues] = useState({
        Description: EditorState.createEmpty(),
        ar_Description: EditorState.createEmpty(),

    });
    useEffect(() => {
        roomView();
        roomfacilityListing();
        hotelListing();
    }, [])

    const {
        register,
        formState: { errors, isValid, isDirty },
        handleSubmit,
        getValues,
        control,
        setValue,
        setFocus,
        values,
        reset,
        trigger,
    } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
    });

    const [hotelList, sethotelList] = useState([]);
    const [hotelIds, setHotelIds] = useState("");
    const [imageFields, setimageFields] = useState([]);
    const [optionSelected, setoptionSelected] = useState([]);
    const token= localStorage.getItem('hotel_admin_tkn')
    const roomfacilityListing = async () => {
        setLoading(true)
        await axios({
            url: REACT_APP_SERVER_URL + "/api/RoomFacility/GetRoomFacilityList",
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}

        }).then((response) => {
            if (response.data.status === 1) {
                let tempDate = response.data.data.map((option) => {
                    return {
                        ...option, value: option.roomFacilityID, label: option.roomFacilityName
                    };
                });
                setoptionList(tempDate);
                setLoading(false)
            }
        })
        .catch((error) => {
            setLoading(false)
        })
    }
    function preventOtherCharactersFromNumberInput(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    }
    const hotelListing = async () => {
        setLoading(true)
        await axios({
            url: REACT_APP_SERVER_URL + "/api/Hotel/GetHotelList",
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}
        }).then((response) => {
            if (response.data.status === 1) {
                sethotelList(response.data.data);
                setLoading(false)
            }
        })
        .catch((error) => {
            setLoading(false)
        })
    }    
    const roomView = async () => {
        await axios({
            url: REACT_APP_SERVER_URL + "/api/VendorRoom/GetViewVendorRoomById?RoomId=" + id,
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}

        }).then((response) => {
            console.log(response.data,'response');
            if (response.data.status === 1) {
                setValue("room", {
                    hotelId: response.data.data.hotelId,
                    roomCode: response.data.data.roomCode,
                    roomCount: response.data.data.roomCount,
                    roomFacilities: response.data.data.roomFacilities,
                    roomId: response.data.data.roomId,
                    roomImage: response.data.data.roomImage,
                    roomPrice: response.data.data.roomPrice,
                    roomStatus: response.data.data.roomStatus,
                    roomType: response.data.data.roomType,
                    serviceChargeValue: response.data.data.serviceChargeValue,

                });
                setimageFields(response.data.data.roomImage)

                let tempDate = response.data.data.roomFacilities.map((option) => {
                    return {
                        ...option, value: option.roomFacilityID, label: option.roomFacilityName
                    };
                });
                setoptionSelected(tempDate);
                setHotelIds(response.data.data.hotelId)
              
                setFieldvalues({
                    ...fieldvalues,
                    Description: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(response.data.data.roomDescription ? response.data.data.roomDescription : ""))),
                    ar_Description: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(response.data.data.aR_Description ? response.data.data.aR_Description : ""))),
                })
                setLoading(false)
            }
        })
        .catch((error) => {
            setLoading(false)
        })
        setLoading(false)
    }
    console.log(imageFields,'img');
    return (<>
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
            <CommonNav headers={"VIEW ROOMS"} />

            {/* Header */}
            {/* <HeaderStats /> */}

            <div className="relative md:pt-8 pb-32 pt-8">
                {/* {!addUser ? <> */}
                <div className="px-4 md:px-10 mx-auto w-full">


                    <div className="px-4 md:px-10 mx-auto w-full">
                        <div className="container mx-auto px-4 h-full w-full ">
                            <div className="flex content-center items-center justify-center h-full">
                                <div className="w-full px-4">
                                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">

                                        <div className="flex-auto px-4 lg:px-10 py-10 pt-2">
                                            <div className="text-blueGray-400 text-center text-xl mb-3 font-bold">
                                                <small>VIEW ROOMS</small>
                                            </div>
                                            <form>
                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="hotelId"
                                                        >
                                                            Hotel Name
                                                            {/* <span className="asterisk">*</span> */}
                                                        </label>
                                                        <select
                                                            {...register("room.hotelId", {
                                                                required: "select one option",


                                                            })}
                                                            value={hotelIds}
                                                            // onChange={(e) => setValue("room.hotelId", e.target.value)}
                                                            placeholder="Select Hotel"
                                                            autoComplete='off'
                                                            disabled
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        >

                                                            {hotelList.map((i, index) => (
                                                                <option value={i.hotelId} key={index} >
                                                                    {i.hotelName}
                                                                </option>
                                                            ))}
                                                        </select>

                                                    </div>

                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="roomCode"
                                                        >
                                                            Room Code
                                                        </label>
                                                        <input
                                                            // {...register("room.roomCode", {
                                                            //     // required: true,

                                                            // })}
                                                            {...register("room.roomCode", {


                                                            })}

                                                            disabled
                                                            type="text"
                                                            name="roomCode"
                                                            placeholder='Room Code'
                                                            // autoComplete='off'

                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />

                                                    </div>
                                                </div>
                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="roomType"
                                                        >
                                                            Room Type
                                                        </label>
                                                        <input
                                                            {...register("room.roomType", {
                                                                required: true,


                                                            })}
                                                            disabled
                                                            type="text"
                                                            name="RoomType"
                                                            placeholder='Room Type'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />

                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="roomPrice"
                                                        >
                                                            Room Price
                                                        </label>
                                                        <input
                                                            {...register("room.roomPrice", {
                                                                required: true,
                                                                // onBlur: () => {
                                                                //     handleSubmit(handleSubmitForm());
                                                                //     // setEditInput("");
                                                                // },


                                                            })}
                                                            disabled
                                                            type="number"
                                                            onKeyPress={preventOtherCharactersFromNumberInput}
                                                            name="roomPrice"
                                                            placeholder='Room Price'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />

                                                    </div>


                                                </div>


                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    {fieldvalues.Description &&
                                                        <div className="relative w-full lg:w-6/12 mb-3 px-2" id="viewRichtext">
                                                            <label
                                                                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                                htmlFor="description"
                                                            >
                                                                Room Description
                                                            </label>

                                                            <Richtexteditor
                                                                data={fieldvalues.Description}
                                                            // onEditorStateChange={onEditorStateChange("address")}

                                                            />
                                                            

                                                        </div>
                                                    }
                                                    {fieldvalues.ar_Description &&
                                                        <div className="relative w-full lg:w-6/12 mb-3 px-2" id="viewRichtext">
                                                            <label
                                                                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                                htmlFor="RoomDescription"
                                                            >
                                                                Room Description(Arabic)
                                                                {/* <span className="asterisk">*</span> */}
                                                            </label>
                                                            <Richtexteditor
                                                            dir={true}
                                                                data={fieldvalues.ar_Description}
                                                            // onEditorStateChange={onEditorStateChange("address")}

                                                            />
                                                            
                                                        </div>
                                                    }
                                                </div>
                                                <div className="relative w-full lg:w-12 mb-3 px-2" id="multiselectview">
                                                    <label
                                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                        htmlFor="Facility"
                                                    >
                                                        Room Amenities
                                                    </label>
                                                    <Select
                                                        {...register("Applicablemodules", {
                                                            // required: "Room amenities is required"
                                                        })}
                                                        disabled
                                                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white 
                                                        rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear 
                                                        transition-all duration-150"
                                                        value={optionlist.filter(function (v) {
                                                            return optionSelected.filter(function (v2) {
                                                                return (v.label === v2.label);
                                                            }).length > 0;
                                                        })}

                                                        defaultValue={optionSelected}
                                                        // onChange={value => handleoptionselected(value)}
                                                        // onChange={setoptionSelected}
                                                        options={optionlist}
                                                        isMulti
                                                    />
                                                   

                                                </div>
                                                {imageFields.length > 0 &&
                                                    <div className="relative w-full lg:w-12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="image"
                                                        >
                                                            Image
                                                        </label>

                                                        <div className="relative w-full lg:w-12  bg-view-color mb-3 px-2" id="buttonview">
                                                            {/* <div className="relative w-full lg:w-12 mb-3 bg-view-color rounded" id="buttonview"> */}
                                                            {imageFields.map((image, index) => (
                                                                <div key={index} className="mb-2">
                                                                    <button
                                                                        type="button"
                                                                        className="modal-close-icon"
                                                                    // onClick={(e) => handleEditClose(e, index)}
                                                                    >
                                                                        <i className="far fa-times-circle"></i>
                                                                    </button>
                                                                    <img className="px-2" src={image.roomImage} id="imagePreview" alt="" width={'70px'} height={'50px'} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                }
                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="RoomCount"
                                                        >
                                                            Room Count
                                                        </label>
                                                        <input
                                                            {...register("room.roomCount", {
                                                                required: true,


                                                            })}
                                                            disabled
                                                            type="number"
                                                            onKeyPress={preventOtherCharactersFromNumberInput}
                                                            name="RoomCount"
                                                            placeholder='Room Count'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />


                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="serviceChargeValue"
                                                        >
                                                            Service Charge Value
                                                        </label>
                                                        <input
                                                            {...register("room.serviceChargeValue", {
                                                                required: true,



                                                            })}
                                                            disabled
                                                            type="number"
                                                            onKeyPress={preventOtherCharactersFromNumberInput}
                                                            name="serviceChargeValue"
                                                            placeholder='Service Charge Value'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />



                                                    </div>


                                                </div>
                                                <div className="relative w-full lg:w-12" id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="roomStatus"
                                                        >
                                                            Status
                                                        </label>
                                                        <select
                                                            disabled
                                                            name="status"
                                                            type="text"
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        >
                                                            {/* <option value="">--Select--</option> */}
                                                            <option value="1">Active</option>
                                                            <option value="0">Inactive</option>

                                                        </select>

                                                    </div>
                                                </div>

                                                <div className="relative w-full mb-3 px-2 " id="buttonview">


                                                    
                                                    <div className="text-center  lg:w-4/12  mt-2 px-2">
                                                        <button
                                                            className="bg-cancel text-white active:bg-cancel-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={() =>navigate('/rooms')}
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

        </div>

    </>
    );
}
export default ViewRoom;
