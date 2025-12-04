'use client';

import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { SignInButton } from "@farcaster/auth-kit";

const config = {
  relay: process.env.NEXT_PUBLIC_FCTR_RELAY || "https://relay.farcaster.xyz",
  rpcUrl: process.env.NEXT_PUBLIC_FCTR_RPC_URL || "https://mainnet.optimism.io",
  domain: process.env.NEXT_PUBLIC_FCTR_DOMAIN || "farcaster-mini-app.vercel.app",
  siweUri: process.env.NEXT_PUBLIC_FCTR_SIWE_URI || "https://farcaster-mini-app.vercel.app/login",
};

export function ConnectButton() {
  return (
    <AuthKitProvider config={config}>
      <SignInButton />
    </AuthKitProvider>
  );
}