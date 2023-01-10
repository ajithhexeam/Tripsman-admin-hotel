import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import bg from '../../assets/img/login-img.jpg';
import logo from '../../assets/img/logo.png';


const { REACT_APP_AUTH_SERVER}= process.env;
const ForgotPassword = () => {
  document.title = "Tripsman | Forgot Password"
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);
  const [loading,setLoading]=useState(false)
  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  // console.log(errors, isValid);
  const [fieldvalues, setFieldvalues] = useState({ email: "" });
  const [token, setToken] = useState("")
  const handleSubmitForm = async () => {
    setLoading(true)
    if (isValid) {  
      console.log(getValues().email,'email');   
      await axios({
        url: REACT_APP_AUTH_SERVER + "api/account/GeneratePasswordResetToken",
        method: 'POST',      
        data: {
            Email: getValues().email,         
            // ReturnUrl: "https://tripsman-admin.vercel.app/resetpassword" + token
            ReturnUrl:'http://localhost:3000/resetpassword'
        },
      }
      ).then((response) => {
       console.log("response.data.token===>",response.data.token)
        if (response.data.token) {
          setLoading(false)
          setToken(response.data.token)
          Swal.fire({
            icon: 'success',
            text: 'Reset password Link sended your Email',
            showConfirmButton: false,
            timer: 3000
          })
        }
        else {
          toast.error(response.data.message);

        }
      })
        // .catch((error) => {
        //   setLoading(false)
        //   toast.error(error.response.data.message)
        // })
        .catch(err => { if(err.request){ console.log(err.request) } if(err.response)
        { 
        console.log(err.response)
        } });
    }
  }
  return (
    <>
      {/* <Navbar transparent /> */}
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
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
                      Forgot Password
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
                      <div className="text-center mt-6">
                        <button
                          className="bg-login text-white1 active:bg-login-active text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          type="submit"
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
                    <div className="flex flex-wrap mt-2 relative">
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
              </div>
            </div>
          </div>
        </section>
        <>
          <Toaster />
        </>
      </main>
    </>
  );
}
export default ForgotPassword;