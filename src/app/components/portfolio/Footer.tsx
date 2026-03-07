import React, { useState } from "react";
import { ImpressumDialog, PrivacyDialog } from "./LegalPages";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

interface FooterProps {
  language: string;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const Footer = ({ language, setIsAdmin }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const [impressumOpen, setImpressumOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Elhamdulillah.7") {
      setIsAdmin(true);
      setAdminModalOpen(false);
      setPassword("");
      setError("");
    } else {
      setError("Incorrect password");
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
                className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                onClick={() => setAdminModalOpen(true)}
              >
                ...
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
              Enter password to access the admin panel.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 mt-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
            >
              Login
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
