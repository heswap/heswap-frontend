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
  background-color: ${({ theme }) => theme.colors.dropdown};
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
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <StyledMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem
          as={Link}
          to={url}
          isActive={activeIndex === 0}
          variant={activeIndex === 0 ? 'primary' : 'text'}
          style={{
            height: '40px',
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '8px',
            paddingLeft: '16px',
            paddingRight: '16px',
            backgroundColor: activeIndex === 0 ? theme.colors.primary : 'transparent',
            color: theme.colors[activeIndex === 0 ? 'backgroundAlt' : 'text'],
            fontSize: '14px'
          }}
        >
          {t('Live')}
        </ButtonMenuItem>
        <ButtonMenuItem
          as={Link}
          to={`${url}/history`}
          isActive={activeIndex === 1}
          variant={activeIndex === 1 ? 'primary' : 'text'}
          style={{
            height: '40px',
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '8px',
            paddingLeft: '16px',
            paddingRight: '16px',
            backgroundColor: activeIndex === 1 ? theme.colors.primary : 'transparent',
            color: theme.colors[activeIndex === 1 ? 'backgroundAlt' : 'text'],
            fontSize: '14px'
          }}
        >
          <NotificationDot show={hasStakeInFinishedFarms}>
            <span>{t('Finished')}</span>
          </NotificationDot>
        </ButtonMenuItem>
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
