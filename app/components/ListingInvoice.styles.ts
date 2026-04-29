import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
  },

  // Header
  logoBlock: {
    flexDirection: "column",
    marginBottom: 24,
  },
  logoContact: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 6,
  },
  invoiceLabel: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 3,
  },
  invoiceDate: {
    fontSize: 9,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 28,
  },

  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 20,
  },

  // Bill To / Ship To
  addressRow: {
    flexDirection: "row",
    marginBottom: 28,
    gap: 32,
  },
  addressCol: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  addressName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 3,
  },
  addressText: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 2,
  },

  // Line items
  lineItemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 4,
  },
  lineItemsHeaderLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  lineItemTitle: {
    fontSize: 10,
    color: "#111827",
    flex: 1,
    marginRight: 16,
  },
  lineItemPrice: {
    fontSize: 10,
    color: "#111827",
  },

  // Total
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  totalPrice: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
});
