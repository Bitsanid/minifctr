"use client";

import { ConnectButton } from "~/components/ConnectButton";
import sdk from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";
import type { Context } from "@farcaster/miniapp-sdk";
import Link from "next/link";

export default function Demo(
  { title }: { title?: string } = { title: "Frames v2 Demo" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.MiniAppContext>();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-full max-w-sm mx-auto py-2 px-2">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex flex-wrap space-x-1 sm:space-x-2">
            <Link href="/staking">
              <button className="text-sm sm:text-base">Staking</button>
            </Link>
            <Link href="/feed">
              <button className="text-sm sm:text-base">Feed</button>
            </Link>
            <Link href="/marketplace">
              <button className="text-sm sm:text-base">Marketplace</button>
            </Link>
            <Link href="/courses">
              <button className="text-sm sm:text-base">Courses</button>
            </Link>
            <Link href="/profile">
              <button className="text-sm sm:text-base">Profile</button>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}