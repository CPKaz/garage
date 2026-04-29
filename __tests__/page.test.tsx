import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../app/page";
import { STRINGS } from "../app/constants";

const mockListing = {
  id: "71a96c93-294f-42a5-90b8-14f13726326c",
  listingTitle: "2013 Spartan Sirius",
  sellingPrice: 50000,
  itemBrand: "Spartan",
  itemAge: 2013,
  itemWeight: null,
  itemLength: null,
  itemWidth: null,
  itemHeight: null,
  address: { state: "CA" },
  category: { name: "Fire Trucks" },
  ListingAttribute: [],
  listingImages: [],
};

const VALID_URL =
  "https://shopgarage.com/listing/2013-Spartan-Sirius-71a96c93-294f-42a5-90b8-14f13726326c";

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
});

function openModal() {
  render(<Home />);
  fireEvent.click(screen.getByRole("button", { name: /get pdf invoice/i }));
}

async function openModalWithListing() {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockListing),
  });
  openModal();
  fireEvent.change(screen.getByPlaceholderText(STRINGS.inputPlaceholder), {
    target: { value: VALID_URL },
  });
  fireEvent.click(screen.getByRole("button", { name: STRINGS.generateButton }));
  await screen.findByText(STRINGS.downloadButton);
}

describe("Home — invoice card", () => {
  it("renders the card with title and subtitle", () => {
    render(<Home />);
    expect(screen.getByText(STRINGS.cardTitle)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.cardSubtitle)).toBeInTheDocument();
  });
});

describe("Home — modal open/close", () => {
  it("modal is not visible initially", () => {
    render(<Home />);
    expect(screen.queryByText(STRINGS.modalTitle)).not.toBeInTheDocument();
  });

  it("opens the modal when the card is clicked", () => {
    openModal();
    expect(screen.getByText(STRINGS.modalTitle)).toBeInTheDocument();
  });
});

describe("Home — URL validation", () => {
  it("shows an error when Generate is clicked with no URL", () => {
    openModal();
    fireEvent.click(screen.getByRole("button", { name: STRINGS.generateButton }));
    expect(screen.getByText(STRINGS.errorMessage)).toBeInTheDocument();
  });

  it("clears the URL error when the input changes", () => {
    openModal();
    fireEvent.click(screen.getByRole("button", { name: STRINGS.generateButton }));
    fireEvent.change(screen.getByPlaceholderText(STRINGS.inputPlaceholder), {
      target: { value: "something" },
    });
    expect(screen.queryByText(STRINGS.errorMessage)).not.toBeInTheDocument();
  });
});

describe("Home — action area after fetch", () => {
  it("shows download and email sections after a successful fetch", async () => {
    await openModalWithListing();
    expect(screen.getByText(STRINGS.downloadLabel)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.emailSectionLabel)).toBeInTheDocument();
  });

  it("shows email validation error when Send is clicked with no email", async () => {
    await openModalWithListing();
    fireEvent.click(screen.getByRole("button", { name: STRINGS.sendButton }));
    expect(screen.getByText(STRINGS.emailError)).toBeInTheDocument();
  });

  it("clears email error when the email input changes", async () => {
    await openModalWithListing();
    fireEvent.click(screen.getByRole("button", { name: STRINGS.sendButton }));
    fireEvent.change(screen.getByPlaceholderText(STRINGS.emailPlaceholder), {
      target: { value: "u" },
    });
    expect(screen.queryByText(STRINGS.emailError)).not.toBeInTheDocument();
  });

  it("shows sent confirmation on successful email delivery", async () => {
    await openModalWithListing();
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    fireEvent.change(screen.getByPlaceholderText(STRINGS.emailPlaceholder), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: STRINGS.sendButton }));
    await screen.findByText(STRINGS.sentMessage);
  });

  it("shows send error when email delivery fails", async () => {
    await openModalWithListing();
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    fireEvent.change(screen.getByPlaceholderText(STRINGS.emailPlaceholder), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: STRINGS.sendButton }));
    await screen.findByText(STRINGS.sendErrorMessage);
  });

  it("send error clears when the email input changes", async () => {
    await openModalWithListing();
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    fireEvent.change(screen.getByPlaceholderText(STRINGS.emailPlaceholder), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: STRINGS.sendButton }));
    await screen.findByText(STRINGS.sendErrorMessage);
    fireEvent.change(screen.getByPlaceholderText(STRINGS.emailPlaceholder), {
      target: { value: "other@example.com" },
    });
    expect(screen.queryByText(STRINGS.sendErrorMessage)).not.toBeInTheDocument();
  });
});
