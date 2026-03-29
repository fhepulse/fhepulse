import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getDeployment } from './utils'

task('create-poll', 'Create a sample poll via PollFactory')
	.addOptionalParam('title', 'Poll title', 'Preferred L2 Scaling Solution?')
	.addOptionalParam('options', 'Number of options', '3')
	.addOptionalParam('mode', 'Voting mode: 0=Linear, 1=Quadratic', '0')
	.addOptionalParam('budget', 'Credit budget per voter', '100')
	.addOptionalParam('duration', 'Duration in seconds', '86400')
	.setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
		const { ethers, network } = hre

		const factoryAddress = getDeployment(network.name, 'PollFactory')
		if (!factoryAddress) {
			console.error(`No PollFactory deployment found for ${network.name}`)
			console.error(`Deploy first: npx hardhat deploy-fhepulse --network ${network.name}`)
			return
		}

		const [signer] = await ethers.getSigners()
		console.log(`Creating poll with account: ${signer.address}`)

		const factory = await ethers.getContractAt('PollFactory', factoryAddress)

		const deadline = Math.floor(Date.now() / 1000) + parseInt(taskArgs.duration)

		const tx = await factory.createPoll({
			title: taskArgs.title,
			description: 'Created via Hardhat task',
			optionCount: parseInt(taskArgs.options),
			deadline: deadline,
			votingMode: parseInt(taskArgs.mode),
			creditBudget: parseInt(taskArgs.budget),
		})

		const receipt = await tx.wait()
		console.log(`Poll created! Tx: ${tx.hash}`)

		const pollCount = await factory.getPollCount()
		const pollAddress = await factory.getPoll(pollCount - 1n)
		console.log(`Poll address: ${pollAddress}`)
		console.log(`Poll ID: ${pollCount - 1n}`)
	})
