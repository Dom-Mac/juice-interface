import { Contract } from '@ethersproject/contracts'

export enum V2V3ContractName {
  JBController = 'JBController',
  JBController3_0_1 = 'JBController3_0_1',
  JBController3_1 = 'JBController3_1',
  JBDirectory = 'JBDirectory',
  JBETHPaymentTerminal = 'JBETHPaymentTerminal',
  JBETHPaymentTerminal3_1 = 'JBETHPaymentTerminal3_1',
  JBFundingCycleStore = 'JBFundingCycleStore',
  JBFundAccessConstraintsStore = 'JBFundAccessConstraintsStore',
  JBOperatorStore = 'JBOperatorStore',
  JBProjects = 'JBProjects',
  JBSplitsStore = 'JBSplitsStore',
  JBTokenStore = 'JBTokenStore',
  JBSingleTokenPaymentTerminalStore = 'JBSingleTokenPaymentTerminalStore',
  JBETHERC20ProjectPayerDeployer = 'JBETHERC20ProjectPayerDeployer',
  JBETHERC20SplitsPayerDeployer = 'JBETHERC20SplitsPayerDeployer',
  JBPrices = 'JBPrices',

  DeprecatedJBSplitsStore = 'DeprecatedJBSplitsStore',
  DeprecatedJBDirectory = 'DeprecatedJBDirectory',
}

export type V2V3Contracts = Record<V2V3ContractName, Contract>
