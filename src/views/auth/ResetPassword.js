import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import bg from '../../assets/img/login-img.jpg';
import logo from '../../assets/img/logo.png';


const { REACT_APP_AUTH_SERVER } = process.env;
const ResetPassword = () => {
    document.title = "Tripsman | ResetPassword"
    const navigate = useNavigate();
    // const { token } = useParams();
    const location = useLocation();
    useEffect(() => {
        document.body.style.overflow = "hidden";
    }, []);
    // const params = new URLSearchParams(location.search)
    // let token=params.get('token') ?? null
    const [tokens, setTokens] = useState("")
    useEffect(() => {

        function getQueryParam(param) {
            var result = window.location.search.match(
                new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
            );
            return result ? result[3] : false;
        }

        setTokens(getQueryParam("token"));
        //     const params = new URLSearchParams(location.search)
        //     console.log("DSJVNJNSEVNKSED=========>",params )
        //     let token=params.get('token') ?? null
        //     let result = token.replace(/^\s+|\s+$/gm,'');
        //  console.log("tokennew===>",result);
        // setTokens(token)

    }, [])
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);
    // const { register, handleSubmit, errors } = useForm();
    const {
        register,
        formState: { errors, isValid, isDirty },
        handleSubmit,
        getValues,
        reset,
        // setValue,
        // setFocus,
        // trigger,
    } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
    });
    // console.log(errors, isValid);
    const [fieldvalues, setFieldvalues] = useState({ email: "" });
    const [userInfo, setUserInfo] = useState();
    // password toggle
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    // confirm toggle
    const handleClickConfirmPassword = () => {
        setConfirmPassword(!confirmPassword);
    };

    const handleSubmitForm = async () => {
        const res = tokens.replace(/ /g, '')

        if (isValid) {
            // console.log("haiiii valid");
            await axios({

                url: REACT_APP_AUTH_SERVER + "/api/account/ResetPassword",
                //   url: REACT_APP_AUTH_SERVER +api/account/ResetPassword",         
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //   'Access-Control-Allow-Origin': '*'

                },

                data: {
                    Email: getValues().email,
                    Password: getValues().password,
                    ReturnUrl: tokens

                },
            }
            ).then((response) => {
                if (response.data) {
                    // console.log("res=>data",response.data.token.succeeded == true)
                    if (response.data.status === 1) {
                        Swal.fire({
                            icon: 'success',
                            text: 'Password updated successfully',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        navigate("/");

                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            text: 'try again',
                            showConfirmButton: false,
                            timer: 1000
                        })

                    }
                }
            })
                .catch((error) => {
                    // console.log(error)
                    // toast.error('Something went wrong')
                })
        }

    }
    // useEffect(() => {
    //     console.log("data useeffect", fieldvalues)
    // }, [fieldvalues])
    return (
        <>
            {/* <Navbar transparent /> */}
            <main className="p-0">
                <section className="relative w-full h-full py-25 min-h-screen" id="loginbody">
                    <div
                        className="absolute top-0 w-full h-full bg-no-repeat bg-full"
                        style={{
                            backgroundImage:`url(${bg})`,
                            backgroundSize: "cover"
                        }}
                    ></div>
                    <div className="container mx-auto px-4 h-full">
                        <div className="flex justify-right items-right justify-right h-full">
                            <div className="w-full lg:w-4/12 px-4" id="loginBox">
                                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0" id="loginBoxshadow">
                                    <div className="flex text-center justify-center" id="loginlogo">
                                        <img
                                            src={logo}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                                        ></img>

                                    </div>
                                    <div className="rounded-t mb-0 px-6 py-6">
                                        <div className="text-center mb-3">
                                            <h6 className="text-blueGray-login text-sm font-bold">
                                                Reset Password
                                            </h6>
                                        </div>

                                        <hr className="mt-6 border-b-1 border-blueGray-300" />
                                    </div>
                                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">

                                        <form onSubmit={handleSubmit(handleSubmitForm)}>
                                            <div className="relative w-full mb-3">
                                                <label
                                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                    htmlFor="email"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    {...register("email", {
                                                        required: true,

                                                        pattern:
                                                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

                                                    })}
                                                    maxLength={100}
                                                    type="email"
                                                    placeholder="Email"
                                                    autoComplete="off"
                                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                />
                                                <p> {errors.email?.type === "required" && (
                                                    <span className="error">Email is required</span>
                                                )}
                                                    {errors.email?.type === "pattern" && (
                                                        <span className="error">Email is not valid</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="relative w-full mb-3">
                                                <label
                                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                    htmlFor="password"
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    autoComplete="off"
                                                    {...register("password", {
                                                        //   required: true,

                                                        required: "You must specify a password",
                                                        minLength: {
                                                            value: 7,
                                                            message: "Password must have at least 7 characters"
                                                        }

                                                    })}
                                                    maxLength={100}
                                                    // type="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Password"
                                                    id="password-field1"
                                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                />
                                                <span toggle="#password-field1" onClick={handleClickShowPassword}
                                                    className={showPassword ? "fa fa-fw fa-eye field-icon toggle-password1" : "fa fa-eye-slash field-icon toggle-password1"} />
                                                {errors.password && <p className="error">{errors.password.message}</p>}

                                            </div>
                                            <div className="relative w-full mb-3">
                                                <label
                                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                    htmlFor="confirmpassword"
                                                >
                                                    Confirm Password
                                                </label>
                                                <input
                                                    autoComplete="off"
                                                    {...register("confirmpasswords", {
                                                        //   required: true,

                                                        required: "You must specify a password",
                                                        minLength: {
                                                            value: 7,
                                                            message: "Password must have at least 7 characters"
                                                        },
                                                        validate: (value) => {
                                                            const { password } = getValues();
                                                            return password === value || "Passwords should match!";
                                                        }

                                                    })}
                                                    maxLength={100}
                                                    // type="password"
                                                    type={confirmPassword ? "text" : "password"}
                                                    placeholder="Confirm Password"
                                                    id="password-field1"
                                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                />
                                                <span toggle="#password-field1" onClick={handleClickConfirmPassword}
                                                    className={confirmPassword ? "fa fa-fw fa-eye field-icon toggle-password1" : "fa fa-eye-slash field-icon toggle-password1"} />
                                                {errors.confirmpasswords && <p className="error">{errors.confirmpasswords.message}</p>}

                                            </div>
                                            <div className="text-center mt-6">
                                                <button
                                                    className="bg-login text-white1 active:bg-login-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                    type="submit"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Submit
                                                </button>
                                                <button
                                                    className="bg-clear text-white1 active:bg-clear-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                    type="button"
                                                    onClick={() => reset()}
                                                    style={{ cursor: "pointer" }}

                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </form>
                                        <div className="flex flex-wrap mt-6 relative">
                                            <div className="w-1/2">
                                            </div>
                                            <div className="w-1/2 text-right">
                                                <Link to="/" className="text-blueGray-login text-sm font-bold" style={{ cursor: "pointer" }}>
                                                    <h6>Login</h6>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="flex flex-wrap mt-6 relative">
                                    <div className="w-1/2">
                                    </div>
                                    <div className="w-1/2 text-right">
                                        <Link to="/login" className="text-blueGray-200" style={{ cursor: "pointer" }}>
                                            <small>Login</small>
                                        </Link>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
export default ResetPassword;