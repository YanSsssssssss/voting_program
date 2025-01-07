import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {startAnchor} from 'solana-bankrun'
import {BankrunProvider} from 'anchor-bankrun'
import { PublicKey} from '@solana/web3.js'
import {Voting} from '../target/types/Voting'
const IDL = require('../target/idl/voting.json')

const vovoAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('vovo', () => {
  it('init poll', async () => {
    const context = await startAnchor('', [{name: 'vovo', programId: vovoAddress}], []);
    const provider = new BankrunProvider(context);
    const vovoProgram = new Program<Voting>(IDL, provider)
    await vovoProgram.methods.initializePoll(
      new anchor.BN(1), new anchor.BN(1), new anchor.BN(1), "xxx").rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8)], vovoAddress);
    const poll = await vovoProgram.account.poll.fetch(pollAddress);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.desc).toEqual('xxx');
    expect(poll.start.toNumber()).toEqual(1);
    expect(poll.end.toNumber()).toEqual(1);
  })

  it('init candidate', async ()=> {
  })

  it('vote', async ()=> {
  })
})
