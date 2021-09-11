import React, { useMemo, useState, useEffect, useRef } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box, Heading } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { noop } from 'lodash'
import moment from 'moment'
import { useBlock } from 'state/hooks'
import { Dice } from 'state/types'
import ApprovalAction from './ApprovalAction'
import DepositActions from './DepositActions'

const InlineText = styled(Text)`
  display: inline;
`

const Clock = styled.div`
  width: 100%;
  text-align: center;
  margin-top: -30px !important;
  margin-bottom: 10px;
`

const Label = styled(Heading).attrs({
  as: 'h3',
  scale: 'md',
})`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 300;
  line-height: 1.4;
`

const BankerTimeLabel = styled(Heading).attrs({
  as: 'h2',
  scale: 'xl',
})`
  color: ${({ theme }) => theme.colors.success};
  font-family: monospace;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.4;
`

const PlayerTimeLabel = styled(Heading).attrs({
  as: 'h2',
  scale: 'xl',
})`
  color: ${({ theme }) => theme.colors.success};
  font-family: monospace;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.4;
`

interface CardActionsProps {
  dice: Dice
  withdrawableAmount: BigNumber
  referrer: string
}

const CardActions: React.FC<CardActionsProps> = ({ dice, withdrawableAmount, referrer }) => {
  const { depositToken, userData, paused, currentGame, intervalBlocks, currentRound } = dice

  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const depositTokenBalance = userData?.depositTokenBalance ? new BigNumber(userData.depositTokenBalance) : BIG_ZERO
  const [bankerTimeLeft, setBankerTimeLeft] = useState<number>(null)
  const [playerTimeLeft, setPlayerTimeLeft] = useState<number>(null)
  const { currentBlock } = useBlock()
  const needsApproval = !allowance.gt(0)
  const isDeposited = withdrawableAmount.gt(0)
  const isLoading = !userData
  const bankerTimerRef = useRef(null)
  const playerTimerRef = useRef(null)
  const [roundNum, setRoundNum] = useState<number>(null)

  useEffect(() => {
    if (bankerTimerRef) {
      clearInterval(bankerTimerRef.current)
    }
    if (currentBlock === 0 || !currentGame || !paused) {
      return () => {
        noop()
      }
    }
    let timeLeft: number = new BigNumber(currentGame.bankerEndBlock)
      .minus(new BigNumber(currentBlock))
      .times(3)
      .toNumber() // each block is nearly 3 seconds in bsc
    bankerTimerRef.current = setInterval(() => {
      setBankerTimeLeft(timeLeft)
      timeLeft--
    }, 1000)
    return () => {
      if (bankerTimerRef) {
        clearInterval(bankerTimerRef.current)
      }
    }
  }, [currentBlock, currentGame, paused])

  useEffect(() => {
    if (playerTimerRef) {
      clearInterval(playerTimerRef.current)
    }
    if (currentBlock === 0 || !currentGame || paused) {
      return () => {
        noop()
      }
    }
    let timeLeft: number = new BigNumber(currentGame.playerEndBlock)
      .minus(new BigNumber(currentBlock))
      .times(3)
      .toNumber() // each block is nearly 3 seconds in bsc
    playerTimerRef.current = setInterval(() => {
      setPlayerTimeLeft(timeLeft)
      timeLeft--
    }, 1000)
    return () => {
      if (playerTimerRef) {
        clearInterval(playerTimerRef.current)
      }
    }
  }, [currentBlock, currentGame, paused])

  useEffect(() => {
    if (!playerTimeLeft || !intervalBlocks) {
      setRoundNum(null)
      return
    }
    const roundTime = new BigNumber(intervalBlocks).toNumber() * 3 // in seconds
    const v = Math.floor((playerTimeLeft + roundTime - 1) / roundTime)
    setRoundNum(v)
  }, [playerTimeLeft, intervalBlocks])

  const roundTimeLabel = useMemo(() => {
    if (!playerTimeLeft || !intervalBlocks) {
      return ''
    }
    const roundTime = new BigNumber(intervalBlocks).toNumber() * 3 // in seconds
    const optionalPrefix = moment
      .duration(playerTimeLeft % roundTime, 'seconds')
      .format('y [years] w [weeks] d [days] h')
    const requiredSurfix = moment.duration(playerTimeLeft % roundTime, 'seconds').format('mm:ss', { trim: false })
    if (optionalPrefix === '0') {
      return requiredSurfix
    }
    return `${optionalPrefix}:${requiredSurfix}`
  }, [playerTimeLeft, intervalBlocks])

  const bankerTimeLabel = useMemo(() => {
    if (!bankerTimeLeft) {
      return ''
    }
    const optionalPrefix = moment
      .duration(bankerTimeLeft, 'seconds')
      .format('y [years] w [weeks] d [days] h:mm:ss', { trim: false })
    const requiredSurfix = moment.duration(bankerTimeLeft, 'seconds').format('mm:ss', { trim: false })
    if (Math.abs(bankerTimeLeft) < 3600) {
      return requiredSurfix
    }
    return optionalPrefix
  }, [bankerTimeLeft])

  return (
    <Flex flexDirection="column">
      {paused ? (
        <Clock>
          <Label>Now Banker Time</Label>
          <BankerTimeLabel>{bankerTimeLabel}</BankerTimeLabel>
        </Clock>
      ) : (
        <Clock>
          <Label>Now Player Time</Label>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
            <div>
              <Label>Round</Label>
              <PlayerTimeLabel>{roundNum}</PlayerTimeLabel>
            </div>
            <div>
              <Label>Time Left</Label>
              <PlayerTimeLabel>{roundTimeLabel}</PlayerTimeLabel>
            </div>
          </div>
        </Clock>
      )}
      <Flex flexDirection="column">
        <Box display="inline">
          <InlineText color={isDeposited ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isDeposited ? depositToken.symbol : t('Deposit')}{' '}
          </InlineText>
          <InlineText color={isDeposited ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isDeposited ? t('Deposited') : `${depositToken.symbol}`}
          </InlineText>
        </Box>
        {needsApproval ? (
          <ApprovalAction dice={dice} isLoading={isLoading} />
        ) : (
          <DepositActions
            isLoading={isLoading}
            dice={dice}
            depositTokenBalance={depositTokenBalance}
            withdrawableAmount={withdrawableAmount}
            isDeposited={isDeposited}
            referrer={referrer}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions
