"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Button from "@/components/ui_c/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#010B14] text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 space-y-6 max-w-md">
        <div className="inline-flex p-6 bg-primary-500/20 rounded-[32px] border border-primary-500/30 animate-bounce">
          <Icon
            icon="solar:map-point-remove-bold-duotone"
            className="text-6xl text-primary-400"
          />
        </div>

        <h1 className="text-6xl font-black tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold">Signal Lost in Stadium</h2>
        <p className="text-gray-400">
          The section or facility you're looking for seems to be offline or
          relocated. Let's get you back to the main pulse.
        </p>

        <div className="pt-8">
          <Link href="/">
            <Button size="lg" className="w-full">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
