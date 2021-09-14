import React from "react";

import "./Header.scss";

export const redirect = () => window.location.assign("/");

export default function Header() {
    return (
        <div className="header">
            <div>
                <h3 onClick={redirect} role="presentation">
                    m8
                </h3>
            </div>
            <div>
                <div className="form">
                    <h3>Request</h3>
                </div>
            </div>
        </div>
    );
}
