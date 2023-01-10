import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import AdminNavbar from "../../Components/Navbars/AdminNavbar.js";
import Sidebar from "../../Components/Sidebar/Sidebar.js";
import CommonNav from '../../Components/Navbars/CommonNav';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Richtexteditor from '../../Components/DraftextEditor/Richtexteditor';
import Select from "react-select";
import { Oval } from "react-loader-spinner";
import { ErrorMessage } from '@hookform/error-message';
const { REACT_APP_SERVER_URL } = process.env;
const AddRooms = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        formState: { errors, isValid, isDirty },
        handleSubmit,
        getValues,
        control,
        setValue,
        setFocus,
        reset,

        setError,
        clearErrors,
        values,
        trigger,
    } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
    });
     console.log("errrrrr", errors)

    const [fieldvalues, setFieldvalues] = useState({
        Description: "",
        ar_Description: "",
    })
    const [files, setFiles] = useState("");
    const [imageFields, setimageFields] = useState([]);
    const [optionlist, setoptionList] = useState([]);
    const [optionSelected, setoptionSelected] = useState([]);
    const [hotelName, setHotelName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingImg, setLoadingImg] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [hotelList, sethotelList] = useState([]);
    const [FaciltyError, setFacilityError] = useState("");
    const [validateError, setValidateError] = useState({ image: "" });
    const [roomTypeList, setroomTypeList] = useState([]);
    const token= localStorage.getItem('hotel_admin_tkn')
    const [editorError, setEditorError] = useState(false);
    const [serviceCharge, setService] = useState("")
    const [fsubmit, setFsubmit] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isFocused1, setIsFocused1] = useState(false);
    const [customerror, setCustomerror] = useState({ image: "", startDate: "", endDate: "" })
    useEffect(() => {
        HotelView()
        roomfacilityListing();
        roomTypeListing();
        setValue("room", { hotelName: id })

    }, [])
    const HotelView = async () => {
        await axios({
            url: REACT_APP_SERVER_URL + "/api/Hotel/GetHotelById?HotelId=" + id,
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}

        }).then((response) => {
            if (response.data.status === 1) {
                setHotelName(response.data.data[0].hotelName);
                setService(response.data.data[0].serviceChargeValue)
                setLoading(false)
            }
        })
            .catch((error) => {
                setLoading(false)
            })

        setLoading(false)
    }
    const roomTypeListing = async () => {
        setLoading(true)
        await axios({

            url: REACT_APP_SERVER_URL + "/api/CommonMaster/GetHotelRoomTypeList",
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}


        }).then((response) => {
            if (response.data.status === 1) {
                setroomTypeList(response.data.data);
                setLoading(false)
            }
        })

            .catch((error) => {
                setLoading(false)
            })
    }

    const roomfacilityListing = async () => {
        setLoading(true)
        await axios({

            url: REACT_APP_SERVER_URL + "/api/RoomFacility/GetRoomFacilityList",
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}


        }).then((response) => {
            if (response.data.status === 1) {
                //  setoptionList(response.data.data);
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
                // console.log(error)

                setLoading(false)
            })
    }


    const changeHandler = (name) => async (event) => {
        setFieldvalues({ ...fieldvalues, [name]: event.target.value })

    }
    const onEditorStateChange = (name) => (editorState) => {
        if (name === "Description") {
            let edit = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            if (!edit || edit == "<p></p>\n") {
                setFieldvalues({ ...fieldvalues, [name]: "" });
            } else {

                setFieldvalues({ ...fieldvalues, [name]: edit });

            }
        } else if (name === "ar_Description") {
            let edit = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            if (!edit || edit == "<p></p>\n") {
                setFieldvalues({ ...fieldvalues, [name]: "" });
            } else {
                setFieldvalues({ ...fieldvalues, [name]: edit });


            }
        }

    }
    const onError = (errors, e) => {
        setFsubmit(true);
        if (errors || fieldvalues.Description.length === 0) {
            setEditorError(true);
        } else if (errors || fieldvalues.ar_Description.length === 0) {
            setEditorError(true);
        }
    };
   
    const handleBackForm = (e) => {
        navigate('/rooms')
    }
    const changeHandler1 = (name) => async (event) => {
        if (name === 'category') {
            setSelectedCategory(event);

        }
    }
    function preventOtherCharactersFromNumberInput(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    }
    
    const handleChangeImage = async (e) => {
        try {
            setLoadingImg(true)
            // let imageFile = "";
            const imageFile = e.target.files[0]
            setFiles(e.target.files[0]);
            const formData = new FormData();

            // console.log("file=>>>>",e.target.files[0])
            if (imageFile != '') {
                if (imageFile.size < 2097152) {
                    setValue("Displayimage", e.target.files[0])
                    // file type validation
                    if ((imageFile.type == 'image/jpeg') ||
                        (imageFile.type == 'image/jpg') ||
                        (imageFile.type == 'image/png')) {

                        formData.append('file', imageFile);
                        formData.append('type_name', "customer");
                        await axios({
                            url: REACT_APP_SERVER_URL + "/api/FileUpload/FTPUpload",

                            method: 'POST',


                            data: formData,
                            headers: {"Authorization" : `Bearer ${token}`}
                        }
                        ).then((response) => {
                            setimageFields([...imageFields,
                            {
                                Id: 0, ImageUrl: response.data.data.url, Status: response.data.status
                            }

                            ])
                            // setuploadFiles(response.data.data.url);
                            toast.success("Image upload success");
                            setValue("Displayimage", response.data.data.url)
                            setCustomerror({ image: "" })
                            setLoadingImg(false)


                        })
                            .catch((error) => {
                                // console.log(error)
                                setLoadingImg(false)

                            })

                    } else {

                        setCustomerror({ image: "Please choose a photo" })
                        return setLoadingImg(false)
                    }

                } else {

                    setCustomerror({ image: "Please choose a file with size less than 2mb " })
                    return setLoadingImg(false)
                }
            } else {
                setCustomerror({ image: "Image is required" })

                return setLoadingImg(false)
            }
            // setLoading(true)

        } catch (error) {

        }


    }
    const handleEditClose = (e, index) => {

        const list = [...imageFields];
        list.splice(index, 1);
        setimageFields(list);
        if (imageFields.length < 0) { 
            setValue("Displayimage", "") 
            // setimageFields([])
            // setLoadingImg(false)
        }

    }
    const handleOptionSelected = (val) => {

        if (val.length == 0) {
            setFacilityError("Select one option")
        }
        else {
            setFacilityError("")
            setoptionSelected(val)

        }

    }
   
   
    function preventOtherCharactersFromNumberInputlimit(evt) {
        if (
            evt.target.value.lenth == 20
          ) {
            evt.preventDefault();
          }
    }
    const preventNegativeValues = (e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
    function preventOtherCharactersFromNumberInputcount(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57 || evt.target.value.length == 4) {
            evt.preventDefault();
        }
    }
    const handleSubmitForm = async (data) => {
        if (!fieldvalues.Description || !fieldvalues.ar_Description) {
            setFsubmit(true);
            return;
        }
        let facilitylisttemp = optionSelected.map((option) => {

            return { Id: option.roomFacilityID, FacilityId: option.roomFacilityID, Status: 1 };
        });
        console.log(imageFields,'imageFieldsaaaa');
        await axios({
            url: REACT_APP_SERVER_URL + "/api/Room/CreateRoom",
            method: 'POST',
            headers: {"Authorization" : `Bearer ${token}`},
            data: {
                HotelId: parseInt(id),
                RoomCode: getValues().RoomCode,
                RoomType: getValues().RoomType,
                RoomDescription: fieldvalues.Description,
                AR_RoomDescription: fieldvalues.ar_Description,
                RoomPrice: parseInt(getValues().RoomPrice),
                RoomCount: parseInt(getValues().RoomCount),
                ServiceChargeValue: parseInt(serviceCharge),
                Status: parseInt(getValues().status),
                Facility: facilitylisttemp,
                Image: imageFields,
                RoomId: 0,
            },
        }
        ).then((response) => {
            // console.log("addd ads",response.data)
            if (response.data.status === 1) {
                toast.success("Room added successfully")
                navigate('/rooms')
                //   window.location.reload();
            }
            else {
                toast.error(response.data.message)
                //   window.location.reload();   
            }

        })
            .catch((error) => {
                toast.error(error.response.data.message)

            })
        // }

    }
    const handleReset = () => {
        reset();
        setFieldvalues({
            Description: EditorState.createEmpty(),
            ar_Description: EditorState.createEmpty(),

        })
        setimageFields([])
        setoptionSelected([])
    }
    // past date disable
    const handleoptionselected = (value) => {

        setoptionSelected(value);
        setValue("Applicablemodules", value)

    }
    const disablePastDate = () => {
        const today = new Date();
        const dd = String(today.getDate() + 1).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    };
    const handleMultiChange = selectedOption => {
        setValue("platform", selectedOption.value);
    };
    console.log(imageFields,'imageFields');
    return (<>
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
            <CommonNav headers={"ADD NEW ROOMS"} />

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
                                                <small>ADD NEW ROOMS</small>
                                            </div>

                                            <form
                                                onSubmit={handleSubmit(handleSubmitForm, onError)}
                                            >
                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="room.hotelName"
                                                        >
                                                            Hotel Name<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            value={hotelName}
                                                            disabled
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                            placeholder="Select Hotel"
                                                            autoComplete='off'
                                                        // className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"



                                                        />



                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="RoomCode"
                                                        >
                                                            Room Code<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            {...register("RoomCode", {
                                                                required: true,



                                                            })}
                                                            maxLength={20}
                                                            type="text"
                                                            name="RoomCode"
                                                            placeholder='Room Code'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />
                                                        {errors.RoomCode?.type == "required" && (
                                                            <span className="error">Room code is required</span>
                                                        )}

                                                    </div>



                                                </div>
                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="RoomType"
                                                        >
                                                            Room Type<span className="asterisk">*</span>
                                                        </label>
                                                        <select
                                                            {...register("RoomType", {
                                                                required: "Room type is required",


                                                            })}
                                                            name="RoomType"
                                                            placeholder="--Select--"
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
                                                        {errors.RoomType?.type == "required" && (
                                                            <span className="error">Room type is required</span>
                                                        )}

                                                    </div>

                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="RoomPrice"
                                                        >
                                                            Room Price<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            {...register("RoomPrice", {
                                                                required: true,



                                                            })}
                                                            // maxLength={2}
                                                            type="number"
                                                            onKeyDown={preventNegativeValues}
                                                            onKeyPress={preventOtherCharactersFromNumberInputlimit}
                                                            // onKeyPress={preventOtherCharactersFromNumberInputlimit}
                                                            name="RoomPrice"
                                                            placeholder='Room Price'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />
                                                        {errors.RoomPrice?.type == "required" && (
                                                            <span className="error">Room price is required</span>
                                                        )}

                                                    </div>



                                                </div>
                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="RoomDescription"
                                                        >
                                                            Room Description<span className="asterisk">*</span>
                                                        </label>
                                                        <Editor
                                                           
                                                            placeholder='Room Description'
                                                            toolbarClassName={isFocused1 ? "" :"toolbarClassName" }
                                                            required
                                                            EditorState={fieldvalues.Description}
                                                         
                                                            wrapperClassName="wrapperClassName"
                                                            editorClassName="editorClassName"
                                                            onEditorStateChange={onEditorStateChange("Description")}
                                                            onFocus={()=> {setIsFocused1(true)}}
                                                            onBlur={()=>{setIsFocused1(false)}}

                                                        />
                                                        {fsubmit && fieldvalues.Description?.length == 0 && (
                                                            <span className="error">
                                                                Room description is required
                                                            </span>
                                                        )}
                                                        


                                                    </div>
                                                    <div className="relative w-full lg:w-12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="RoomDescription"
                                                        >
                                                            Room Description(Arabic)<span className="asterisk">*</span>
                                                        </label>
                                                        <Editor
                                                            textAlignment="right"
                                                            placeholder='Room Description(Arabic)'
                                                            toolbarClassName={isFocused ? "" :"toolbarClassName" }
                                                            EditorState={fieldvalues.ar_Description}
                                                            // toolbarClassName="toolbarClassName"
                                                            onFocus={()=> {setIsFocused(true)}}
                                                            onBlur={()=>{setIsFocused(false)}}
                                                            wrapperClassName="wrapperClassName"
                                                            editorClassName="editorClassName"
                                                            onEditorStateChange={onEditorStateChange("ar_Description")}

                                                        />
                                                        {fsubmit && fieldvalues.ar_Description?.length == 0 && (
                                                            <span className="error">
                                                                Room description (Arabic) is required
                                                            </span>
                                                        )}
                                                       
                                                    </div>
                                                </div>
                                                <div className="relative w-full lg:w-12 mb-3 px-2">

                                                    <label
                                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                        htmlFor="Facility"
                                                    >
                                                        Room Amenities<span className="asterisk">*</span>
                                                    </label>
                                                    <Select

                                                        {...register("Applicablemodules", {
                                                            required: "Room amenity is required"
                                                        })}
                                                        name="Applicablemodules"
                                                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white 
                                                         rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear 
                                                transition-all duration-150"
                                                        value={optionSelected}
                                                        onChange={value => handleoptionselected(value)}
                                                        // onChange={(val)=>handleOptionSelected(val)}
                                                        // onChange={setoptionSelected}
                                                        options={optionlist}
                                                        isMulti
                                                    />
                                                    {optionSelected.length === 0 && <ErrorMessage
                                                        errors={errors}
                                                        name="Applicablemodules"
                                                        render={({ message }) => <span className="error">{message}</span>}
                                                    />}

                                                    {/* {optionSelected.length === 0 && <span className="error">Room facility is required</span>} */}


                                                </div>

                                                <div className="relative w-full lg:w-12 mb-3 px-2">
                                                    <label
                                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                        htmlFor="image"
                                                    >
                                                        Image<span className="asterisk">*(Maximum image size 2mb )</span>
                                                    </label>

                                                    <div className="relative w-full lg:w-12 mb-3 bg-white rounded" id="buttonview">
                                                        {loadingImg ? (
                                                            <Oval
                                                                height={30}
                                                                width={30}
                                                                color="#4fa94d"
                                                                wrapperStyle={{}}
                                                                wrapperClass=""
                                                                visible={true}
                                                                ariaLabel="oval-loading"
                                                                secondaryColor="#4fa94d"
                                                                strokeWidth={2}
                                                                strokeWidthSecondary={2}
                                                            />
                                                        ) : (
                                                            // <i className="fa fa-upload" aria-hidden="true"
                                                            //     id="upload-btn-icon"
                                                            //     {...register("Displayimage", {
                                                            //         required: "Image is required"
                                                            //     })}
                                                            //     onClick={() => handleUploadfile("browseimage")}
                                                            //     // onClick={handleChangeImage}
                                                            // ></i>
                                                            <label htmlFor="file">
                                                                <i className="fa fa-upload" id="upload-btn-icon"></i>
                                                                <input
                                                                    onChange={handleChangeImage}
                                                                    name="image"
                                                                    style={{ display: "none" }}
                                                                    accept="image/*"
                                                                    multiple="" data-original-title="upload photos"
                                                                    type="file" id="file"
                                                                />
                                                            </label>
                                                        )}

                                                        {imageFields.map((image, index) => (
                                                            <div key={index} className="px-2 mb-2">
                                                                <button
                                                                    type="button"
                                                                    className="modal-close-icon"
                                                                    onClick={(e) => handleEditClose(e, index)}
                                                                >
                                                                    <i className="far fa-times-circle"></i>
                                                                </button>
                                                                <img src={image.ImageUrl} id="imagePreview" alt="" width={'70px'} height={'50px'}
                                                                    style={{ cursor: "pointer" }}
                                                                />


                                                            </div>
                                                        ))}
                                                        {/* <input
                                                            onChange={handleChangeImage}
                                                            type="file"
                                                            name="image"
                                                            id="browseimage"
                                                            style={{ display: "none" }}
                                                            accept="image/*"

                                                        /> */}


                                                    </div>

                                                    {customerror?.image && <span className="error">{customerror?.image}</span>}
                                                    {imageFields.length === 0 && <ErrorMessage
                                                        errors={errors}
                                                        name="Displayimage"
                                                        render={({ message }) => <span className="error">{message}</span>}
                                                    />}
                                                    {/* {!files && <span className="error">Image required</span>} */}
                                                    {/* {validateError.image && <span className="error">{validateError.image}</span>} */}

                                                </div>



                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="status"
                                                        >
                                                            Status<span className="asterisk">*</span>
                                                        </label>
                                                        <select
                                                            {...register("status", {
                                                                required: "Status is required",
                                                                // onChange: handleSubmit(handleSubmitForm),
                                                            })}
                                                            name="status"
                                                            type="text"
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        >
                                                            <option value="">--Select--</option>
                                                            <option value="1">Active</option>
                                                            <option value="0">Inactive</option>

                                                        </select>
                                                        {errors.status && <span className="error"> {errors.status.message}</span>}
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="RoomCount"
                                                        >
                                                            Room Count<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            {...register("RoomCount", {
                                                                required: true,


                                                            })}
                                                            type="number"
                                                            onKeyPress={preventOtherCharactersFromNumberInputcount}
                                                            name="RoomCount"
                                                            placeholder='Room Count'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />
                                                        {errors.RoomCount?.type == "required" && (
                                                            <span className="error">Room count is required</span>
                                                        )}


                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="ServiceChargeValue"
                                                        >
                                                            Service Charge Value<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            // {...register("ServiceChargeValue", {
                                                            //     required: true,



                                                            // })}
                                                            value={serviceCharge}
                                                            disabled
                                                            type="number"
                                                            // onKeyPress={preventOtherCharactersFromNumberInputlimit}
                                                            name="ServiceChargeValue"
                                                            placeholder='Service Charge Value'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />
                                                        {/* {errors.ServiceChargeValue?.type == "required" && (
                                                            <span className="error">Service charge value is required</span>
                                                        )} */}


                                                    </div>


                                                </div>


                                                <div className="relative w-full mb-3 px-2 " id="buttonview">
                                                   
                                                    <div className="text-center  lg:w-4/12  mt-2 px-2">
                                                        <button
                                                            className="bg-lightBlue-800  text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="submit"
                                                        // onClick={(e)=>handleSubmitForm(e)}
                                                        >
                                                            SAVE
                                                        </button>
                                                    </div>
                                                    <div className="text-center  lg:w-4/12  mt-2 px-2">
                                                        <button
                                                            className="bg-reset text-white active:bg-reset-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={() => {
                                                                window.location.reload(false)
                                                            }}
                                                        // onClick={() => handleReset()}
                                                        >
                                                            RESET
                                                        </button>
                                                    </div>

                                                    <div className="text-center  lg:w-4/12  mt-2 px-2">
                                                        <button
                                                            className="bg-cancel text-white active:bg-cancel-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={(e) => handleBackForm(e)}
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

        </div >

    </>
    );
}
export default AddRooms;
