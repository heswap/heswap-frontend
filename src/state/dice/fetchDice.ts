import { BigNumber } from 'ethers'
import Dice from 'config/abi/dice/Dice.json'
import { getDiceContract } from 'utils/contractHelpers'
import { getDiceAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import { DiceRound, DiceRoundResult, BetInfo, DiceHistoryRecord } from './types'
import { updateState } from './index'

function convertRoundResult(roundResult: DiceRoundResult): DiceRound {
  const round: DiceRound = {
    startBlock: roundResult.startBlock.toString(),
    lockBlock: roundResult.lockBlock.toString(),
    secretSentBlock: roundResult.secretSentBlock.toString(),
    bankHash: roundResult.bankHash,
    bankSecret: roundResult.bankSecret.toString(),
    totalAmount: roundResult.totalAmount.toString(),
    maxBetAmount: roundResult.maxBetAmount.toString(),
    lcBackAmount: roundResult.lcBackAmount.toString(),
    bonusAmount: roundResult.bonusAmount.toString(),
    swapLcAmount: roundResult.swapLcAmount.toString(),
    betUsers: roundResult.betUsers.toString(),
    finalNumber: roundResult.finalNumber,
    status: roundResult.status
  }
  if (roundResult.betAmounts) {
    round.betAmounts = []
    for (let i = 0; i < roundResult.betAmounts.length; i++) {
      round.betAmounts.push(roundResult.betAmounts[i].toString())
    }
  }
  return round
}

export const fetchDice = (account: string) => async (dispatch, getState) => {
  const diceAddr = getDiceAddress()
  const gameCalls = [{
    address: diceAddr,
    name: 'paused'
  },{
    address: diceAddr,
    name: 'bankerTimeBlocks'
  },{
    address: diceAddr,
    name: 'playerTimeBlocks'
  },{
    address: diceAddr,
    name: 'bankerEndBlock'
  },{
    address: diceAddr,
    name: 'playerEndBlock'
  },{
    address: diceAddr,
    name: 'currentEpoch'
  },{
    address: diceAddr,
    name: 'intervalBlocks'
  }]
  const [
    _paused,
    _bankerTimeBlocks,
    _playerTimeBlocks,
    _bankerEndBlock,
    _playerEndBlock,
    _currentEpoch,
    _intervalBlocks
  ] = await multicall(Dice.abi, gameCalls)
  const paused: boolean = _paused[0] // hack due to multicall
  const bankerTimeBlocks: BigNumber = _bankerTimeBlocks[0]
  const playerTimeBlocks: BigNumber = _playerTimeBlocks[0]
  const bankerEndBlock: BigNumber = _bankerEndBlock[0]
  const playerEndBlock: BigNumber = _playerEndBlock[0]
  const currentEpoch: BigNumber = _currentEpoch[0]
  const intervalBlocks: BigNumber = _intervalBlocks[0]
  const diceContract = getDiceContract()
  const { dice } = getState()
  let prevEpoch = dice.currentEpoch
  let prevDrawnNumber = null
  if (prevEpoch !== currentEpoch.toString()) {
    console.log('prevEpoch', prevEpoch)
    console.log('currentEpoch', currentEpoch)
    if (!prevEpoch) {
      prevEpoch = currentEpoch.sub(1)
    }
    const roundResult = await diceContract.rounds(prevEpoch)
    const round = convertRoundResult(roundResult)
    prevDrawnNumber = round.finalNumber
    console.log('prevDrawnNumber', prevDrawnNumber)
  }
  let claimable = false
  let currentRound: DiceRound = null
  let rounds: Array<DiceRound> = []
  const publicHistoryRecords: Array<DiceHistoryRecord> = []
  const privateHistoryRecords: Array<DiceHistoryRecord> = []
  if (currentEpoch.gt(0)) {
    // public history
    let end: BigNumber = currentEpoch.sub(20) // fetch 20 records, not 100 records
    if (end.lt(1)) {
      end = BigNumber.from(1)
    }
    const claimableAndRoundCalls = [{
      address: diceAddr,
      name: 'claimable',
      params: [currentEpoch.sub(1), account]
    }]
    for (let i: BigNumber = currentEpoch; i.gte(end); i = i.sub(1)) {
      claimableAndRoundCalls.push({
        address: diceAddr,
        name: 'rounds',
        params: [i]
      })
    }
    const [
      _claimable,
      _currentRound,
      ..._rounds
    ] = await multicall(Dice.abi, claimableAndRoundCalls)
    claimable = _claimable[0] // hack due to multicall
    console.log('claimable', claimable)
    currentRound = convertRoundResult(_currentRound)
    rounds = _rounds.map(_round => convertRoundResult(_round))
    // private history
    const [userRounds, newPos] = await diceContract.getUserRounds(account, BigNumber.from(0), BigNumber.from(20))
    const privateCalls = []
    for (let j = 0; j < userRounds.length; j++) {
      privateCalls.push({
        address: diceAddr,
        name: 'rounds',
        params: [userRounds[j]]
      })
      privateCalls.push({
        address: diceAddr,
        name: 'ledger',
        params: [userRounds[j], account]
      })
    }
    const privateResults: Array<any> = await multicall(Dice.abi, privateCalls)
    const now = Math.floor(new Date().getTime() / 1000)
    for (let j = 0; j < userRounds.length; j++) {
      const roundResult: DiceRoundResult = privateResults[j * 2]
      const betInfo: BetInfo = privateResults[j * 2 + 1]
      privateHistoryRecords.push({
        betHash:  roundResult.bankHash,
        account,
        betNums: betInfo.numbers,
        betAmount: betInfo.amount.toString(),
        outcome: roundResult.finalNumber,
        time: now - roundResult.startBlock.sub(currentEpoch).toNumber() * 3,
        roll: 0,
        profit: 0.125
      })
    }
  }
  dispatch(updateState({
    paused,
    bankerTimeBlocks: bankerTimeBlocks.toString(),
    playerTimeBlocks: playerTimeBlocks.toString(),
    currentGame: {
      bankerEndBlock: bankerEndBlock.toString(),
      playerEndBlock: playerEndBlock.toString()
    },
    currentEpoch: currentEpoch.toString(),
    intervalBlocks: intervalBlocks.toString(),
    prevDrawnNumber,
    claimable,
    currentRound,
    rounds,
    publicHistoryRecords,
    privateHistoryRecords
  }))
}

export default null
