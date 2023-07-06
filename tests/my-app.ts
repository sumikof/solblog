import * as anchor from "@coral-xyz/anchor";
import assert from 'assert';
import { Program } from "@coral-xyz/anchor";
import { MyApp } from "../target/types/my_app";
import { createBlog, createUser } from "./bloglib";

describe("my-app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MyApp as Program<MyApp>;

  it("Is initialized!", async () => {

    const { blog, blogAccount, genesisPostAccount } = await createBlog(
      program,
      provider
    );

    assert.equal(
      blog.currentPostKey.toString(),
      genesisPostAccount.publicKey.toString()
    );

    assert.equal(
      blog.authority.toString(),
      provider.wallet.publicKey.toString()
    );

  });
});
