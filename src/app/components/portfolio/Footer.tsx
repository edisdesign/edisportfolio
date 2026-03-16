import React, { useState } from "react";
import { ImpressumDialog, PrivacyDialog } from "./LegalPages";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

import pb from "../../lib/pocketbase";

interface FooterProps {
  language: string;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  onOpenAdmin: () => void;
}

export const Footer = ({ language, isAdmin, setIsAdmin, onOpenAdmin }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const [impressumOpen, setImpressumOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check if already authenticated on mount
  React.useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.record) {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    try {
      // Authenticate with PocketBase as superuser (admin)
      await pb.collection('_superusers').authWithPassword(email, password);
      setIsAdmin(true);
      setAdminModalOpen(false);
      setPassword("");
      setEmail("");
      setError("");
    } catch (err: any) {
      console.error("PocketBase auth failed:", err);
      setError("Login failed. Check your email and password.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <footer className="py-8 bg-zinc-950 border-t border-zinc-900 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
            <p className="flex items-center gap-1">
              &copy; {currentYear} Edis Muminović. All rights reserved
              <span
                className={`cursor-pointer transition-colors font-bold ml-2 ${isAdmin ? 'text-indigo-400 hover:text-indigo-300 uppercase tracking-widest text-xs' : 'opacity-50 hover:opacity-100'}`}
                onClick={() => isAdmin ? onOpenAdmin() : setAdminModalOpen(true)}
              >
                {isAdmin ? 'Admin Panel' : '...'}
              </span>
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setImpressumOpen(true)}
                className="hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Impressum
              </button>
              <button
                onClick={() => setPrivacyOpen(true)}
                className="hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      <ImpressumDialog
        language={language}
        open={impressumOpen}
        onOpenChange={setImpressumOpen}
      />
      <PrivacyDialog
        language={language}
        open={privacyOpen}
        onOpenChange={setPrivacyOpen}
      />

      <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Sign in with your PocketBase admin credentials.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 font-medium transition-colors"
            >
              {isLoggingIn ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
