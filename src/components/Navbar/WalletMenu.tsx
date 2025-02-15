import { CrownOutlined, LogoutOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Dropdown } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import Balance from './Balance'

export default function WalletMenu({ userAddress }: { userAddress: string }) {
  const isMobile = useMobile()

  const { disconnect } = useWallet()

  const CopyableAddress = () => (
    <div className="text-black dark:text-slate-100">
      <EtherscanLink value={userAddress} type="address" truncated />{' '}
      <CopyTextButton value={userAddress} className="z-10" />
    </div>
  )

  const MyProjects = () => (
    <>
      <Link href={`/account/${userAddress}`}>
        <a className="font-base text-black dark:text-slate-100">
          <Trans>My account</Trans>
        </a>
      </Link>
      <CrownOutlined className="text-black dark:text-slate-100" />
    </>
  )

  const Disconnect = () => (
    <>
      <span className="text-black dark:text-slate-100">
        <Trans>Disconnect</Trans>
      </span>
      <LogoutOutlined className="text-black dark:text-slate-100" rotate={-90} />
    </>
  )

  const items: ItemType[] = [
    {
      key: 0,
      label: <CopyableAddress />,
    },
    {
      key: 1,
      label: <MyProjects />,
    },
  ]
  if (!isMobile) {
    items.push({
      key: 2,
      label: <Disconnect />,
      onClick: async () => {
        await disconnect()
      },
    })
  }

  return (
    <Dropdown
      menu={{ items }}
      placement={!isMobile ? 'bottomRight' : 'top'}
      overlayClassName="p-0"
    >
      <div className="flex h-11 w-full cursor-default select-all flex-col items-center rounded-lg bg-smoke-75 px-5 pt-1 pb-2 dark:bg-slate-400">
        <FormattedAddress
          address={userAddress}
          tooltipDisabled
          className="font-normal"
        />
        <Balance address={userAddress} hideTooltip />
      </div>
    </Dropdown>
  )
}
