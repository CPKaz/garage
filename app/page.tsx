"use client";

import { useState } from "react";
import Image from "next/image";
import garageLogo from "./assets/garage-logo.svg";
import styles from "./page.module.css";
import { STRINGS, UUID_REGEX, EMAIL_REGEX } from "./constants";
import type { Listing } from "./types/listing";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listingData, setListingData] = useState<Listing | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleGenerate() {
    const match = url.match(UUID_REGEX);
    if (!match) { setError(true); return; }
    setError(false);
    const id = match[1];
    setLoading(true);
    try {
      const res = await fetch(`/api/listing?id=${id}`);
      const data = await res.json();
      console.log(data);
      setListingData(data);
    } catch (err) {
      console.error("Failed to fetch listing:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmail() {
    if (!EMAIL_REGEX.test(email.trim())) { setEmailError(true); return; }
    setEmailError(false);
    setSending(true);
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listingData!.id, email: email.trim() }),
      });
      if (!res.ok) throw new Error("Send failed");
      setSent(true);
    } catch (err) {
      console.error("Failed to send email:", err);
    } finally {
      setSending(false);
    }
  }

  function closeModal() {
    setOpen(false);
    setError(false);
    setUrl("");
    setListingData(null);
    setEmail("");
    setEmailError(false);
    setSent(false);
  }

  return (
    <>
      <div className={styles.logo}>
        <Image src={garageLogo} alt={STRINGS.logoAlt} height={32} />
      </div>

      <main className={styles.main}>
        <button className={styles.card} onClick={() => setOpen(true)}>
          <div className={styles.iconWrap}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" fill="white"/>
              <path d="M14 2v6h6" fill="#ec4899"/>
              <line x1="8" y1="13" x2="16" y2="13" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="17" x2="13" y2="17" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className={styles.cardText}>
            <p className={styles.cardTitle}>{STRINGS.cardTitle}</p>
            <p className={styles.cardSubtitle}>{STRINGS.cardSubtitle}</p>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className={styles.chevron}>
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </main>

      {open && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{STRINGS.modalTitle}</h2>
            </div>
            <div className={styles.modalBody}>

              {/* Listing URL */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>{STRINGS.inputLabel}</label>
                <div className={`${styles.inputWrap} ${error ? styles.inputWrapError : ""}`}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (error) setError(false);
                      if (listingData) { setListingData(null); setSent(false); }
                    }}
                    placeholder={STRINGS.inputPlaceholder}
                    className={styles.input}
                  />
                </div>
                {error && (
                  <div className={styles.errorRow}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="#ef4444"/>
                      <path d="M8 4.5v4M8 10.5v1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className={styles.errorText}>{STRINGS.errorMessage}</span>
                  </div>
                )}
              </div>

              {listingData ? (
                <div className={styles.actionRow}>
                  {/* Download column */}
                  <div className={styles.actionCol}>
                    <a
                      href={`/api/invoice?id=${listingData.id}`}
                      download
                      className={styles.downloadBtn}
                    >
                      {STRINGS.downloadButton}
                    </a>
                  </div>

                  {/* Email column */}
                  <div className={styles.actionCol}>
                    <div className={`${styles.inputWrap} ${emailError ? styles.inputWrapError : ""}`}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); if (sent) setSent(false); }}
                        placeholder={STRINGS.emailPlaceholder}
                        className={styles.input}
                      />
                    </div>
                    <button
                      className={styles.sendBtn}
                      onClick={handleSendEmail}
                      disabled={sending}
                    >
                      {sending ? STRINGS.sendingButton : STRINGS.sendButton}
                    </button>
                    {emailError && (
                      <div className={styles.errorRow}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="8" fill="#ef4444"/>
                          <path d="M8 4.5v4M8 10.5v1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span className={styles.errorText}>{STRINGS.emailError}</span>
                      </div>
                    )}
                    {sent && <p className={styles.sentText}>{STRINGS.sentMessage}</p>}
                  </div>
                </div>
              ) : (
                <button
                  className={styles.generateBtn}
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? STRINGS.loadingButton : STRINGS.generateButton}
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
