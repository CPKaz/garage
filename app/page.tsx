"use client";

import { useState } from "react";
import Image from "next/image";
import garageLogo from "./assets/garage-logo.svg";
import styles from "./page.module.css";
import { STRINGS, UUID_REGEX, EMAIL_REGEX } from "./constants";
import type { Listing } from "./types/listing";

// ─── Shared ──────────────────────────────────────────────────────────────────

function ErrorMessage({ text }: { text: string }) {
  return (
    <div className={styles.errorRow}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#ef4444"/>
        <path d="M8 4.5v4M8 10.5v1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className={styles.errorText}>{text}</span>
    </div>
  );
}

// ─── Invoice Card ─────────────────────────────────────────────────────────────

function InvoiceCard({ onClick }: { onClick: () => void }) {
  return (
    <button className={styles.card} onClick={onClick}>
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
  );
}

// ─── Invoice Modal ────────────────────────────────────────────────────────────

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  onUrlChange: (val: string) => void;
  urlError: boolean;
  loading: boolean;
  onGenerate: () => void;
  listingData: Listing | null;
  email: string;
  onEmailChange: (val: string) => void;
  emailError: boolean;
  sending: boolean;
  sent: boolean;
  sendError: boolean;
  onSendEmail: () => void;
}

function InvoiceModal({
  open, onClose,
  url, onUrlChange, urlError, loading, onGenerate,
  listingData,
  email, onEmailChange, emailError, sending, sent, sendError, onSendEmail,
}: InvoiceModalProps) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{STRINGS.modalTitle}</h2>
        </div>
        <div className={styles.modalBody}>

          {/* Listing URL */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>{STRINGS.inputLabel}</label>
            <div className={`${styles.inputWrap} ${urlError ? styles.inputWrapError : ""}`}>
              <input
                type="text"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder={STRINGS.inputPlaceholder}
                className={styles.input}
              />
            </div>
            {urlError && <ErrorMessage text={STRINGS.errorMessage} />}
          </div>

          {/* Action area */}
          {listingData ? (
            <div className={styles.actionArea}>
              <div className={styles.actionSection}>
                <p className={styles.actionLabel}>{STRINGS.downloadLabel}</p>
                <a
                  href={`/api/invoice?id=${listingData.id}`}
                  download
                  className={styles.downloadBtn}
                >
                  {STRINGS.downloadButton}
                </a>
              </div>
              <div className={styles.orDivider}>{STRINGS.orDivider}</div>
              <div className={styles.actionSection}>
                <p className={styles.actionLabel}>{STRINGS.emailSectionLabel}</p>
                <div className={styles.emailRow}>
                  <div className={`${styles.inputWrap} ${emailError ? styles.inputWrapError : ""}`}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      placeholder={STRINGS.emailPlaceholder}
                      className={styles.input}
                    />
                  </div>
                  <button className={styles.sendBtn} onClick={onSendEmail} disabled={sending}>
                    {sending ? STRINGS.sendingButton : STRINGS.sendButton}
                  </button>
                </div>
                {emailError && <ErrorMessage text={STRINGS.emailError} />}
                {sendError && <ErrorMessage text={STRINGS.sendErrorMessage} />}
                {sent && <p className={styles.sentText}>{STRINGS.sentMessage}</p>}
              </div>
            </div>
          ) : (
            <button className={styles.generateBtn} onClick={onGenerate} disabled={loading}>
              {loading ? STRINGS.loadingButton : STRINGS.generateButton}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [listingData, setListingData] = useState<Listing | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(false);

  async function handleGenerate() {
    const match = url.match(UUID_REGEX);
    if (!match) { setUrlError(true); return; }
    setUrlError(false);
    const id = match[1];
    setLoading(true);
    try {
      const res = await fetch(`/api/listing?id=${id}`);
      const data = await res.json();
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
    setSendError(false);
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
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  function handleUrlChange(val: string) {
    setUrl(val);
    if (urlError) setUrlError(false);
    if (listingData) { setListingData(null); setSent(false); }
  }

  function handleEmailChange(val: string) {
    setEmail(val);
    if (emailError) setEmailError(false);
    if (sendError) setSendError(false);
    if (sent) setSent(false);
  }

  function closeModal() {
    setOpen(false);
    setUrlError(false);
    setUrl("");
    setListingData(null);
    setEmail("");
    setEmailError(false);
    setSendError(false);
    setSent(false);
  }

  return (
    <>
      <div className={styles.logo}>
        <Image src={garageLogo} alt={STRINGS.logoAlt} height={32} />
      </div>

      <main className={styles.main}>
        <InvoiceCard onClick={() => setOpen(true)} />
      </main>

      <InvoiceModal
        open={open}
        onClose={closeModal}
        url={url}
        onUrlChange={handleUrlChange}
        urlError={urlError}
        loading={loading}
        onGenerate={handleGenerate}
        listingData={listingData}
        email={email}
        onEmailChange={handleEmailChange}
        emailError={emailError}
        sending={sending}
        sent={sent}
        sendError={sendError}
        onSendEmail={handleSendEmail}
      />
    </>
  );
}
