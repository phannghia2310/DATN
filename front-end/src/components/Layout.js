import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <div className="max-w-[1440px] mx-auto bg-white">
            <Header />
            { children }
            <Footer />
        </div>
    );
};

export default Layout;