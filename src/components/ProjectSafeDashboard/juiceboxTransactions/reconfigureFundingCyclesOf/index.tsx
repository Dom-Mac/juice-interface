import { t } from '@lingui/macro'
import { useTransactionVersion } from './hooks/TransactionVersion'
import { SafeTransactionComponentProps } from '../../SafeTransaction'
import { TransactionCollapse } from '../../TransactionCollapse'
import { ReconfigureRichPreview } from './ReconfigurationRichPreview'

export function ReconfigureFundingCyclesOfTransaction({
  transaction,
  selected,
  isPastTransaction,
}: SafeTransactionComponentProps) {
  const txVersion = useTransactionVersion(transaction)

  return (
    <TransactionCollapse
      transaction={transaction}
      title={t`Edit cycle`}
      isPastTransaction={isPastTransaction}
      cv={txVersion}
      selected={selected}
      expandedContent={
        <ReconfigureRichPreview
          transaction={transaction}
          isPastTransaction={isPastTransaction}
        />
      }
    />
  )
}
