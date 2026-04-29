export const STRINGS = {
  logoAlt: "Garage",
  cardTitle: "Get PDF Invoice",
  cardSubtitle: "Create a PDF for any listing.",
  modalTitle: "Instant Invoice Generator",
  inputLabel: "Listing URL",
  inputPlaceholder: "Paste a listing URL...",
  errorMessage: "Please enter a valid Garage listing URL",
  generateButton: "Generate PDF",
  loadingButton: "Loading...",
  downloadButton: "Download PDF",
  preparingButton: "Preparing PDF…",
  emailLabel: "Email address",
  emailPlaceholder: "user@example.com",
  emailError: "Please enter a valid email address",
  sendButton: "Send PDF",
  sendingButton: "Sending…",
  sentMessage: "Sent! Check your inbox.",
};

export const INVOICE = {
  title: "Invoice",
  total: "Total",
  website: "shopgarage.com",
  supportEmail: "support@withgarage.com",
  specBrand: "Brand",
  specModelYear: "Model year",
  specModel: "Model",
  filename: "garage-invoice",
  emailSubject: (listingTitle: string) => `Invoice: ${listingTitle}`,
  emailBody: (listingTitle: string, price: string) =>
    `Your invoice for ${listingTitle} is attached.`,
};

export const MODEL_ATTRIBUTE_ID = "71a96c93-294f-42a5-90b8-14f13726326c";

export const UUID_REGEX =
  /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const API_BASE = "https://garage-backend.onrender.com";
