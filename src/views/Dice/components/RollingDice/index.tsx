import React, { useRef } from 'react'
import { noop } from 'lodash'
import { keyframes } from 'styled-components'
import './styles.css'

function makeRandomTransform() {
  const rnd = Math.floor(Math.random() * 6 + 1)
  let x
  let y
  switch (rnd) {
    case 1:
      x = 720
      y = 810
      break
    case 6:
      x = 720
      y = 990
      break
    default:
      x = 720 + (6 - rnd) * 90
      y = 900
      break
  }
  return `translateZ(-100px) rotateY(${x}deg) rotateX(${y}deg)`
}

const RollingDice: React.FC = () => {
  const cubeRef = useRef(null)

  const handleClick = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault()
    const rnd = Math.floor(Math.random() * 6 + 1)
    let x
    let y
    switch (rnd) {
      case 1:
        x = 720
        y = 810
        break
      case 6:
        x = 720
        y = 990
        break
      default:
        x = 720 + (6 - rnd) * 90
        y = 900
        break
    }
    cubeRef.current.style.transform = `translateZ(-100px) rotateY(${x}deg) rotateX(${y}deg)`
  }

  return (
    <>
      <div id="background" />
      <div id="wrapper">
        <input id="secondroll" name="roll" type="checkbox" />
        <input id="roll" name="roll" type="checkbox" />
        {/* <label for="roll">Roll it!</label>
        <label for="secondroll"><span>Stop!</span></label> */}
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
