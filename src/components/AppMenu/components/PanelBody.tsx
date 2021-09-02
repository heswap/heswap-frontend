import React from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router'
import { Box, MenuLink } from '@heswap/uikit'
import Accordion from './Accordion'
import { MenuEntry, LinkLabel, LinkStatus } from './MenuEntry'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {
  isMobile: boolean
}

const Container = styled.div<{ isPushed: boolean }>`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding: ${({ isPushed }) => isPushed ? '0 16px' : '0'};
`

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links }) => {
  const location = useLocation()

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined

  return (
    <Container isPushed={isPushed}>
      {links.map((entry) => {
        const iconElement = (
          <Box width="24px" mr="8px">
            {entry.icon}
          </Box>
        )
        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined

        if (entry.items) {
          const itemsMatchIndex = entry.items.findIndex((item) => item.href === location.pathname)
          const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0

          return (
            <Accordion
              key={entry.label}
              isPushed={isPushed}
              pushNav={pushNav}
              icon={iconElement}
              label={entry.label}
              status={entry.status}
              initialOpenState={initialOpenState}
              className={calloutClass}
              isActive={entry.items.some((item) => item.href === location.pathname)}
            >
              {isPushed && entry.items.map((item) => {
                let subIconElement = null
                if (item.icon) {
                  subIconElement = (
                    <Box width="24px" mr="8px">
                      {item.icon}
                    </Box>
                  )
                }
                return (
                  <MenuEntry key={item.href} secondary isActive={item.href === location.pathname} onClick={handleClick}>
                    <MenuLink href={item.href}>
                      {subIconElement}
                      <LinkLabel isPushed={isPushed}>{item.label}</LinkLabel>
                      {item.status && (
                        <LinkStatus color={item.status.color} fontSize="14px">
                          {item.status.text}
                        </LinkStatus>
                      )}
                    </MenuLink>
                  </MenuEntry>
                )
              })}
            </Accordion>
          )
        }
        return (
          <MenuEntry key={entry.label} isActive={entry.href === location.pathname} className={calloutClass}>
            <MenuLink href={entry.href} onClick={handleClick}>
              {iconElement}
              <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
              {entry.status && (
                <LinkStatus color={entry.status.color} fontSize="14px">
                  {entry.status.text}
                </LinkStatus>
              )}
            </MenuLink>
          </MenuEntry>
        )
      })}
    </Container>
  )
}

export default PanelBody
