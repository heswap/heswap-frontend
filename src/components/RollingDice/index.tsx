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
      <div id="rolling-dice-wrapper">
        <div id="rolling-dice-platform" role="button" tabIndex={0} onClick={handleClick} onKeyPress={noop}>
          <div id="rolling-dice-cube" ref={cubeRef}>
            <div className="rolling-dice-side front">
              <div className="dot center" />
            </div>
            <div className="rolling-dice-side front inner" />
            <div className="rolling-dice-side top">
              <div className="dot dtop dleft" />
              <div className="dot dbottom dright" />
            </div>
            <div className="rolling-dice-side top inner" />
            <div className="rolling-dice-side right">
              <div className="dot dtop dleft" />
              <div className="dot center" />
              <div className="dot dbottom dright" />
            </div>
            <div className="rolling-dice-side right inner" />
            <div className="rolling-dice-side left">
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
            </div>
            <div className="rolling-dice-side left inner" />
            <div className="rolling-dice-side bottom">
              <div className="dot center" />
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
            </div>
            <div className="rolling-dice-side bottom inner" />
            <div className="rolling-dice-side back">
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
              <div className="dot center dleft" />
              <div className="dot center dright" />
            </div>
            <div className="rolling-dice-side back inner" />
            <div className="rolling-dice-side cover x" />
            <div className="rolling-dice-side cover y" />
            <div className="rolling-dice-side cover z" />
          </div>
        </div>
      </div>
    </>
  );
}

export default RollingDice
