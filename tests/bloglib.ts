import * as anchor from "@coral-xyz/anchor";
const SystemProgramId = anchor.web3.SystemProgram.programId;
function generateKeyPair(){
  return anchor.web3.Keypair.generate();
}

export async function createBlog(program, provider) {
  const blogAccount = generateKeyPair();
  const genesisPostAccount = generateKeyPair();

  await program.methods.initBlog()
    .accounts({
      blogAccount: blogAccount.publicKey,
      genesisPostAccount: genesisPostAccount.publicKey,
      authority: provider.publicKey,
      systemProgram: SystemProgramId,
    }).signers([blogAccount, genesisPostAccount])
    .rpc();

  const blog = await program.account.blogState.fetch(blogAccount.publicKey);

  return { blog, blogAccount, genesisPostAccount };
}

export async function createUser(program, provider) {
  const userAccount = generateKeyPair();

  const name = "user name"
  const avator = "image link"

  await program.methods.signupUser(name, avator)
    .accounts({
      authority: provider.publicKey,
      userAccount: userAccount.publicKey,
      systemProgram: SystemProgramId,
    }
    ).signers([userAccount])
    .rpc();

  const user = await program.account.userState.fetch(
    userAccount.publicKey
  );

  return { user, userAccount };
}

export async function createPost(program, provider, blogAccount, userAccount) {
  const postAccount = generateKeyPair();
  const title = "post title";
  const content = "post content";

  await program.methods.createPost(title, content)
    .accounts({
      blogAccount: blogAccount.publicKey,
      authority: provider.wallet.publicKey,
      userAccount: userAccount.publicKey,
      postAccount: postAccount.publicKey,
      systemProgram: SystemProgramId,
    })
    .signers([postAccount])
    .rpc();

  const post = await program.account.postState.fetch(postAccount.publicKey);

  return { post, postAccount, title, content };
}