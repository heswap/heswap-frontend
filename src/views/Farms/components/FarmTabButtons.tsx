import React from 'react'
import styled from 'styled-components'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean
}

const StyledMenu = styled(ButtonMenu)`
  border: none;
  border-radius: 8px;
  background-color: rgb(16, 38, 72);
`

const StyledMenuItem = styled(ButtonMenuItem).attrs(({ isActive }) => ({
  as: Link,
  variant: isActive ? 'primary' : 'text'
}))`
  height: 40px;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${({ isActive, theme }) => isActive ? theme.colors.primary : 'transparent'};
  color: ${({ isActive, theme }) => theme.colors[isActive ? 'backgroundAlt' : 'text']};
  font-size: 14px;
`

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  const { url } = useRouteMatch()
  const location = useLocation()
  const { t } = useTranslation()

  let activeIndex
  switch (location.pathname) {
    case '/farms':
      activeIndex = 0
      break
    case '/farms/history':
      activeIndex = 1
      break
    case '/farms/archived':
      activeIndex = 2
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <StyledMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <StyledMenuItem
          to={`${url}`}
          isActive={activeIndex === 0}
        >
          {t('Live')}
        </StyledMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <StyledMenuItem
            to={`${url}/history`}
            isActive={activeIndex === 1}
          >
            {t('Finished')}
          </StyledMenuItem>
        </NotificationDot>
      </StyledMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

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
