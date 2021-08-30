import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1) should always be at the top of the file.
   */
  {
    pid: 1,
    lpSymbol: 'LC-BNB LP',
    lpAddresses: {
      97: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // BUSDImplementation
      56: '',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '0x64F65d6e869E6e31b2CCF1627D1CC6491C0D8561',
      56: '',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
]

export default farms
