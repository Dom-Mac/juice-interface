import { Contract } from '@ethersproject/contracts'
import { JB721DelegateVersion } from 'models/nftRewards'
import { createContext } from 'react'

export interface JB721DelegateContracts {
  JB721TieredDelegate?: Contract
  JB721TieredDelegateStore?: Contract
}

export interface JB721DelegateContractsLoading {
  JB721TieredDelegateStoreLoading?: boolean
}

export const JB721DelegateContractsContext = createContext<{
  contracts: JB721DelegateContracts
  loading: JB721DelegateContractsLoading
  version: JB721DelegateVersion | undefined
}>({
  contracts: {},
  loading: {},
  version: undefined,
})
