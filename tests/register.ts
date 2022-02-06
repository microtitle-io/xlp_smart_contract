import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Register } from '../target/types/register';

import * as assert from "assert";
import * as bs58 from "bs58";
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import { min } from 'bn.js';

describe('register', () => {

  // Configure the client to use the local cluster (or devnet. Use Anchor.toml)
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Register as Program<Register>;

  it('can create a new microtitle', async () => {
    const utitle = anchor.web3.Keypair.generate();
    const bkey = new PublicKey('79SeGDwWgDmM2PdBHbpxnpKKLwEZmN6iZcNrNUQqkUfE')
    const mintId = new PublicKey('GQLWnE4WvVwwmvZPiC1EbkByKVXWGV3undLM52bqBLhK')
   // const awallet = program.provider.wallet;

    await program.rpc.updateRegister(bkey, mintId, {
        accounts: {
            microtitle: utitle.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [utitle], // --> how to get the type Keypair from the type Wallet? You need the author to serve as the signer, payer.
    });
    
    console.log(utitle.publicKey.toBase58());
   // Fetch the account details of the created tweet.
    const utitleAccount = await program.account.microtitle.fetch(utitle.publicKey);
    
   // Ensure it has the right data.
    assert.equal(utitleAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(utitleAccount.bkey, '79SeGDwWgDmM2PdBHbpxnpKKLwEZmN6iZcNrNUQqkUfE');
    console.log('bkey: ' + utitleAccount.bkey)
    assert.equal(utitleAccount.mint, 'GQLWnE4WvVwwmvZPiC1EbkByKVXWGV3undLM52bqBLhK');
    console.log('mint: ' + utitleAccount.mint)
    assert.ok(utitleAccount.timestamp);
    console.log('timestamp: ' + utitleAccount.timestamp)
  });




  // it('can fetch all microtitles:', async () => {
    // const utitleAccounts = await program.account.microtitle.all();
    // let counter = 0;
    // utitleAccounts.map(item => {
      // if (item.account.bkey === '79SeGDwWgDmM2PdBHbpxnpKKLwEZmN6iZcNrNUQqkUfE') {
        // counter += 1;
        // console.log('bkey: ' + item.account.bkey + ", mint id: " + item.account.mint)
      // }
    // })
    // 
    // if (counter === 0) {
      // console.log('no duplicate microtitles found')
    // }
    // else if (counter > 0) {
      // console.log('found ' + counter + ' duplicates.')
    // }
    // else {
      // console.log('invalid data')
    // }
    // 
    // assert.equal(utitleAccounts.length, 15);
  // });

  // it('can find a specific microtitle by bkey', async () => {
// 
    // const bkeyTest = new PublicKey('79SeGDwWgDmM2PdBHbpxnpKKLwEZmN6iZcNrNUQqkUfE');
    // const utitleAccounts = await program.account.microtitle.all([
        // {
            // memcmp: {
                // offset: 48, // bkey starts at byte 48 
                // bytes: bkeyTest.toBase58(),
            // }
        // }
    // ]);
  // 
    // console.log('author, bkey, mint, timestamp');
    // utitleAccounts.map(item => console.log(item.account.author + ', ' + item.account.bkey + ', ' + item.account.mint + ', ' + item.account.timestamp ));
// 
    // if (utitleAccounts.length === 0) {
      // console.log('no duplicates found --> good to go')
    // }
    // else if (utitleAccounts.length > 0 ) {
      // console.log('bonding key is already registered to ' + utitleAccounts.length + 'other microtitles --> no good!')
    // }
    // else {
      // console.log('some other result')
    // }
// 
    // assert.equal(utitleAccounts.length, 2);
    // assert.ok(utitleAccounts.every(utitleAccount => {
      // return utitleAccount.account.bkey.toBase58() === '79SeGDwWgDmM2PdBHbpxnpKKLwEZmN6iZcNrNUQqkUfE' //3gj9xJ1YLx2fKXHPE5UnRFXXngNziAU5oapNoJbLjudT
    // }));
// 
  // });

// it('can find a specific mint ID', async () => {
  // const mintIdTest = new PublicKey('xCeq3XCUvn4Y2RjbwnHBCHqL8sAhXrda92VG7uCMotR');  // GQLWnE4WvVwwmvZPiC1EbkByKVXWGV3undLM52bqBLhK
  // const utitleAccounts = await program.account.microtitle.all([
      // {
          // memcmp: {
              // offset: 80, // bkey starts at byte 52, can retrieve mint at 
              // bytes: mintIdTest.toBase58(),
          // }
      // }
  // ]);
  // console.log('number of mint ids found: ' + utitleAccounts.length)
  // assert.equal(utitleAccounts.length, 2);
// });

it('can get parsed program accounts', async () => {

  const MICROTITLE_PROGRAM_ID = new PublicKey("KdWVDYMteVwTbBNZGfCkS2ayCFEWhbkBoFZxPwdqCgu")

  const url = clusterApiUrl("devnet");
  const connection = new Connection(url, 'confirmed');
  const accounts = await connection.getParsedProgramAccounts(
    MICROTITLE_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      filters: [
        {
          dataSize: 112, // number of bytes
        },
        {
          memcmp: {
            offset: 48, // number of bytes
            bytes: '79SeGDwWgDmM2PdBHbpxnpKKLwEZmN6iZcNrNUQqkUfE', // base58 encoded string
          },
        },
      ],
    }
  );
  
  assert.equal(accounts.length, 2);

  });

});
