import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { Oval } from "react-loader-spinner";
import bg from '../../assets/img/login-img.jpg';
import logo from '../../assets/img/logo.png';


const { REACT_APP_AUTH_SERVER } = process.env;
// const { REACT_APP_SERVER_URL } = process.env;
function Login() {
    document.title = "Tripsman | Login"
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);
  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    getValues,
    setValues,
    // setFocus,
    values,
    reset,
    // trigger,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // password toggle
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmitForm = async (e) => {
    if (isValid) {
      setLoading(true)
      await axios({
        url: REACT_APP_AUTH_SERVER + "/api/account/Hotellogin",
        method: 'POST',
        data: {
          UserName: getValues().username,
          Password: getValues().password
        },
      }
      ).then((response) => {
        console.log(response.data,'data')
        if (response.data.status === 1) {
          setLoading(false)
          localStorage.setItem('hotel_admin_tkn', response.data.token);
          localStorage.setItem('hotel_id',response.data.hotelId)
          Swal.fire({
            icon: 'success',
            text: 'Admin logged in successfully!',
            showConfirmButton: false,
            timer: 2000
          })
          document.body.style.overflow = "";
          navigate("/dashboard");
        }
        else {
          setLoading(false)
          Swal.fire({
            icon: 'error',
            text: "Login Failed. Username/Password entered is invalid",
            confirmButtonColor: '#12C412',
          })
        }
      })
        .catch(err => { if(err.request){ console.log(err.request) } if(err.response)
        { 
        console.log(err.response)
        setLoading(false)
        } });
    }
    // setLoading(false)
  }
  return (
    <div >
    {/* <Navbar transparent /> */}
    <main className="p-0">
      <section className="relative w-full h-full py-25 min-h-screen" id="loginbody">
        <div
          className="absolute top-0 w-full h-full bg-no-repeat bg-full"
          style={{
            backgroundImage: `url(${bg})`,
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
                      Login
                    </h6>
                  </div>

                  <hr className="mt-6 border-b-1 border-blueGray-300" />
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0" id="loginresponsive">

                  <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Username
                      </label>
                      <input
                        {...register("username", {
                          required: true,



                        })}
                        maxLength={100}
                        type="text"
                        name="username"
                        autoComplete='off'
                        placeholder='Username'
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                      />
                      {errors.username?.type == "required" && (
                        <span className="error">Username is required</span>
                      )}

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

                          required: "Password is required",
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
                      <span toggle="#password-field1" onClick={(e) => handleClickShowPassword(e)}
                        className={showPassword ? "fa fa-fw fa-eye field-icon toggle-password1" : "fa fa-eye-slash field-icon toggle-password1"} />
                      {errors.password && <p className="error">{errors.password.message}</p>}

                    </div>
                    <div className="w-1/2">

                      <Link style={{ cursor: "pointer" }} to="/forgotpassword" className="text-blueGray-login text-sm font-bold">
                        <small>Forgot password?</small>
                      </Link>

                    </div>

                    <div className="text-center mt-6">
                      <button
                        className="bg-login text-white1 active:bg-login-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="submit"
                        style={{ cursor: "pointer" }}

                      >
                        {loading ?
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "25px" }}>
                            <Oval

                              heigth="20"
                              width="20"
                              color='#12C412'
                              arialLabel='loading'
                            />
                          </div> : "Login"}
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
                </div>
              </div>
              <div className="flex flex-wrap mt-6 relative">
              </div>
            </div>
          </div>
          <Toaster />
        </div>
      </section>

    </main>
  </div>
  )
}

export default Login
