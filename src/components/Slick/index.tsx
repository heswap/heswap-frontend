import React, { CSSProperties, MouseEventHandler, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { IconButton } from '@heswap/uikit'
import Slick from 'react-slick'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const StyledSlick = styled(Slick)`
  .slick-slide > div {
    display: flex;
    justify-content: center; /* place control in center of slide */
  }

  @keyframes loading {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }

  .slick-dots > li {
    position: unset;
    width: unset;
    height: unset;
  }

  .ft-slick__dots--custom {
    width: 48px;
    height: 8px;
    background-color: #e5e7e9;
    border: none;
    border-radius: 4px;
  }

  .slick-dots .slick-active .ft-slick__dots--custom {
    overflow: hidden;
    position: relative;

    .loading {
      height: 8px;
      animation: loading ${({ autoplaySpped }) => autoplaySpped / 1000}s ease-in;
      background-image: ${({ theme }) => theme.colors.gradients.slickDotLoading};
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
`

export interface ArrowProps {
  direction: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const Arrow = (props: ArrowProps) => {
  const { direction, onClick } = props
  const style: CSSProperties = {
    width: '32px',
    height: '32px',
    position: 'absolute',
    top: 'calc(50% - 16px)',
  }
  if (direction === 'prev') {
    style.left = '-32px'
  }
  if (direction === 'next') {
    style.right = '-32px'
  }
  return (
    <IconButton onClick={onClick} style={style}>
      {direction === 'prev' && <FaArrowLeft />}
      {direction === 'next' && <FaArrowRight />}
    </IconButton>
  )
}

function useRefWithCallback(onMount, onUnmount) {
  const nodeRef = useRef(null)

  const setRef = useCallback(
    (node) => {
      if (nodeRef.current) {
        onUnmount(nodeRef.current)
      }

      nodeRef.current = node

      if (nodeRef.current) {
        onMount(nodeRef.current)
      }
    },
    [onMount, onUnmount],
  )

  return setRef
}

const Slider = ({ children }) => {
  const settings = {
    dots: true,
    autoplaySpped: 3000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <Arrow direction="prev" />,
    nextArrow: <Arrow direction="next" />,
    appendDots: (dots) => <ul>{dots}</ul>,
    customPaging: () => (
      <div className="ft-slick__dots--custom">
        <div className="loading" />
      </div>
    ),
  }
  // if autoplay is true and user navigates to other page, an error occurs in setState
  // when user navigates to other page, autoplay should be stopped
  // so we will use method, not props to play on mount and pause on unmount
  const ref = useRefWithCallback(
    (node) => {
      // componentDidMount
      // do delayed call to avoid deadlock
      setTimeout(() => {
        node.slickPlay()
      }, 100)
    },
    (node) => {
      // componentWillUnmount
      node.slickPause()
    },
  )

  return (
    <StyledSlick {...settings} ref={ref}>
      {[...children]}
    </StyledSlick>
  )
}

export default Slider
