import { BigNumber } from '@ethersproject/bignumber'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { V2V3ContractName } from 'models/v2v3/contracts'

import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useContractReader from './V2ContractReader'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUserUnclaimedTokenBalance() {
  const { userAddress } = useWallet()
  const { projectId } = useContext(ProjectMetadataContext)

  return useContractReader<BigNumber>({
    contract: V2V3ContractName.JBTokenStore,
    functionName: 'unclaimedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
  })
}
