// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VovoIDL from '../target/idl/vovo.json'
import type { Vovo } from '../target/types/vovo'

// Re-export the generated IDL and type
export { Vovo, VovoIDL }

// The programId is imported from the program IDL.
export const VOVO_PROGRAM_ID = new PublicKey(VovoIDL.address)

// This is a helper function to get the Vovo Anchor program.
export function getVovoProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VovoIDL, address: address ? address.toBase58() : VovoIDL.address } as Vovo, provider)
}

// This is a helper function to get the program ID for the Vovo program depending on the cluster.
export function getVovoProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Vovo program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOVO_PROGRAM_ID
  }
}
