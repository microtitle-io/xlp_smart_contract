import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { Provider, Program, Idl } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import idl from "../idl/idl.json";
import { Register } from '../types/register';

const PROGRAM_ID = new PublicKey(idl.metadata.address);

const useWorkspace = () => {
  const wallet = useAnchorWallet();
  const connection = new Connection("https://api.devnet.solana.com");
  if (wallet) {
    const provider = new Provider(connection, wallet, { //It’s not exported in a typescript friendly way. You can @ts-ignore and it will run. N
      preflightCommitment: "processed",
    });
    const program = new Program(idl as Idl, PROGRAM_ID, provider);
    return {
      wallet,
      connection,
      provider,
      program,
    };
  }
  return undefined;
};

export default useWorkspace;