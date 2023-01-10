import React from "react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2'
import img1 from '../../assets/img/admin.png'

const CommonNav = ({ headers }) => {

  const navigate = useNavigate();
  const doLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
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
          'Log out!',
          'Admin has been log out.',
          'success'
        )
        navigate('/')
      }
    })
  }
  return (
    <>
      <div className="page-header">   
         <div>  <a
          className="text-lightBlue text-xl uppercase hidden lg:inline-block font-bold"
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          {headers}
        </a></div> 
        <div className="flex  ml-auto header-right-icons header-search-icon">
          <div className="sidebar-navs">
         
            <div className="navbar__right">
            <ul className="nav  nav-pills-circle">
              <li>
              <div className="dropdown">
               <button className="btn btn-secondary dropdown-toggle" type="button" 
               id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 <span className="navbar-user">
                  <span className="navbar-user__thumb">
                    <img src={img1}/>
                  </span>
               
                <span className="navbar-user__info">
                  <span className="navbar-user__name">Admin</span>
                </span>
                <span className="icon">
                  <i className="fas fa-chevron-circle-down"></i>
                </span>
                </span>
  </button>
  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
    {/* <a className="dropdown-item"  href="#"><i className="dropdown-menu__icon fas fa-user-circle"></i><span className="dropdown-menu__caption">Profile</span></a> */}
    {/* <a className="dropdown-item" href="#"><i className="dropdown-menu__icon fas fa-key "></i><span className="dropdown-menu__caption">Password</span></a> */}
    <a className="dropdown-item" href="#" onClick={()=>doLogout()}><i className="dropdown-menu__icon fas fa-sign-out-alt"></i><span className="dropdown-menu__caption">Logout</span></a>
  </div>
</div>
                {/* <button>
                <span className="navbar-user">
                  <span className="navbar-user__thumb">
                    <img src={require("assets/img/admin.png").default}/>
                  </span>
               
                <span className="navbar-user__info">
                  <span className="navbar-user__name">Admin</span>
                </span>
                <span className="icon">
                  <i className="fas fa-chevron-circle-down"></i>
                </span>
                </span>
                </button> */}
                </li>
           
            </ul>
            </div>
          </div>

        </div>
      </div>
     
    
    </>
  );
}
export default CommonNav 

// import React from "react";
// import UserDropdown from "components/Dropdowns/UserDropdown.js";
// const CommonNav=({headers})=> {
//   return (
//     <>
//       {/* Navbar */}
//       <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
//         <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
//           {/* Brand */}
//           <a
//             className="text-teal-500 text-xl uppercase hidden lg:inline-block font-bold mt-3"
//             href="#pablo"
//             onClick={(e) => e.preventDefault()}
//           >
//             {headers}
//           </a>
          
//         </div>
//       </nav>
      
//     </>
//   );
// }
// export default CommonNav 