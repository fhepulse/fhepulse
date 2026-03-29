import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { saveDeployment } from './utils'

task('deploy-fhepulse', 'Deploy the PollFactory contract').setAction(async (_, hre: HardhatRuntimeEnvironment) => {
	const { ethers, network } = hre

	console.log(`Deploying PollFactory to ${network.name}...`)

	const [deployer] = await ethers.getSigners()
	console.log(`Deploying with account: ${deployer.address}`)

	const PollFactory = await ethers.getContractFactory('PollFactory')
	const factory = await PollFactory.deploy()
	await factory.waitForDeployment()

	const factoryAddress = await factory.getAddress()
	console.log(`PollFactory deployed to: ${factoryAddress}`)

	saveDeployment(network.name, 'PollFactory', factoryAddress)

	return factoryAddress
})
