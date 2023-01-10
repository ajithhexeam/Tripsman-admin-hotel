/*eslint-disable*/
import React, { useEffect, useState,useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import img1 from '../../assets/img/logo.png'
import { AppContext } from "../../App";


const Sidebar = () => {
  const user = useContext(AppContext);
  const navigate = useNavigate();
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [sidebarIsopen, setSidebarIsopen] = useState(false);
  useEffect(() => {
    console.log("user===>context", user.isOpen
    );
  }, [user.isOpen]);

  const handleTogglesidebar = (e) => {
    setSidebarIsopen(!sidebarIsopen);
  };
  const handleToggle = (e) => {
    user.setIsopenHotel(!user.isOpenHotel)

    // setIsopen(!isOpen);
  };
  const handleToggleMeetup = (e) => {
    user.setIsopenMeet(!user.isOpenMeet)
    // setIsopenMeetup(!isOpenMeetup);
  };
  const handleToggleActivity = (e) => {
    user.setIsopenActivity(!user.isOpenActivity)
    // setIsopenActivity(!isOpenActivity);
  };

  const handleToggleHoliday = () => {
    // setIsopenHoliday(true);
   user.setIsopenHoliday(!user.isOpenHoliday)
  };

  const handleTogglegeneral = (e) => {
    // setIsopengeneral(true);
    user.setIsopen(!user.isOpen)
  };

  const doLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#12c412",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("admin_tkn");
        localStorage.removeItem("hotel_id");
        Swal.fire("Looged out!", "Admin has been logged out.", "success");
        navigate("/");
      }
    });
  };
  return (
    <>
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        {/* Toggler */}
        <button
          className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
          type="button"
          onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
        >
          <i className="fas fa-bars"></i>
        </button>
        <Link
          className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-0 px-0"
          to="/admin"
        >
          <div className="flex text-center justify-center" id="loginlogo">
            <img
              src={img1}
              alt="..."
              className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
            ></img>
          </div>
          {/* TRIPSMAN */}
        </Link>
        <ul className="md:block items-center flex flex-wrap list-none">
          <li className="inline-block relativ"></li>
        </ul>
        {/* Collapse */}
        <div
          className={
            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-2 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
            collapseShow
          }
        >
          {/* Collapse header */}
          <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
            <div className="flex flex-wrap">
              <div className="w-6/12">
                <Link
                  className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                  to="/admin"
                >
                  TRIPSMAN
                </Link>
              </div>
              <div className="w-6/12 flex justify-end">
                <button
                  type="button"
                  className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                  onClick={() => setCollapseShow("hidden")}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          <hr className="my-4 md:min-w-full" />   
          <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            <li className="items-center mr-2 text-sm uppercase font-bold block text-lightBlue-500 hover:text-lightBlue-601">
              <Link
                className={
                  "text-sm uppercase py-3 font-bold block text-lightBlue-500 hover:text-lightBlue-601"
                }
                to="/dashboard"
              >
                <i
                  className={
                    "fas fa-tv mr-2 text-sm text-lightBlue-500 hover:text-lightBlue-601"
                  }
                >
                </i>{" "}
                Dashboard
              </Link>
            </li>     
            <li className="items-center mr-2 text-sm uppercase py-3 font-bold block text-lightBlue-500 hover:text-lightBlue-601">
              <Link to="/rooms">
                <div
                  onClick={(e) => handleTogglegeneral(e)}
                  style={{ cursor: "pointer" }}>
                  <i
                    className={
                      "fas fa-hotel mr-2 text-sm hover:text-lightBlue-601"
                    }
                  ></i>{" "}Rooms<i className="fas fa-angle-right dropdown absolute right-0 transitionIcon"></i>
                </div>
              </Link>          
            </li>
            <li className="items-center mr-2 text-sm uppercase py-3 font-bold block text-lightBlue-500 hover:text-lightBlue-601">
              <Link to="/bookings">
                <div
                  onClick={(e) => handleTogglegeneral(e)}
                  style={{ cursor: "pointer" }}>
                  <i
                    className={
                      "fas fa-house-user mr-2 text-sm hover:text-lightBlue-601"
                    }
                  ></i>{" "}Bookings<i className="fas fa-angle-right dropdown absolute right-0 transitionIcon"></i>
                </div>
              </Link>          
            </li>
            <li className="items-center mr-2 text-sm uppercase py-3 font-bold block text-lightBlue-500 hover:text-lightBlue-601">
              <Link to="/booking_history">
                <div
                  onClick={(e) => handleTogglegeneral(e)}
                  style={{ cursor: "pointer" }}>
                  <i
                    className={
                      "fas fa-house-user mr-2 text-sm hover:text-lightBlue-601"
                    }
                  ></i>{" "}Booking History<i className="fas fa-angle-right dropdown absolute right-0 transitionIcon"></i>
                </div>
              </Link>          
            </li>
            {/* </SidebarContext.Provider> */}

          </ul>

          {/* Divider */}
          <hr className="my-4 md:min-w-full" />

        </div>
      </div>
    </nav>
  </>
  );
};
export default Sidebar;
