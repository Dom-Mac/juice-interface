import { t } from '@lingui/macro'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'

export function useV3IssueErc20TokenTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts, cv } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ name, symbol }, txOpts) => {
    try {
      invariant(
        transactor && projectId && contracts?.JBTokenStore && name && symbol,
      )
      return transactor(
        contracts.JBTokenStore,
        'issueFor',
        [projectId, name, symbol],
        {
          ...txOpts,
          title: t`Issue $${symbol}`,
        },
      )
    } catch {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.JBTokenStore
        ? 'contracts.JBTokenStore'
        : !name
        ? 'name'
        : !symbol
        ? 'symbol'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'issueTokenFor',
        cv,
      })
    }
  }
}
