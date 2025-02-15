import { BigNumber } from '@ethersproject/bignumber'

import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'
import { Json, primitives } from '../../json'
import { TerminalEventEntity } from '../base/terminal-event'
import { parseBigNumberKeyVals } from 'utils/graph'

export interface DistributeToPayoutSplitEvent
  extends BaseEventEntity,
    BaseProjectEntity,
    TerminalEventEntity {
  domain: BigNumber
  group: BigNumber
  amount: BigNumber
  amountUSD: BigNumber
  preferClaimed: boolean
  preferAddToBalance: boolean
  percent: number
  splitProjectId: number
  beneficiary: string
  lockedUntil: number
  allocator: string
  distributePayoutsEvent: string
}

export const parseDistributeToPayoutSplitEventJson = (
  j: Json<DistributeToPayoutSplitEvent>,
): DistributeToPayoutSplitEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, ['domain', 'group', 'amount', 'amountUSD']),
})
