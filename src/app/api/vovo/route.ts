import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, createPostResponse } from "@solana/actions"
import * as anchor from '@coral-xyz/anchor'
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {Voting} from '../../../../anchor/target/types/Voting'
import { Program } from "@coral-xyz/anchor";
// import instruction from "@coral-xyz/anchor/dist/cjs/program/namespace/instruction";
const IDL = require('../../../../anchor/target/idl/Voting.json')

export async function GET(request: Request) {
  const actionMetadata: ActionGetResponse = {
    icon: 'https://i0.hdslb.com/bfs/face/7d05e78f15ffadff1c70c181233da8aa9c27dbe7.jpg',
    title: 'vote1',
    label: 'Vote1',
    links: {
      actions: [
        {label: '1', href: '/api/vovo?candidate=1', type: 'transaction'},
        {label: '2', href: '/api/vovo?candidate=2', type: 'transaction'},
      ]
    },
    description: 'vote1 for your life'
  }

  return new Response(JSON.stringify(actionMetadata), {
    headers: { 'Content-Type': 'application/json' ,...ACTIONS_CORS_HEADERS}
  });}


export async function POST(request:Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get('candidate')

  if (candidate !='1' && candidate != '2') {
    return new Response('Invalid candidate', {status: 400, headers:ACTIONS_CORS_HEADERS})
  }

  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const vovoProgram:Program<Voting> = new Program(IDL, {connection})
  const body: any = await request.json();
  console.log(body)
  let voter
  try {
    voter = new PublicKey(body.account);
  } catch(e) {
    console.log(e)
    return new Response('Invalid account', {status: 400, headers:ACTIONS_CORS_HEADERS})
  }

  const instruction = await vovoProgram.methods.vote(candidate, new anchor.BN(1)).accounts({signer: voter}).instruction();

  const blockhash = await connection.getLatestBlockhash()
  const transaction = new Transaction({
    feePayer:voter,
    blockhash:blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(instruction);

  // const response = await createPostResponse({
  //   fields: {
  //     transaction: transaction
  //   }
  // });
  console.log('xx')
  return new Response(JSON.stringify({fields: {
    transaction: transaction
  }}), {
    headers: { 'Content-Type': 'application/json' ,...ACTIONS_CORS_HEADERS}
  })
}