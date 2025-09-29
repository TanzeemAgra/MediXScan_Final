import React from "react"

// Import Configuration
import config from "../config/app.config.js"

// Import Image
import logo from "/assets/images/medixscan-logo.svg"

const Logo = () => {
    const logoConfig = config.logo;
    
    // Determine what to show based on configuration
    const shouldShowImage = logoConfig.displayMode === 'both' || logoConfig.displayMode === 'image-only' || logoConfig.showImage;
    const shouldShowText = logoConfig.displayMode === 'both' || logoConfig.displayMode === 'text-only' || logoConfig.showText;
    
    return (
        <>
            <div className="logo-main">
                {shouldShowImage && (
                    <img 
                        className={logoConfig.image.className} 
                        src={logoConfig.image.src || logo} 
                        height={logoConfig.image.height} 
                        alt={logoConfig.image.alt} 
                    />
                )}
                {shouldShowText && (
                    <span className={logoConfig.text.className}>
                        {logoConfig.text.showIcon && <i className="ri-pulse-line me-2"></i>}
                        {logoConfig.text.content}
                    </span>
                )}
            </div>
        </>
    )
}

export default Logo