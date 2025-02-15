import { BigNumber } from '@ethersproject/bignumber'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger'
import { init, useAccountCenter, useWallets } from '@web3-onboard/react'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'
import { Head } from 'components/common'
import config from 'config/seo_meta.json'
import { NETWORKS } from 'constants/networks'
import {
  useLoadSafeWallet,
  useLoadWalletFromLocalStorage,
  useStoreWalletsInLocalStorage,
} from 'hooks/Network'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { unpadLeadingZerosString } from 'utils/bigNumbers'
import { installJuiceboxWindowObject } from '../lib/juicebox'
import '../styles/index.scss'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

const injected = injectedModule()
const gnosis = gnosisModule()
const ledger = ledgerModule()
const trezor = trezorModule({
  appUrl: 'https://juicebox.money/',
  email: 'me.jango@protonmail.com',
})
const keystone = keystoneModule()
const walletConnect = walletConnectModule()
const coinbaseWalletSdk = coinbaseWalletModule()

init({
  wallets: [
    injected,
    gnosis,
    ledger,
    trezor,
    keystone,
    walletConnect,
    coinbaseWalletSdk,
  ],
  chains: Object.values(NETWORKS).map(n => ({
    id: unpadLeadingZerosString(BigNumber.from(n.chainId).toHexString()),
    rpcUrl: n.rpcUrl,
    token: n.token ?? 'ETH',
    label: n.label,
  })),
  appMetadata: {
    icon: '/assets/juice-logo-icon_black.png',
    name: config.title,
    description: config.description,
  },
})

export default function MyApp({ Component, pageProps }: AppProps) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  const updateAccountCenter = useAccountCenter()
  const loadWalletFromLocalStorage = useLoadWalletFromLocalStorage()
  const storeWalletsInLocalStorage = useStoreWalletsInLocalStorage()
  const loadSafeWallet = useLoadSafeWallet()
  const connectedWallets = useWallets()

  // If possible, load Safe wallets
  useEffect(() => {
    loadSafeWallet()
  }, [loadSafeWallet])

  // Load any previously connected wallets
  useEffect(() => {
    loadWalletFromLocalStorage()
  }, [loadWalletFromLocalStorage])

  // store any wallets
  useEffect(() => {
    storeWalletsInLocalStorage(connectedWallets)
  }, [storeWalletsInLocalStorage, connectedWallets])

  // disable account center in web3-onboard
  useEffect(() => {
    updateAccountCenter({ enabled: false })
  }, [updateAccountCenter])

  // run on initial mount
  useEffect(() => {
    installJuiceboxWindowObject()
  }, [])

  return (
    <>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
      </SessionContextProvider>
    </>
  )
}
