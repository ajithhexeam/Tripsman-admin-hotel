import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import Sidebar from "../../Components/Sidebar/Sidebar.js";
import CommonNav from '../../Components/Navbars/CommonNav';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ErrorMessage } from '@hookform/error-message';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from "react-select";
import { Oval } from "react-loader-spinner";
import Richtexteditor from '../../Components/DraftextEditor/Richtexteditor';
const { REACT_APP_SERVER_URL } = process.env;
const UpdateRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        formState: { errors, isValid, isDirty },
        handleSubmit,
        getValues,
        control,
        setValues,
        setFocus,
        reset,
        watch,
        setValue,
        setError,
        values,
        trigger,
    } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
    });
    console.log("error",errors)
    const [selectedOption, setSelectedOption] = useState(null);
    const [loadingImg, setLoadingImg] = useState(false);
    const [files, setFiles] = useState("");
    const [imageFields, setimageFields] = useState([]);
    const [optionlist, setoptionList] = useState([]);
    const [optionSelected, setoptionSelected] = useState([]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [hotelList, sethotelList] = useState([]);
    const [hotelIds, setHotelIds] = useState("");
    const [roomTypeList, setroomTypeList] = useState([]);
    const [roomTypeCode, setroomTypeCode] = useState("");
    const [fsubmit, setFsubmit] = useState(false);
    const [customerror, setCustomerror] = useState({ image: "" })
    const [isFocused, setIsFocused] = useState(false);
    const [isFocused1, setIsFocused1] = useState(false);
    const token= localStorage.getItem('hotel_admin_tkn')
    const [fieldvalues, setFieldvalues] = useState({

        Description: EditorState.createEmpty(),

        ar_Description: EditorState.createEmpty(),


    });
    useEffect(() => {

        hotelListing();
        roomfacilityListing();
        roomTypeListing();
        roomView();

    }, [])
    
    useEffect(() => {
console.log("image=>",imageFields)

    }, [imageFields])
    const roomView = async () => {
        await axios({
            url: REACT_APP_SERVER_URL + "/api/Room/GetViewRoomById?RoomId=" + id,
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}
        }).then((response) => {
            if (response.data.status === 1) {
                setHotelIds(response.data.data.hotelId)
                setroomTypeCode(response.data.data.roomType)
                let tempDate = response.data.data.roomFacilities.map((option) => {
                    return {
                        ...option, value: option.roomFacilityID, label: option.roomFacilityName
                    };
                });


                setoptionSelected(tempDate);
                setValue("Displayimage", response.data.data.roomImage[0].roomImage)
                setimageFields(response.data.data.roomImage)
                 setFieldvalues({
                    ...fieldvalues,
                    Description: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(response.data.data.roomDescription ? response.data.data.roomDescription : ""))),
                    ar_Description: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(response.data.data.aR_Description ? response.data.data.aR_Description : ""))),


                })
                setValue("room", {
                    hotelId: response.data.data.hotelId,
                    roomCode: response.data.data.roomCode,
                    roomCount: response.data.data.roomCount,
                    roomId: response.data.data.roomId,
                    roomImage: response.data.data.roomImage,
                    roomPrice: response.data.data.roomPrice,
                    roomStatus: response.data.data.roomStatus,
                    roomType: response.data.data.roomType,
                    serviceChargeValue: response.data.data.serviceChargeValue,

                });
                setimageFields(response.data.data.roomImage)
                setValue("Applicablemodules", tempDate[0].value)
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
    const changeHandler = (name) => async (event) => {
        setFieldvalues({ ...fieldvalues, [name]: event.target.value })

    }
    const onEditorStateChange = (name) => (editorState) => {
        if (name === 'Description') {

            setFieldvalues({ ...fieldvalues, [name]: editorState });

        }
        else if (name === 'ar_Description') {

            setFieldvalues({ ...fieldvalues, [name]: editorState });
        }

    }
    const onError = (errors, e) => {
        setFsubmit(true);
    };
    const getroomDescription = () => {
        let content = draftToHtml(
            convertToRaw(fieldvalues.Description.getCurrentContent())
        );
        return content;
    }
    const getarroomDescription = () => {
        let content = draftToHtml(
            convertToRaw(fieldvalues.ar_Description.getCurrentContent())
        );
        return content;
    }
    function preventOtherCharactersFromNumberInput(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    }
    function handleUploadfile(id) {

        document.getElementById(id).click();;

    }
    const handleChangeImage = async (e) => {
        console.log('akjkkkkk');
        try {
            console.log('akbbbbbbbbk',e.target.files[0]);
            setLoadingImg(true)
            const imageFile = e.target.files[0]
            setFiles(e.target.files[0]);
            const formData = new FormData();
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
                            setValue("Displayimage", response.data.data.url)
                            setimageFields([...imageFields,
                            {
                                id: 0, ImageUrl: response.data.data.url, status:response.data.status,roomImage:response.data.data.url
                            }

                            ])
                            // setuploadFiles(response.data.data.url);
                            toast.success("Image upload success");
                            setCustomerror({ image: "" })
                            setLoadingImg(false)
                        })
                        .catch((error) => {
                            setLoadingImg(false)

                        })

                    } else {

                        setCustomerror({ image: "Please choose a photo" })
                        return setLoadingImg(false)
                    }

                } else {

                    setCustomerror({ image: "Please choose a file with size less than 2mb" })
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
    const handleChangeRoom = (e) => {
        setroomTypeCode(e.target.value)
        setValue("room.roomType", e.target.value)
    }
    const handleReset = () => {
        roomView();
        hotelListing();
        roomfacilityListing();
    }
    function preventOtherCharactersFromNumberInputlimit(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57 || evt.target.value.length == 10) {
            evt.preventDefault();
        }
    }
    function preventOtherCharactersFromNumberInputcount(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57 || evt.target.value.length == 4) {
            evt.preventDefault();
        }
    }
    const handleEditClose = (e, index) => {
        if (imageFields.length === 0) {
            setValue("Displayimage", "")
        }
        const list = [...imageFields];
        list.splice(index, 1);
        setimageFields(list);

    }
    const handleSubmitForm = async (data) => {
        console.log("clickkk sub")
        let content = getroomDescription()
        let content2 = getarroomDescription()

        if (!content ||content == "<p></p>\n" ||!content2 || content2 == "<p></p>\n") {
            setFsubmit(true);
            return;
        }
        let facilitylisttemp = optionSelected.map((option) => {
            return { Id: option.id, FacilityId: option.roomFacilityID, Status: 1 };
        });
        let imagelisttemp = imageFields.map((option) => {
            return { Id:option.id, ImageUrl:option.roomImage, Status: option.status
            };
        });
        await axios({
            url: REACT_APP_SERVER_URL + "/api/Room/UpdateRoom",
            method: 'POST',
            headers: {"Authorization" : `Bearer ${token}`},            
            data: {
                RoomId: parseInt(id),
                HotelId: parseInt(hotelIds),
                RoomCode: watch("room.roomCode"),
                RoomType: watch("room.roomType"),
                RoomDescription: draftToHtml(convertToRaw(fieldvalues.Description.getCurrentContent())),
                AR_RoomDescription: draftToHtml(convertToRaw(fieldvalues.ar_Description.getCurrentContent())),
                RoomPrice: parseInt(watch("room.roomPrice")),
                RoomCount: parseInt(watch("room.roomCount")),
                ServiceChargeValue: parseInt(watch("room.serviceChargeValue")),
                Status: parseInt(watch("room.roomStatus")),
                Facility: facilitylisttemp,
                Image: imagelisttemp
            },
        }
        ).then((response) => {
            if (response.data.status === 1) {
                toast.success("Room updated successfully")
                navigate('/rooms')
            }
        })
        .catch((error) => {
            toast.error(error.response.data.message)
        })
    }
    function preventOtherCharactersFromNumberInputlimit(evt) {
        if (
            evt.target.value.lenth == 10
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
    const handleoptionselected = (value) => {
        if(optionSelected.length === 0 )
        {
            setValue("Applicablemodules", "")   
        }

        setoptionSelected(value);
        setValue("Applicablemodules", value)


    }
    return (<>
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
            <CommonNav headers={"UPDATE ROOMS"} />

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
                                                <small>UPDATE ROOMS</small>
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
                                                            htmlFor="hotelId"
                                                        >
                                                            Hotel Name<span className="asterisk">*</span>
                                                        </label>
                                                        <select
                                                            // {...register("room.hotelId", {
                                                            //     required: "Hotel name is required",


                                                            // })}
                                                            value={hotelIds}
                                                            disabled
                                                            // onChange={(e) => handleChangeHotel(e)}
                                                            // onChange={(e) => setValue("room.hotelId", e.target.value)}
                                                            placeholder="Select Hotel"
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-view-color rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        >

                                                            {hotelList.map((i, index) => (
                                                                <option value={i.hotelId} key={index} >
                                                                    {i.hotelName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {/* {errors.room?.hotelId && <span className="error"> {errors.room?.hotelId?.message}</span>} */}
                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="RoomCode"
                                                        >
                                                            Room Code<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            {...register("room.roomCode", {
                                                                required: true,



                                                            })}
                                                            maxLength={20}
                                                            onChange={(e) => setValue("room.roomCode", e.target.value)}
                                                            type="text"
                                                            name="roomCode"
                                                            placeholder='Room Code'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />
                                                        {errors.room?.roomCode?.type == "required" && (
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
                                                            {...register("room.roomType", {
                                                                required: "Room type is required",


                                                            })}
                                                            value={roomTypeCode}
                                                            onChange={(e) => handleChangeRoom(e)}
                                                            // onChange={(e) => setValue("room.roomType", e.target.value)}
                                                            name="room.roomType"
                                                            placeholder="--Select--"
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        >

                                                            {roomTypeList.map((i, index) => (
                                                                <option value={i.name} key={index} >
                                                                    {i.name}
                                                                </option>
                                                            ))
                                                            }
                                                        </select>
                                                        {errors.room?.roomType?.type == "required" && (
                                                            <span className="error">Room Type is required</span>
                                                        )}

                                                        {errors.room?.roomType?.type == "required" && (
                                                            <span className="error">Room Type is required</span>
                                                        )}

                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="room.roomPrice"
                                                        >
                                                            Room Price<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            {...register("room.roomPrice", {
                                                                required: true,



                                                            })}
                                                            onChange={(e) => setValue("room.roomPrice", e.target.value)}
                                                            type="number"
                                                            onKeyDown={preventNegativeValues}
                                                            onKeyPress={preventOtherCharactersFromNumberInputlimit}
                                                            name="roomPrice"
                                                            placeholder='ROOM PRICE'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />
                                                        {errors.room?.roomPrice?.type == "required" && (
                                                            <span className="error">Room Price is required</span>
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
                                                        {fieldvalues.Description &&
                                                            <Richtexteditor
                                                                data={fieldvalues.Description}
                                                                onEditorStateChange={onEditorStateChange("Description")}
                                                            />}
                                                        {fsubmit &&
                                                            getroomDescription() ==
                                                            "<p></p>\n" && (
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
                                                        {fieldvalues.ar_Description &&
                                                            <Richtexteditor
                                                            dir={true}
                                                                data={fieldvalues.ar_Description}
                                                                onEditorStateChange={onEditorStateChange("ar_Description")}
                                                            />}
                                                        {fsubmit &&
                                                            getarroomDescription() ==
                                                            "<p></p>\n" && (
                                                                <span className="error">
                                                                    Room description(Arabic)  is required
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
                                                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white 
    rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear 
    transition-all duration-150"
                                                        value={optionlist.filter(function (v) {
                                                            return optionSelected.filter(function (v2) {
                                                                return (v.label === v2.label);
                                                            }).length > 0;
                                                        })}

                                                        defaultValue={optionSelected}
                                                        onChange={value => handleoptionselected(value)}
                                                        // onChange={setoptionSelected}
                                                        options={optionlist}
                                                        isMulti
                                                    />
                                                    {optionSelected.length === 0 && <ErrorMessage
                                                        errors={errors}
                                                        name="Applicablemodules"
                                                        render={({ message }) => <span className="error">{message}</span>}
                                                    />}

                                                    {/* {optionSelected.length < 0 && <span className="error">Room facility is required</span>} */}


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
                                                                <img src={image.roomImage} id="imagePreview" alt="" width={'70px'} height={'50px'}
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
                                                </div>
                                                <div className="relative w-full lg:w-12"
                                                    id="couponid"
                                                >
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="roomCount"
                                                        >
                                                            Room Count<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            {...register("room.roomCount", {
                                                                required: true,

                                                            })}
                                                            onChange={(e) => setValue("room.roomCount", e.target.value)}
                                                            type="number"
                                                            onKeyPress={preventOtherCharactersFromNumberInputcount}
                                                            name="RoomCount"
                                                            placeholder='Room Count'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />
                                                        {errors.room?.roomCount?.type == "required" && (
                                                            <span className="error">Room Count is required</span>
                                                        )}


                                                    </div>
                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="serviceChargeValue"
                                                        >
                                                            Service Charge Value<span className="asterisk">*</span>
                                                        </label>
                                                        <input
                                                            {...register("room.serviceChargeValue", {
                                                                required: false,

                                                            })}
                                                            disabled
                                                            // onChange={(e) => setValue("room.serviceChargeValue", e.target.value)}
                                                            type="number"
                                                            onKeyPress={preventOtherCharactersFromNumberInput}
                                                            name="ServiceChargeValue"
                                                            placeholder='Service Charge Value'
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                                                        />
                                                        {/* {errors.room?.serviceChargeValue?.type == "required" && (
                                                            <span className="error">Service Charge Value is required</span>
                                                        )} */}


                                                    </div>


                                                </div>

                                                <div className="relative w-full lg:w-12 " id="couponid">

                                                    <div className="relative w-full lg:w-6/12 mb-3 px-2">
                                                        <label
                                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                            htmlFor="roomStatus"
                                                        >
                                                            Status<span className="asterisk">*</span>
                                                        </label>
                                                        <select
                                                            {...register("room.roomStatus", {
                                                                required: "Status is required",

                                                            })}
                                                            onChange={(e) => setValue("room.roomStatus", e.target.value)}
                                                            name="status"
                                                            type="text"
                                                            autoComplete='off'
                                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        >
                                                            <option value="">--Select--</option>
                                                            <option value="1">Active</option>
                                                            <option value="0">Inactive</option>

                                                        </select>
                                                        {errors.room?.roomStatus && <span className="error"> {errors.room?.roomStatus?.message}</span>}
                                                    </div>
                                                </div>

                                                <div className="relative w-full mb-3 px-2 " id="buttonview">
                                                <div className="text-center  lg:w-4/12  mt-2 px-2">
                                                        <button
                                                            className="bg-lightBlue-800  text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="submit"
                                                        // onClick={(e) => handleSubmitForm(e)}
                                                        >
                                                            UPDATE
                                                        </button>
                                                    </div>
                                                    <div className="text-center  lg:w-4/12  mt-2 px-2">
                                                        <button
                                                            className="bg-reset text-white active:bg-reset-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={() => handleReset()}
                                                        >
                                                            RESET
                                                        </button>
                                                    </div>

                                                    <div className="text-center  lg:w-4/12  mt-2 px-2">
                                                        <button
                                                            className="bg-cancel text-white active:bg-cancel-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={() => navigate('/room-list/' + hotelIds)}
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
export default UpdateRoom;
