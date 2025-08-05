import React, { useState } from "react";
import "./Sidebar.css";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();
  const [extended, setExtended] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          src="https://images.icon-icons.com/3871/PNG/512/menu_icon_244496.png"
          className="menu"
          alt=""
          onClick={() => setExtended((prev) => !prev)}
        />

        <div className="new-chat">
          <img
            src="https://icons.veryicon.com/png/o/miscellaneous/o2o-middle-school-project/plus-104.png"
            alt=""
          />
          {extended ? <p>New Chat</p> : null}
        </div>

        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            <div className="recent-entry">
              <img
                src="https://e7.pngegg.com/pngimages/262/464/png-clipart-email-message-telephone-text-messaging-email-icon-miscellaneous-angle-thumbnail.png"
                alt=""
              />
              <p>What is the ideal policy for me?</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img
            src="https://www.iconpacks.net/icons/2/free-settings-icon-3110-thumb.png"
            alt=""
          />
          {extended ? <p>Settings</p> : null}
        </div>
        <div className="bottom-item recent-entry" onClick={handleLogout}>
          <div>
            <FiLogOut />
          </div>
          {extended ? <p>Logout</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
