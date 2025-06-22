"use client";

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg font-medium transition-all duration-200 transform hover:scale-105"
    >
      Logg inn med Google
    </button>
  );
}

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  const { name, image } = session.user;
  const firstName = name?.split(" ")[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-200"
      >
        {image ? (
          <Image src={image} alt="User avatar" width={32} height={32} className="h-8 w-8 rounded-full" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-600">
            {firstName?.charAt(0)}
          </div>
        )}
        <span className="hidden font-medium text-gray-700 sm:block">
          {firstName}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Logg ut
          </button>
        </div>
      )}
    </div>
  );
} 