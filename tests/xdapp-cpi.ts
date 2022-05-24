import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { XdappCpi } from "../target/types/xdapp_cpi";
import {Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, Connection, Account} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("xdapp-cpi", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.XdappCpi as Program<XdappCpi>;

  it("Testing order to Raydium", async () => {
    // SOL-USDC
    const config = {
      id: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
      baseMint: "So11111111111111111111111111111111111111112",
      quoteMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      lpMint: "8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu",
      version: 4,
      programId: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
      authority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
      openOrders: "HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc",
      targetOrders: "CZza3Ej4Mc58MnxWA385itCC9jCo3L1D7zc3LKy1bZMR",
      baseVault: "DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz",
      quoteVault: "HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz",
      withdrawQueue: "G7xeGGLevkRwB5f44QNgQtrPKBdMfkT6ZZwpS9xcC97n",
      lpVault: "Awpt6N7ZYPBa4vG4BQNFhFxDj4sxExAA9rpBAoBw2uok",
      marketVersion: 3,
      marketProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
      marketId: "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
      marketAuthority: "F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV",
      marketBaseVault: "36c6YqAwyGKQG66XEp2dJc5JqjaBNv7sVghEtJv4c7u6",
      marketQuoteVault: "8CFo8bL8mZQK8abbFyypFMwEDd8tVJjHTTojMLgQTUSZ",
      marketBids: "14ivtgssEBoBjuZJtSAPKYgpUK7DmnSwuPMqJoVTSgKJ",
      marketAsks: "CEQdAFKdycHugujQg9k2wbmxjcpdYZyVLfV9WerTnafJ",
      marketEventQueue: "5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht",
    };

    // Removed actual keypair here
    let keypair = Keypair.fromSecretKey();

  console.log("userPubKey:", keypair.publicKey.toString());

    // Find source and dest token accts
    let conn = new Connection("https://api.mainnet-beta.solana.com");
    let userSourceTA = await getOrCreateAssociatedTokenAccount(
      conn,
      keypair,
      new PublicKey(config.baseMint),
      keypair.publicKey,
      true
    );
    console.log("userSourceTA:", userSourceTA.address.toString());

    let userDestTA = await getOrCreateAssociatedTokenAccount(
      conn,
      keypair,
      new PublicKey(config.quoteMint),
      keypair.publicKey,
      true
    );
    console.log("userDestTA:", userDestTA.address.toString());

    const tx = await program.methods.proxySwapBaseIn(
      new anchor.BN(0.01 * (10 ** 9)),
      new anchor.BN(0.52 * (10 ** 6)))
      .accounts({
        ammProgram: new PublicKey(config.programId),
        amm: new PublicKey(config.id),
        ammAuthority: new PublicKey(config.authority),
        ammOpenOrders: new PublicKey(config.openOrders),
        ammTargetOrders: new PublicKey(config.targetOrders),
        poolCoinTokenAccount: new PublicKey(config.baseVault),
        poolPcTokenAccount: new PublicKey(config.quoteVault),
        serumProgram: new PublicKey(config.marketProgramId),
        serumMarket: new PublicKey(config.marketId),
        serumBids: new PublicKey(config.marketBids),
        serumAsks: new PublicKey(config.marketAsks),
        serumEventQueue: new PublicKey(config.marketEventQueue),
        serumCoinVaultAccount: new PublicKey(config.marketBaseVault),
        serumPcVaultAccount: new PublicKey(config.marketQuoteVault),
        serumVaultSigner: new PublicKey(config.marketAuthority),
        userSourceTokenAccount: userSourceTA.address,
        userDestinationTokenAccount: userDestTA.address,
        userSourceOwner: keypair.publicKey,
        splTokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([
        keypair
      ]).rpc();
  })

});
