'use client';

import { Session } from "next-auth";
import { UserMenu } from "./Auth";

interface HeaderProps {
  session: Session | null;
}

export const Header = ({ session }: HeaderProps) => {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-4xl mx-auto grid grid-cols-10 items-center">
        <div className="col-span-1 sm:col-span-2" />

        <div className={`col-span-8 sm:col-span-6 ${!session?.user ? "text-center" : ""}`}>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Oda Shopping Assistant
          </h1>
          <p className="hidden sm:block text-gray-600 text-lg">
            Spør meg om produkter eller handlekurven din! 🛒
          </p>
        </div>

        <div className="col-span-1 sm:col-span-2 justify-self-end">
          {session?.user && <UserMenu />}
        </div>
      </div>
    </div>
  );
}; 