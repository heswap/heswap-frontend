import React from 'react'
import styled from 'styled-components'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean
}

const StyledMenu = styled(ButtonMenu)`
  border: none;
  border-radius: 8px;
  background-color: rgb(16, 38, 72);
`

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  const { url } = useRouteMatch()
  const location = useLocation()
  const { t } = useTranslation()
  const { theme } = useTheme()

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
        <ButtonMenuItem
          height="48px"
          paddingX="16px"
          as={Link}
          to={`${url}`}
          variant={activeIndex === 0 ? 'primary' : 'text'}
          style={{
            borderRadius: '8px',
            paddingLeft: '16px',
            paddingRight: '16px',
            backgroundColor: activeIndex === 0 ? theme.colors.primary : 'transparent',
            fontSize: '14px'
          }}
        >
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <ButtonMenuItem
            height="48px"
            paddingX="16px"
            as={Link}
            to={`${url}/history`}
            style={{
              borderRadius: '8px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: activeIndex === 1 ? theme.colors.primary : 'transparent',
              fontSize: '14px'
            }}
          >
            {t('Finished')}
          </ButtonMenuItem>
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
  border-radius: 16px;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
