import React, { CSSProperties, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { BigNumber } from 'ethers'
import { noop } from 'lodash'

function getRandom(min, max) {
  return (Math.floor(Math.random() * (max - min)) + min) * 90
}

let xRnd = 0
let yRnd = 0

export interface RollingDiceProps {
  style: CSSProperties
  roundNum: number
  disabled: boolean
  autoRolling: boolean
  onRollStart?: () => void
  onRollEnd?: (sideNumber) => void
}

function getRollingResult(rotX, rotY) {
  const countX = BigNumber.from(rotX / 90).mod(4).toNumber()
  if (countX === 1) {
    // bottom face
    return 5
  }
  if (countX === 3) {
    // top face
    return 2
  }
  // We add countX here to correctly offset in case it is a 180 degrees rotation
  // It can be 0 (no rotation) or 2 (180 degrees)
  const countY = BigNumber.from(rotY / 90 + countX).mod(4).toNumber()
  // faces order (front->left->back->right)
  return [1, 4, 6, 3][countY]
}

const Side = styled.div<{ disabled: boolean }>`
  background: ${({ disabled, theme }) => (disabled ? theme.colors.disabled : theme.colors.backgroundAlt)};

  & > .dot {
    background: ${({ disabled, theme }) => (disabled ? theme.colors.disabled : '#444')};
    box-shadow: inset 5px 0 10px ${({ disabled }) => (disabled ? '#888' : '#000')};
  }
`

const RollingDice: React.FC<RollingDiceProps> = ({ style, roundNum, disabled, autoRolling, onRollStart, onRollEnd }) => {
  const cubeRef = useRef<HTMLDivElement>(null)
  const onTransitionEnd = useRef(null)
  const rotating = useRef(false)

  useEffect(() => {
    // remove transition effect and reset rotations in x degree and y degree
    cubeRef.current.style.webkitTransition = 'none !importatn'
    cubeRef.current.style.transition = 'none !importatn'
    cubeRef.current.style.webkitTransform = 'translateZ(-500px)'
    cubeRef.current.style.transform = 'translateZ(-500px)'
    // restore transition effect
    setTimeout(() => {
      cubeRef.current.style.webkitTransition = 'transform 6s'
      cubeRef.current.style.transition = 'transform 6s'
    }, 100)
  }, [roundNum])

  useEffect(() => {
    rotating.current = autoRolling
  }, [autoRolling])

  useEffect(() => {
    if (onTransitionEnd.current) {
      return
    }
    onTransitionEnd.current = cubeRef.current.addEventListener('transitionend', (event) => {
      const rx = /^translateZ\((-?\d+)px\) rotateX\((\d+)deg\) rotateY\((\d+)deg\)$/
      const matched = rx.exec(cubeRef.current.style.transform)
      if (matched) {
        if (rotating.current) {
          rollRandomly()
        } else {
          const xDeg = parseInt(matched[2])
          const yDeg = parseInt(matched[3])
          const sideNum = getRollingResult(xDeg, yDeg)
          onRollEnd(sideNum)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (autoRolling) {
      onRollStart()
      rollRandomly()
    } else {
      console.log('autoRolling', autoRolling)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRolling])

  const handleClick = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault()
    if (disabled || autoRolling) {
      return
    }
    onRollStart()
    rollRandomly()
  }

  function rollRandomly() {
    xRnd += getRandom(12, 24)
    yRnd += getRandom(12, 24)
    const transform = `translateZ(-500px) rotateX(${xRnd}deg) rotateY(${yRnd}deg)`
    cubeRef.current.style.webkitTransform = transform
    cubeRef.current.style.transform = transform
  }

  return (
    <div id="rolling-dice-wrapper" style={style}>
      <div id="rolling-dice-platform" role="button" tabIndex={0} onClick={handleClick} onKeyPress={noop}>
        <div id="rolling-dice-cube" ref={cubeRef}>
          <Side className="rolling-dice-side front" disabled={disabled}>
            <div className="dot center" />
          </Side>
          <div className="rolling-dice-side front inner" />
          <Side className="rolling-dice-side top" disabled={disabled}>
            <div className="dot dtop dleft" />
            <div className="dot dbottom dright" />
          </Side>
          <div className="rolling-dice-side top inner" />
          <Side className="rolling-dice-side right" disabled={disabled}>
            <div className="dot dtop dleft" />
            <div className="dot center" />
            <div className="dot dbottom dright" />
          </Side>
          <div className="rolling-dice-side right inner" />
          <Side className="rolling-dice-side left" disabled={disabled}>
            <div className="dot dtop dleft" />
            <div className="dot dtop dright" />
            <div className="dot dbottom dleft" />
            <div className="dot dbottom dright" />
          </Side>
          <div className="rolling-dice-side left inner" />
          <Side className="rolling-dice-side bottom" disabled={disabled}>
            <div className="dot center" />
            <div className="dot dtop dleft" />
            <div className="dot dtop dright" />
            <div className="dot dbottom dleft" />
            <div className="dot dbottom dright" />
          </Side>
          <div className="rolling-dice-side bottom inner" />
          <Side className="rolling-dice-side back" disabled={disabled}>
            <div className="dot dtop dleft" />
            <div className="dot dtop dright" />
            <div className="dot dbottom dleft" />
            <div className="dot dbottom dright" />
            <div className="dot center dleft" />
            <div className="dot center dright" />
          </Side>
          <div className="rolling-dice-side back inner" />
          <div className="rolling-dice-side cover x" />
          <div className="rolling-dice-side cover y" />
          <div className="rolling-dice-side cover z" />
        </div>
      </div>
    </div>
  )
}

export default RollingDice
