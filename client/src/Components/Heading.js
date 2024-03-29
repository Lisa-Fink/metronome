import React, { useState, useEffect, useContext, useRef } from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMusicalNotesOutline } from "react-icons/io5";
import "../styles/Header.css";
import LoginPopUp from "./PopUps/LoginPopUp";
import SignUpPopup from "./PopUps/SignUpPopUp";
import UserAccountPopup from "./PopUps/UserAccountPopUp";
import { UserContext } from "../contexts/UserContext";
import { AppContext } from "../contexts/AppContext";

function Heading({ view, setView, isChanging }) {
  const { lightMode, setLightMode, isStopping, isPlaying } =
    useContext(AppContext);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const changeToWhenRdy = useRef("");

  const { signOutUser, isLoggedIn, saveLightModeSetting } =
    useContext(UserContext);

  useEffect(() => {
    if (lightMode === true) {
      toggleColorScheme("light-mode");
    } else {
      toggleColorScheme("dark-mode");
    }
  }, [lightMode]);

  const toggleLightMode = () => {
    if (isLoggedIn) {
      saveLightModeSetting(!lightMode);
    }
    setLightMode(!lightMode);
  };

  const toggleColorScheme = (scheme) => {
    document.documentElement.classList.remove("dark-mode", "light-mode");
    document.documentElement.classList.add(scheme);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleSignUpClick = () => {
    setIsSignUpOpen(true);
  };

  const handleSwitchSignUp = () => {
    setIsSignUpOpen(true);
    setIsLoginOpen(false);
  };

  const handleSwitchLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  const handleRhythmClick = async () => {
    isChanging.current = true;
    if (!isPlaying) {
      setView("rhythm");
    } else {
      isStopping.current = true;
      changeToWhenRdy.current = "rhythm";
    }
  };

  const handleMetronomeClick = async () => {
    isChanging.current = true;
    if (!isPlaying) {
      setView("metronome");
    } else {
      isStopping.current = true;
      changeToWhenRdy.current = "metronome";
    }
  };

  useEffect(() => {
    // Changes the view when ready (after isPlaying is set to false)
    if (isChanging.current && !isPlaying && changeToWhenRdy.current) {
      const toChange = changeToWhenRdy.current;
      changeToWhenRdy.current = "";
      if (isStopping.current) {
        isStopping.current = false;
      }
      setView(toChange);
    }
  }, [isPlaying]);

  const handleSettingsClick = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
    setIsAccountOpen(true);
  };

  return (
    <div id="heading-container">
      <header>
        <h1>
          My Rhythm Player <IoMusicalNotesOutline />
        </h1>
      </header>
      <div id="heading-right">
        <nav>
          <div id="change-view">
            {view === "metronome" ? (
              <button className="type" onClick={handleRhythmClick}>
                Drum Machine
              </button>
            ) : (
              <button className="type" onClick={handleMetronomeClick}>
                Metronome
              </button>
            )}
          </div>
          {isLoggedIn ? (
            <div id="user-div">
              <div id="settings" onClick={handleSettingsClick}>
                <IoSettingsOutline />
              </div>
              <div id="sign-out">
                <button onClick={signOutUser}>Sign Out</button>
              </div>
            </div>
          ) : (
            <>
              <div id="login">
                <button onClick={handleLoginClick}>Login</button>
              </div>
              <div id="sign-up">
                <button onClick={handleSignUpClick}>Sign Up</button>
              </div>
            </>
          )}
        </nav>
        <div id="light-mode" onClick={toggleLightMode}>
          {lightMode ? (
            <MdOutlineDarkMode onClick={toggleLightMode} />
          ) : (
            <MdOutlineLightMode onClick={toggleLightMode} />
          )}
        </div>
      </div>
      {isLoginOpen && (
        <LoginPopUp
          setIsLoginOpen={setIsLoginOpen}
          handleSwitchSignUp={handleSwitchSignUp}
        />
      )}
      {isSignUpOpen && (
        <SignUpPopup
          setIsSignUpOpen={setIsSignUpOpen}
          handleSwitchLogin={handleSwitchLogin}
        />
      )}
      {isAccountOpen && (
        <UserAccountPopup setIsAccountOpen={setIsAccountOpen} />
      )}
    </div>
  );
}

export default Heading;
