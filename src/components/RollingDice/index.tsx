import React, { useRef } from 'react'
import { noop } from 'lodash'

function getRandom(min, max) {
  return (Math.floor(Math.random() * (max - min)) + min) * 90
}

let xRnd = 0
let yRnd = 0

const RollingDice: React.FC = () => {
  const cubeRef = useRef(null)

  const handleClick = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault()
    xRnd += getRandom(12, 24)
    yRnd += getRandom(12, 24)
    const transform = `translateZ(-500px) rotateX(${xRnd}deg) rotateY(${yRnd}deg)`
    cubeRef.current.style.webkitTransform = transform
    cubeRef.current.style.transform = transform
  }

  return (
    <>
      <div id="wrapper">
        <div id="platform" role="button" tabIndex={0} onClick={handleClick} onKeyPress={noop}>
          <div id="dice" ref={cubeRef}>
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
