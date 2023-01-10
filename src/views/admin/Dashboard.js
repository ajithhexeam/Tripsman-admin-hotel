import React,{useState,useEffect} from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CardLineChart from "../../Components/Cards/CardLineChart.js";
import CardBarChart from "../../Components/Cards/CardBarChart.js";
import CardPageVisits from "../../Components/Cards/CardPageVisits.js";
import CardSocialTraffic from "../../Components/Cards/CardSocialTraffic.js";
import CommonNav from "../../Components/Navbars/CommonNav";
import Sidebar from "../../Components/Sidebar/Sidebar";
import FooterAdmin from "../../Components/Footer/Footeradmin";
import HeaderStats from "../../Components/Header/HeaderStats";

// import Footer from "components/Footers/Footer";

const Dashboard=()=> {
  document.title="Tripsman | Dashboard"
const navigate=useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("admin_tkn");
    if (!token) {
      navigate("/login")
    } 

    return () => {};
}, []);
  return (<>
    <Sidebar />
    <div className="relative md:ml-64 bg-blueGray-100">
      <CommonNav headers={"DASHBOARD"} />
      {/* <AdminNavbar /> */}
      {/* Header */}
      <HeaderStats />
      <div className="px-4 md:px-10 mx-auto w-full -m-24">
        <div className="flex flex-wrap">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            {/* <CardLineChart /> */}
          </div>
          <div className="w-full xl:w-4/12 px-4">
            {/* <CardBarChart /> */}
          </div>
        </div>
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            {/* <CardPageVisits /> */}
          </div>
          <div className="w-full xl:w-4/12 px-4">
            {/* <CardSocialTraffic /> */}
          </div>
        </div>
        <FooterAdmin />


      </div>

    </div>

  </>
  );
}
export default Dashboard