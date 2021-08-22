import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { getDiceContract } from 'utils/contractHelpers'

const useDiceGame = () => {
  const [paused, setPaused] = useState(true)
  const [bankerEndBlock, setBankerEndBlock] = useState(ethers.BigNumber.from(0))
  const [playerEndBlock, setPlayerEndBlock] = useState(ethers.BigNumber.from(0))

  useEffect(() => {
    const diceContract = getDiceContract()
    async function fetchGameStatus() {
      const _paused = await diceContract.paused()
      if (mounted) {
        setPaused(_paused)
        if (_paused) {
          const _bankerEndBlock: ethers.BigNumber = await diceContract.bankerEndBlock()
          console.log('bankerEndBlock', _bankerEndBlock.toString())
          setBankerEndBlock(_bankerEndBlock)
        } else {
          const _playerEndBlock: ethers.BigNumber = await diceContract.playerEndBlock()
          console.log('playerEndBlock', _playerEndBlock.toString())
          setPlayerEndBlock(_playerEndBlock)
        }
      }
    }
    let mounted = true // don't call the state variable
    fetchGameStatus()

    diceContract.on('EndBankerTime', (epoch: ethers.BigNumber, blockNumber: ethers.BigNumber) => {
      console.log('EndBankerTime', epoch.toString(), blockNumber.toString())
      setPaused(false)
    })
    diceContract.on('EndPlayerTime', (epoch: ethers.BigNumber, blockNumber: ethers.BigNumber) => {
      console.log('EndPlayerTime', epoch.toString(), blockNumber.toString())
      setPaused(true)
    })
    diceContract.on('StartRound', (epoch: ethers.BigNumber, blockNumber: ethers.BigNumber, bankHash: string) => {
      console.log('StartRound', epoch.toString(), blockNumber.toString(), bankHash)
    })
    diceContract.on('LockRound', (epoch: ethers.BigNumber, blockNumber: ethers.BigNumber) => {
      console.log('LockRound', epoch.toString(), blockNumber.toString())
    })

    return function cleanup() {
      mounted = false // don't update the state variable on an unmount component
    }
  }, [])

  return { paused, bankerEndBlock, playerEndBlock }
}

export default useDiceGame
