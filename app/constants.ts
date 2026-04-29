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
  downloadLabel: "Download",
  downloadButton: "Download PDF",
  emailSectionLabel: "Send to my email",
  orDivider: "or",
  preparingButton: "Preparing PDF…",
  emailLabel: "Email address",
  emailPlaceholder: "user@example.com",
  emailError: "Please enter a valid email address",
  sendButton: "Send PDF",
  sendingButton: "Sending…",
  sentMessage: "Sent! It may take a few minutes to arrive. Make sure to check your spam folder.",
  sendErrorMessage: "Failed to send. Please try again.",
};

export const INVOICE = {
  title: "Invoice",
  number: "INV-0001",
  total: "Total",
  website: "shopgarage.com",
  supportEmail: "support@withgarage.com",
  specBrand: "Brand",
  specModelYear: "Model year",
  specModel: "Model",
  freightLabel: "Freight",
  serviceFeeLabel: "Service Fee",
  na: "N/A",
  billToLabel: "Bill To",
  billTo: {
    name: "City of Springfield",
    street: "1 City Hall Plaza",
    city: "Springfield",
    state: "IL",
    zip: "62701",
  },
  shipToLabel: "Ship To",
  shipTo: {
    name: "Springfield Fire Department",
    street: "325 South 7th Street",
    city: "Springfield",
    state: "IL",
    zip: "62701",
  },
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
