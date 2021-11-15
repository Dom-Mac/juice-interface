import { Layout, Modal, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { Alert } from 'antd'
import { readNetwork } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { readProvider } from 'constants/readProvider'

import Navbar from './Navbar'
import Router from './Router'

function App() {
  const [switchNetworkModalVisible, setSwitchNetworkModalVisible] = useState<
    boolean
  >()

  const { signerNetwork } = useContext(NetworkContext)
  const [isInfuraDown, setIsInfuraDown] = useState(false);

  const networkName = readNetwork.name

  const supportedNetworks: NetworkName[] = [
    NetworkName.mainnet,
    NetworkName.rinkeby,
  ]

  const testInfura = async () => {
    try {
      let _ = await readProvider.getGasPrice();
      console.log('Infura is healthy');
    } catch (e) {
      setIsInfuraDown(true);
      console.log('Inufura is down');
    }
  }

  useEffect(() => {
    testInfura();
  }, []);

  useLayoutEffect(() => {
    if (!signerNetwork) return

    setSwitchNetworkModalVisible(signerNetwork !== networkName)
  }, [setSwitchNetworkModalVisible, signerNetwork])

  return (
    <>
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'transparent',
        }}
      >
        {isInfuraDown && <Alert
          message="⚠️ We are experiencing rate limiting issues from inufra.io. Please connect a wallet to proceed as normal, for the time being. ⚠️"
          type="error"
          style={{ textAlign: "center", fontWeight: 450 }}
        />}
        <Navbar />
        <Content>
          <Router />
        </Content>
      </Layout>

      <Modal
        visible={switchNetworkModalVisible}
        centered
        closable={false}
        footer={null}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
          }}
        >
          <Space direction="vertical">
            <h2>Connect wallet to {networkName}</h2>
            <div>Or, go to:</div>
            {supportedNetworks
              .filter(n => process.env.REACT_APP_INFURA_NETWORK !== n)
              .map(_n => {
                const subDomain = _n === NetworkName.mainnet ? '' : _n + '.'

                return (
                  <a key={_n} href={`https://${subDomain}juicebox.money`}>
                    {subDomain}juicebox.money
                  </a>
                )
              })}
          </Space>
        </div>
      </Modal>
    </>
  )
}

export default App
