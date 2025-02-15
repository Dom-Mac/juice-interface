import { CrownFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { isEqualAddress } from 'utils/address'

export function ETHAddressBeneficiary({
  beneficaryAddress,
  projectOwnerAddress,
}: {
  beneficaryAddress: string | undefined
  projectOwnerAddress: string | undefined
}) {
  const isProjectOwner = isEqualAddress(projectOwnerAddress, beneficaryAddress)

  return (
    <div className="flex items-baseline font-medium">
      {beneficaryAddress ? (
        <FormattedAddress address={beneficaryAddress} />
      ) : null}
      {!beneficaryAddress && isProjectOwner ? (
        <Trans>Project owner (you)</Trans>
      ) : null}
      {isProjectOwner && (
        <span className="text-primary ml-1">
          <Tooltip title={<Trans>Project owner</Trans>}>
            <CrownFilled />
          </Tooltip>
        </span>
      )}
      :
    </div>
  )
}
