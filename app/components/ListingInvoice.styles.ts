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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
  },
  logoBlock: {
    flexDirection: "column",
    gap: 4,
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
  },
  invoiceDate: {
    fontSize: 9,
    color: "#9ca3af",
    marginTop: 4,
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
});
