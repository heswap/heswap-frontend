import React from 'react'
import './styles.css'

const RollingDice: React.FC = () => {
  return (
    <>
      <div id="background" />
      <div id="wrapper">
        <input id="secondroll" name="roll" type="checkbox" />
        <input id="roll" name="roll" type="checkbox" />
        {/* <label for="roll">Roll it!</label>
        <label for="secondroll"><span>Stop!</span></label> */}
        <div id="platform">
          <div id="dice">
            <div className="side front">
              <div className="dot center" />
            </div>
            <div className="side front inner" />
            <div className="side top">
              <div className="dot dtop dleft" />
              <div className="dot dbottom dright" />
            </div>
            <div className="side top inner" />
            <div className="side right">
              <div className="dot dtop dleft" />
              <div className="dot center" />
              <div className="dot dbottom dright" />
            </div>
            <div className="side right inner" />
            <div className="side left">
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
            </div>
            <div className="side left inner" />
            <div className="side bottom">
              <div className="dot center" />
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
            </div>
            <div className="side bottom inner" />
            <div className="side back">
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
              <div className="dot center dleft" />
              <div className="dot center dright" />
            </div>
            <div className="side back inner" />
            <div className="side cover x" />
            <div className="side cover y" />
            <div className="side cover z" />
          </div>
        </div>
      </div>
    </>
  );
}

export default RollingDice
