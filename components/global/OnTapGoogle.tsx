"use client";

import Script from "next/script";
import { createClient } from "@/utils/supabase/client";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

// generate nonce to use for google id token sign-in
const generateNonce = async (): Promise<string[]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return [nonce, hashedNonce];
};

const OneTapComponent = () => {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      window.addEventListener("load", async () => {
        const [nonce, hashedNonce] = await generateNonce();

        // check if there's already an existing session before initializing the one-tap UI
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session", error);
        }
        if (data.session) {
          router.refresh();
          return;
        }

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (response: CredentialResponse) => {
            try {
              // send id token returned in response.credential to supabase
              const { error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce,
              });

              if (error) throw error;
              toast.success("Logged in successfully");

              // redirect to protected page
              router.refresh();
            } catch (error) {
              console.error("Error logging in with Google One Tap", error);
            }
          },
          nonce: hashedNonce,
          use_fedcm_for_prompt: true,
        });
        window.google.accounts.id.prompt();
      });
    };
    initializeGoogleOneTap();
    return () => window.removeEventListener("load", initializeGoogleOneTap);
  }, []);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;
