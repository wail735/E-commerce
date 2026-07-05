import React from "react";
import HeroSection from "../components/Hero";
import Products from "../components/Products";
import TopProducts from "../components/TopProducts";
import Banner from "../components/Banner";
import Subscribe from "../components/Subscribe";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Products />
      <TopProducts />
      <Banner />
      <Subscribe />
      <Testimonials />
    </>
  );
};

export default Home;
