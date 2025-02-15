import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Skeleton, Space, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v2v3/shared/SplitList'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useProjectReservedTokens } from 'hooks/v2v3/contractReader/ProjectReservedTokens'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { Split } from 'models/splits'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { settingsPagePath } from 'utils/routes'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { formatReservedRate } from 'utils/v2v3/math'
import { reloadWindow } from 'utils/windowUtils'
import DistributeReservedTokensModal from './modals/DistributeReservedTokensModal'

export default function ReservedTokensSplitsCard({
  hideDistributeButton,
  reservedTokensSplits,
  reservedRate,
}: {
  hideDistributeButton?: boolean
  reservedTokensSplits: Split[] | undefined
  reservedRate: BigNumber | undefined
}) {
  const { tokenSymbol, projectOwnerAddress, handle } =
    useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const effectiveReservedRate = reservedRate ?? BigNumber.from(0)

  const [
    distributeReservedTokensModalVisible,
    setDistributeReservedTokensModalVisible,
  ] = useState<boolean>()
  const { data: reservedTokens, loading: loadingReservedTokens } =
    useProjectReservedTokens({
      projectId,
      reservedRate: reservedRate,
    })
  const canEditTokens = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.SET_SPLITS,
  )

  const tokensText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const distributeButtonDisabled = reservedTokens?.eq(0)

  function DistributeButton(): JSX.Element {
    return (
      <Button
        type="ghost"
        size="small"
        onClick={() => setDistributeReservedTokensModalVisible(true)}
        disabled={distributeButtonDisabled}
      >
        <Trans>Send {tokensText}</Trans>
      </Button>
    )
  }

  return (
    <CardSection>
      <Space direction="vertical" size="large" className="w-full">
        {hideDistributeButton ? null : (
          <div className="flex flex-wrap justify-between gap-2">
            <div className="mr-12 leading-10">
              <Skeleton
                className="inline"
                active
                loading={loadingReservedTokens}
                paragraph={{ rows: 1, width: 20 }}
                title={false}
              >
                <span className="text-primary text-base font-medium">
                  {formatWad(reservedTokens, { precision: 0 })}
                </span>
              </Skeleton>{' '}
              <TooltipLabel
                className="cursor-default whitespace-nowrap text-xs font-medium text-grey-900 dark:text-slate-100"
                label={
                  <span className="uppercase text-grey-500 dark:text-slate-100">
                    <Trans>{tokensText} reserved</Trans>
                  </span>
                }
                tip={
                  <Trans>
                    Project tokens currently reserved for the recipients below.
                    These tokens can be sent out at any time.
                  </Trans>
                }
              />
            </div>
            {reservedTokens?.eq(0) ? (
              <Tooltip title={t`No reserved tokens to send.`}>
                <div>
                  <DistributeButton />
                </div>
              </Tooltip>
            ) : (
              <DistributeButton />
            )}
          </div>
        )}

        <div>
          <div className="flex flex-wrap justify-between gap-2 leading-10">
            <TooltipLabel
              label={
                <h3 className="inline-block text-sm uppercase text-black dark:text-slate-100">
                  <Trans>Reserved tokens</Trans> (
                  {formatReservedRate(reservedRate)}%)
                </h3>
              }
              tip={
                <Trans>
                  Projects can reserve a percentage of token issuance for the
                  recipients set by the project owner.
                </Trans>
              }
            />
            {canEditTokens && reservedRate?.gt(0) ? (
              <Link
                href={settingsPagePath('reservedtokens', {
                  projectId,
                  handle,
                })}
              >
                <Button
                  className="mb-4"
                  size="small"
                  icon={<SettingOutlined />}
                >
                  <span>
                    <Trans>Edit recipients</Trans>
                  </span>
                </Button>
              </Link>
            ) : null}
          </div>
          {effectiveReservedRate.gt(0) ? (
            reservedTokensSplits ? (
              <SplitList
                splits={reservedTokensSplits}
                projectOwnerAddress={projectOwnerAddress}
                totalValue={undefined}
                reservedRate={parseFloat(formatReservedRate(reservedRate))}
              />
            ) : null
          ) : (
            <span className="text-grey-500 dark:text-slate-100">
              <Trans>This project doesn't reserve any tokens.</Trans>
            </span>
          )}
        </div>
      </Space>

      <DistributeReservedTokensModal
        open={distributeReservedTokensModalVisible}
        onCancel={() => setDistributeReservedTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </CardSection>
  )
}
