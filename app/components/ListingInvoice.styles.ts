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
    marginBottom: 20,
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

  // Line item
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  lineItemTitle: {
    fontSize: 11,
    color: "#111827",
    flex: 1,
    marginRight: 16,
  },
  lineItemPrice: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  // Specs
  specsBlock: {
    marginBottom: 20,
  },
  specRow: {
    flexDirection: "row",
    paddingVertical: 3,
  },
  specLabel: {
    width: "35%",
    fontSize: 9,
    color: "#6b7280",
  },
  specValue: {
    fontSize: 9,
    color: "#111827",
    fontFamily: "Helvetica-Bold",
  },

  // Total
  totalDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginTop: 16,
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
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
