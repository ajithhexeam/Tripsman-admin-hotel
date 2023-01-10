import React from "react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import {Tooltip as ReactTooltip} from 'react-tooltip';
import Swal from 'sweetalert2'
const Navbar=()=> {
  const navigate = useNavigate();
  const doLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#12c412',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('admin_tkn')
        Swal.fire(
          'Looged out!',
          'Admin has been logged out.',
          'success'
        )
        navigate('/')
      }
    })
  }
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
          {/* Form */}
          <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search here..."
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
          </form>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
          <ReactTooltip data-background-color={"yellow"} effect="solid" />
            <UserDropdown />
            <li className="nav-item" data-tip="Profile">
              <span
                  style={{ cursor: "pointer" }}
                   onClick={doLogout}
                  className={"text-white text-sm text-xs uppercase py-3 px-2 font-semibold block active:text-lightBlue1" }>
                  <i className={"fa fa-sign-out-alt mr-2 text-sm text-white active:text-lightBlue1" }
                  ></i>{" "}
                  LOGOUT
                </span>
              </li>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
export default Navbar