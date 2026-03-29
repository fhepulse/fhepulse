import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'
import { cofhejs, Encryptable, FheTypes } from 'cofhejs/node'
import { time } from '@nomicfoundation/hardhat-network-helpers'

describe('FhePulse', function () {
	// Voting modes
	const LINEAR = 0
	const QUADRATIC = 1

	async function deployFactoryFixture() {
		const [deployer, creator, donor, participant1, participant2] = await hre.ethers.getSigners()

		const PollFactory = await hre.ethers.getContractFactory('PollFactory')
		const factory = await PollFactory.deploy()

		return { factory, deployer, creator, donor, participant1, participant2 }
	}

	async function createLinearPollFixture() {
		const { factory, deployer, creator, donor, participant1, participant2 } = await loadFixture(deployFactoryFixture)

		const deadline = (await time.latest()) + 86400 // 1 day from now

		const tx = await factory.connect(creator).createPoll({
			title: 'Test Linear Poll',
			description: 'A test poll with linear voting',
			optionCount: 3,
			deadline: deadline,
			votingMode: LINEAR,
			creditBudget: 100,
		})

		const pollCount = await factory.getPollCount()
		const pollAddress = await factory.getPoll(pollCount - 1n)
		const poll = await hre.ethers.getContractAt('Poll', pollAddress)

		return { factory, poll, pollAddress, deployer, creator, donor, participant1, participant2, deadline }
	}

	async function createQuadraticPollFixture() {
		const { factory, deployer, creator, donor, participant1, participant2 } = await loadFixture(deployFactoryFixture)

		const deadline = (await time.latest()) + 86400

		await factory.connect(creator).createPoll({
			title: 'Test Quadratic Poll',
			description: 'A test poll with quadratic voting',
			optionCount: 3,
			deadline: deadline,
			votingMode: QUADRATIC,
			creditBudget: 100,
		})

		const pollCount = await factory.getPollCount()
		const pollAddress = await factory.getPoll(pollCount - 1n)
		const poll = await hre.ethers.getContractAt('Poll', pollAddress)

		return { factory, poll, pollAddress, deployer, creator, donor, participant1, participant2, deadline }
	}

	describe('PollFactory', function () {
		it('should deploy factory', async function () {
			const { factory } = await loadFixture(deployFactoryFixture)
			expect(await factory.getPollCount()).to.equal(0)
		})

		it('should create a poll and track it', async function () {
			const { factory, creator } = await loadFixture(deployFactoryFixture)
			const deadline = (await time.latest()) + 86400

			await factory.connect(creator).createPoll({
				title: 'My Poll',
				description: 'Description',
				optionCount: 3,
				deadline: deadline,
				votingMode: LINEAR,
				creditBudget: 100,
			})

			expect(await factory.getPollCount()).to.equal(1)
			const pollAddress = await factory.getPoll(0)
			expect(pollAddress).to.not.equal(hre.ethers.ZeroAddress)

			const creatorPollIds = await factory.getCreatorPollIds(creator.address)
			expect(creatorPollIds.length).to.equal(1)
			expect(creatorPollIds[0]).to.equal(0)
		})
	})

	describe('Poll Lifecycle', function () {
		beforeEach(function () {
			if (!hre.cofhe.isPermittedEnvironment('MOCK')) this.skip()
		})

		afterEach(function () {
			if (!hre.cofhe.isPermittedEnvironment('MOCK')) return
		})

		it('should start as SeekingFunding', async function () {
			const { poll } = await loadFixture(createLinearPollFixture)
			expect(await poll.status()).to.equal(0) // SeekingFunding
		})

		it('should activate on funding', async function () {
			const { poll, donor } = await loadFixture(createLinearPollFixture)

			await poll.connect(donor).fund({ value: hre.ethers.parseEther('0.1') })

			expect(await poll.status()).to.equal(1) // Active
			expect(await poll.rewardPool()).to.equal(hre.ethers.parseEther('0.1'))
		})

		it('should activate without funding via creator', async function () {
			const { poll, creator } = await loadFixture(createLinearPollFixture)

			await poll.connect(creator).activate()
			expect(await poll.status()).to.equal(1) // Active
		})

		it('should allow voting on active linear poll', async function () {
			const { poll, creator, participant1 } = await loadFixture(createLinearPollFixture)

			// Activate
			await poll.connect(creator).activate()

			// Initialize cofhejs for participant
			await hre.cofhe.expectResultSuccess(hre.cofhe.initializeWithHardhatSigner(participant1))

			// Encrypt weights: [30, 50, 20] for 3 options
			const [w0, w1, w2] = await hre.cofhe.expectResultSuccess(
				cofhejs.encrypt([Encryptable.uint32(30n), Encryptable.uint32(50n), Encryptable.uint32(20n)] as const)
			)

			await poll.connect(participant1).vote([w0, w1, w2])

			expect(await poll.hasVoted(participant1.address)).to.be.true
			expect(await poll.participantCount()).to.equal(1)
		})

		it('should prevent double voting', async function () {
			const { poll, creator, participant1 } = await loadFixture(createLinearPollFixture)

			await poll.connect(creator).activate()
			await hre.cofhe.expectResultSuccess(hre.cofhe.initializeWithHardhatSigner(participant1))

			const [w0, w1, w2] = await hre.cofhe.expectResultSuccess(
				cofhejs.encrypt([Encryptable.uint32(30n), Encryptable.uint32(50n), Encryptable.uint32(20n)] as const)
			)

			await poll.connect(participant1).vote([w0, w1, w2])

			// Second vote should revert
			const [w0b, w1b, w2b] = await hre.cofhe.expectResultSuccess(
				cofhejs.encrypt([Encryptable.uint32(10n), Encryptable.uint32(10n), Encryptable.uint32(80n)] as const)
			)

			await expect(poll.connect(participant1).vote([w0b, w1b, w2b])).to.be.revertedWith('Already voted')
		})

		it('should finalize and reveal results', async function () {
			const { poll, creator, participant1, participant2 } = await loadFixture(createLinearPollFixture)

			// Fund and activate
			await poll.connect(creator).activate()

			// Participant 1 votes
			await hre.cofhe.expectResultSuccess(hre.cofhe.initializeWithHardhatSigner(participant1))
			const [w0, w1, w2] = await hre.cofhe.expectResultSuccess(
				cofhejs.encrypt([Encryptable.uint32(30n), Encryptable.uint32(50n), Encryptable.uint32(20n)] as const)
			)
			await poll.connect(participant1).vote([w0, w1, w2])

			// Participant 2 votes
			await hre.cofhe.expectResultSuccess(hre.cofhe.initializeWithHardhatSigner(participant2))
			const [w0b, w1b, w2b] = await hre.cofhe.expectResultSuccess(
				cofhejs.encrypt([Encryptable.uint32(10n), Encryptable.uint32(60n), Encryptable.uint32(30n)] as const)
			)
			await poll.connect(participant2).vote([w0b, w1b, w2b])

			// Advance past deadline
			const deadline = await poll.deadline()
			await time.increaseTo(deadline)

			// Request finalization
			await poll.connect(creator).requestFinalize()
			expect(await poll.status()).to.equal(2) // DecryptionRequested

			// Advance time to allow mock decryption to complete
			await time.increase(11)

			// Finalize
			await poll.connect(creator).finalize()
			expect(await poll.status()).to.equal(3) // Finalized

			// Check results: [30+10, 50+60, 20+30] = [40, 110, 50]
			const results = await poll.getResults()
			expect(results[0]).to.equal(40)
			expect(results[1]).to.equal(110)
			expect(results[2]).to.equal(50)
		})

		it('should allow reward claims after finalization', async function () {
			const { poll, creator, donor, participant1 } = await loadFixture(createLinearPollFixture)

			// Fund the poll
			await poll.connect(donor).fund({ value: hre.ethers.parseEther('1.0') })

			// Vote
			await hre.cofhe.expectResultSuccess(hre.cofhe.initializeWithHardhatSigner(participant1))
			const [w0, w1, w2] = await hre.cofhe.expectResultSuccess(
				cofhejs.encrypt([Encryptable.uint32(50n), Encryptable.uint32(30n), Encryptable.uint32(20n)] as const)
			)
			await poll.connect(participant1).vote([w0, w1, w2])

			// Finalize
			const deadline = await poll.deadline()
			await time.increaseTo(deadline)
			await poll.connect(creator).requestFinalize()
			await time.increase(11)
			await poll.connect(creator).finalize()

			// Claim reward
			const balanceBefore = await hre.ethers.provider.getBalance(participant1.address)
			await poll.connect(participant1).claimReward()
			const balanceAfter = await hre.ethers.provider.getBalance(participant1.address)

			// Balance should have increased (minus gas)
			expect(balanceAfter).to.be.gt(balanceBefore)
			expect(await poll.hasClaimed(participant1.address)).to.be.true
		})

		it('should prevent claiming before finalization', async function () {
			const { poll, creator, donor, participant1 } = await loadFixture(createLinearPollFixture)

			await poll.connect(donor).fund({ value: hre.ethers.parseEther('1.0') })

			await hre.cofhe.expectResultSuccess(hre.cofhe.initializeWithHardhatSigner(participant1))
			const [w0, w1, w2] = await hre.cofhe.expectResultSuccess(
				cofhejs.encrypt([Encryptable.uint32(50n), Encryptable.uint32(30n), Encryptable.uint32(20n)] as const)
			)
			await poll.connect(participant1).vote([w0, w1, w2])

			await expect(poll.connect(participant1).claimReward()).to.be.revertedWith('Not finalized')
		})
	})

	describe('Quadratic Voting', function () {
		beforeEach(function () {
			if (!hre.cofhe.isPermittedEnvironment('MOCK')) this.skip()
		})

		it('should accept quadratic votes', async function () {
			const { poll, creator, participant1 } = await loadFixture(createQuadraticPollFixture)

			await poll.connect(creator).activate()

			await hre.cofhe.expectResultSuccess(hre.cofhe.initializeWithHardhatSigner(participant1))

			// Quadratic: weights [5, 7, 3] → costs 25 + 49 + 9 = 83 <= 100 budget
			const [w0, w1, w2] = await hre.cofhe.expectResultSuccess(
				cofhejs.encrypt([Encryptable.uint32(5n), Encryptable.uint32(7n), Encryptable.uint32(3n)] as const)
			)

			await poll.connect(participant1).vote([w0, w1, w2])

			expect(await poll.hasVoted(participant1.address)).to.be.true
			expect(await poll.participantCount()).to.equal(1)
		})
	})
})
