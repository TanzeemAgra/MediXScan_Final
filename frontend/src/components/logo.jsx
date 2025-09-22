import React from "react"

// Import Image
import logo from "/assets/images/medixscan-logo.svg"

const Logo = () => {
    return (
        <>
            <div className="logo-main">
                <img className="logo-normal img-fluid mb-3" src={logo} height="30" alt="MediXScan Logo" />{" "}
                <span className="ms-2 brand-name">MediXScan</span>
            </div>
        </>
    )
}

export default Logo