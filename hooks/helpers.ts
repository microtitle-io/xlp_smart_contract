import * as anchor from "@project-serum/anchor";
// import { AnchorBlog } from "../target/types/anchor_blog";
import { Register } from './types/register';
import { useWallet, useAnchorWallet, useConnection, AnchorWallet } from "@solana/wallet-adapter-react";
// import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

import {PublicKey, Transaction} from '@solana/web3.js'

export interface Wallet {
    publicKey: PublicKey;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(message: Uint8Array, display: unknown): Promise<Uint8Array>;
}

const wallet: Wallet = useAnchorWallet();
// *** could a type alias using an interface work for this? 
// export interface Wallet {
    // wallet: AnchorWallet | undefined;
// }
// 
// export const wallet: Wallet = {
    // wallet: useAnchorWallet()
// }

export function getProgram(
  provider: anchor.Provider
): anchor.Program<Register> {
  const idl = require("./idl/idl.json");
  const programID = new anchor.web3.PublicKey(idl.metadata.address);
  return new anchor.Program(idl, programID, provider);
}

export function getProvider(
  connection: anchor.web3.Connection //,
//   keypair: anchor.web3.Keypair
): anchor.Provider {

  return new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
}
