import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { XdappCpi } from "../target/types/xdapp_cpi";

describe("xdapp-cpi", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.XdappCpi as Program<XdappCpi>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
