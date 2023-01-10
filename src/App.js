import React, { useState, useEffect, createContext } from "react";
import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/styles/tailwind.css";
import "./assets/styles/sidebar.css";
import Login from "./views/auth/Login";
import ForgotPassword from "./views/auth/ForgotPassword";
import ResetPassword from "./views/auth/ResetPassword";
import Dashboard from "./views/admin/Dashboard";
import RoomList from "./views/rooms/RoomList";
import AddRooms from "./views/rooms/AddRooms";
import ViewRoom from "./views/rooms/ViewRoom";
import UpdateRoom from "./views/rooms/UpdateRoom";
import HotelBookingList from "./views/bookings/HotelBookingList";
import HotelViewBooking from "./views/bookings/HotelViewBooking";
import HotelBookingHistoryList from "./views/bookings-history/HotelBookingHistoryList";
import HotelViewBookingHistory from "./views/bookings-history/HotelViewBookingHistory";
export const AppContext = createContext(null);
function App() {
  const[isOpen,setIsopen]=useState(false)
  const[isOpenHotel,setIsopenHotel]=useState(false)
  const[isOpenActivity,setIsopenActivity]=useState(false)
  const[isOpenMeet,setIsopenMeet]=useState(false)
  const[isOpenHoliday,setIsopenHoliday]=useState(false)
  return (
    <div>
      <Suspense fallback={null}>

      <Router>
      <AppContext.Provider value={{isOpen,setIsopen,isOpenHotel,setIsopenHotel,isOpenActivity,setIsopenActivity,
      isOpenMeet,setIsopenMeet,isOpenHoliday,setIsopenHoliday}}>
                
          
      <Routes>
            {/* add routes with layouts */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Dashboard />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<RoomList  />} />
            <Route path="/add_room/:id" element={<AddRooms />} />
            <Route path="/view_room/:id" element={<ViewRoom />} />
            <Route path="/update_room/:id" element={<UpdateRoom />} />
            <Route path="/bookings" element={<HotelBookingList />} />
            <Route path="/view_booking/:id" element={<HotelViewBooking />} />
            <Route path="/booking_history" element={<HotelBookingHistoryList />} />
            <Route path="/view_booking_history/:id" element={<HotelViewBookingHistory />} />

          </Routes>
          </AppContext.Provider> 
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
