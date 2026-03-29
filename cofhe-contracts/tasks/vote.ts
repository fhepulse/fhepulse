import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { cofhejs, Encryptable } from 'cofhejs/node'
import { cofhejs_initializeWithHardhatSigner } from 'cofhe-hardhat-plugin'
import { getDeployment } from './utils'

task('vote', 'Submit an encrypted vote to a poll')
	.addParam('poll', 'Poll contract address')
	.addParam('weights', 'Comma-separated weights per option (e.g., "30,50,20")')
	.setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
		const { ethers } = hre

		const [signer] = await ethers.getSigners()
		console.log(`Voting with account: ${signer.address}`)

		await cofhejs_initializeWithHardhatSigner(signer)

		const poll = await ethers.getContractAt('Poll', taskArgs.poll)

		const weights = taskArgs.weights.split(',').map((w: string) => BigInt(w.trim()))
		console.log(`Encrypting weights: [${weights.join(', ')}]`)

		const encryptables = weights.map((w: bigint) => Encryptable.uint32(w))
		const encryptedResult = await cofhejs.encrypt(encryptables as any)

		if (encryptedResult && encryptedResult.data) {
			console.log('Submitting encrypted vote...')
			const tx = await poll.vote(encryptedResult.data)
			await tx.wait()
			console.log(`Vote submitted! Tx: ${tx.hash}`)
		} else {
			console.error('Encryption failed')
		}
	})
