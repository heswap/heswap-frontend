import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, CopyIcon } from '@heswap/uikit'

interface Props {
  toCopy: string
}

const StyleButton = styled(Text).attrs({ role: 'button' })`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
`

const CopyToClipboard: React.FC<Props> = ({ toCopy, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  const copyToClipboardWithCommand = (content: string) => {
    const el = document.createElement('textarea')
    el.value = content
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  function displayTooltip() {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }

  return (
    <StyleButton
      small
      bold
      onClick={() => {
        if (navigator.clipboard && navigator.permissions) {
          navigator.clipboard.writeText(toCopy).then(() => displayTooltip())
        } else if (document.queryCommandSupported('copy')) {
          copyToClipboardWithCommand(toCopy)
          displayTooltip()
        }
      }}
      {...props}
    >
      {isTooltipDisplayed ? <Text color="primary">Copied</Text> : <Text color="primary">Copy</Text>}
      <CopyIcon width="20px" color="primary" ml="4px" />
    </StyleButton>
  )
}

export default CopyToClipboard
