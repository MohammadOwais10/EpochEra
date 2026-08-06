"use client"
import copy from 'clipboard-copy';
import Link from "next/link";
import { Copy } from "lucide-react";
import React, { useState } from "react";



const boxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'center',
    borderRadius: '8px',
};

const linkStyle = {
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 500,
    fontSize: '17px',
};

const linkMobileStyle = {
    fontSize: '13px',
};

const iconBoxStyle = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
};

const snackbarStyle = {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#333',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: '8px',
    zIndex: 9999,
    fontSize: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'opacity 0.3s',
    opacity: 1,
};

const AddressLink = ({ text, textColor, addresstext, hrefLink }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCopy = () => {
        copy(text);
        setOpenSnackbar(true);
        setTimeout(() => setOpenSnackbar(false), 3000);
    };

    // Responsive font size for link
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 600);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            <div style={boxStyle}>
                <Link
                    style={{ ...linkStyle, ...(isMobile ? linkMobileStyle : {}), color: textColor || linkStyle.color }}
                    href={hrefLink}
                >
                    {addresstext}
                </Link>
                <div style={iconBoxStyle} onClick={handleCopy}>
                    <Copy color="#fff" size={16} />
                </div>
            </div>
            {openSnackbar && (
                <div style={snackbarStyle}>
                    Address copied
                </div>
            )}
        </>
    );
};

export default AddressLink;