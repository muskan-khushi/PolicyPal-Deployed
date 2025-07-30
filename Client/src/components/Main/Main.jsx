import React from "react";
import "./Main.css";
import { assets } from "../../assets/assets";

const Main = () => {
    return(
        <div className="main">
            <div className="nav">
                <p>PolicyPal</p>
                <img src="https://cdn-icons-png.flaticon.com/512/4775/4775486.png" alt="" />
            </div>

            <div className="main-container">
                <div className="greet">
                    <img src="https://cdn-icons-png.freepik.com/512/211/211283.png" alt="" />
                    <p><span>Hello!</span>
                    </p>
                    <p>How can I help you today?</p>
                </div>

                <div className="main-bottom">
                    <div className="search-box">
                        <input type="text" placeholder="Enter prompt here"/>
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1v0jrV_x4un0y3T36nyVRHKwNSjuHg2oIiQ&s" alt="" />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Main;