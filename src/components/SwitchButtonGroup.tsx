import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useLocation, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@heswap/uikit'
import useTheme from 'hooks/useTheme'

interface SwitchButtonProps {
  url: string
  node: ReactNode
}

interface SwitchButtonGroupProps {
  buttons: Array<SwitchButtonProps>
}

const StyledMenu = styled(ButtonMenu)`
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.dropdown};
`

const SwitchButtonGroup: React.FC<SwitchButtonGroupProps> = ({ buttons }) => {
  const location = useLocation()
  const { theme } = useTheme()

  const activeIndex = buttons.findIndex(x => x.url === location.pathname + location.search)

  return (
    <Wrapper>
      <StyledMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        {buttons.map((button, index) => (
          <ButtonMenuItem
            key={index.toString()}
            as={Link}
            to={button.url}
            isActive={activeIndex === index}
            variant={activeIndex === index ? 'primary' : 'text'}
            style={{
              height: '40px',
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '8px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: activeIndex === index ? theme.colors.primary : 'transparent',
              color: theme.colors[activeIndex === index ? 'backgroundAlt' : 'text'],
              fontSize: '14px'
            }}
          >
            {button.node}
          </ButtonMenuItem>
        ))}
      </StyledMenu>
    </Wrapper>
  )
}

export default SwitchButtonGroup

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii.card};

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
