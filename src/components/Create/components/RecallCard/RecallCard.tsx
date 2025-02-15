import { t } from '@lingui/macro'
import { useCallback, useContext } from 'react'
import { WizardContext } from '../Wizard/contexts'
import { useFundingCycleRecallValue } from './hooks'

type PresentableRecall = 'fundingCycles' | 'fundingTarget'

const RecallOption: React.FC<{
  option: string
  value: string
  onClick: VoidFunction
}> = ({ option, value, onClick }) => {
  return (
    <div className="flex justify-between">
      <span>
        {option}: {value}
      </span>
      <a className="underline" onClick={onClick}>
        Edit
      </a>
    </div>
  )
}

const FundingCycleRecallOption: React.FC = () => {
  const { goToPage } = useContext(WizardContext)
  const fundingCycleRecallValue = useFundingCycleRecallValue()
  const onClick = useCallback(() => goToPage?.('fundingCycles'), [goToPage])

  if (!fundingCycleRecallValue) return null

  return (
    <RecallOption
      option={t`Cycle`}
      value={fundingCycleRecallValue}
      onClick={onClick}
    />
  )
}

export const RecallCard: React.FC<{
  show: PresentableRecall[]
}> = ({ show }) => {
  if (!show.length) return null

  return (
    <div className="flex w-full flex-col gap-2 bg-smoke-75 py-3 px-4 font-medium dark:bg-slate-600">
      {show.includes('fundingCycles') && <FundingCycleRecallOption />}
    </div>
  )
}
