import React from "react";
import { Outlet } from "react-router-dom" // represente l'endroit ou les pages s'afficheront 
import Navbar from "../components/Navbar" 
import Footer from "../components/Footer" 



function MainLayout() {
    return (
        <>
          <Navbar/>
          <main className="pt-20">
            <Outlet/> 
          </main>
          <Footer/>
        </>
    )
}

export default MainLayout;