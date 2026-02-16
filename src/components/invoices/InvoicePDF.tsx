

import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { InvoiceWithClient } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

// Register fonts if needed, or use default standard fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ],
});


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 10,
    color: '#333',
  },
  invoiceInfo: {
    fontSize: 10,
    textAlign: 'right',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  clientSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1px solid #EEE',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableColDesc: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 10,
  },
});

interface InvoicePDFProps {
  invoice: InvoiceWithClient;
}

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.companyInfo}>Your Company Name</Text>
          <Text style={styles.companyInfo}>123 Business Rd, Tech City</Text>
          <Text style={styles.companyInfo}>contact@company.com</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.text}>Invoice #: {invoice.invoiceNumber}</Text>
          <Text style={styles.text}>Date: {formatDate(invoice.issueDate)}</Text>
          <Text style={styles.text}>Due Date: {formatDate(invoice.dueDate)}</Text>
        </View>
      </View>

      <View style={styles.clientSection}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text style={styles.text}>{invoice.client.name}</Text>
        <Text style={styles.text}>{invoice.client.companyName}</Text>
        <Text style={styles.text}>{invoice.client.address}</Text>
        <Text style={styles.text}>{invoice.client.email}</Text>
        <Text style={styles.text}>VAT: {invoice.client.vatNumber}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColDesc}>
            <Text style={styles.tableCell}>Description</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Quantity</Text>
          </View>
           <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Unit Price</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Total</Text>
          </View>
        </View>

        {invoice.items.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableColDesc}>
              <Text style={styles.tableCell}>{item.description}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatCurrency(item.unitPrice, invoice.currency)}</Text>
            </View>
             <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatCurrency(item.quantity * item.unitPrice, invoice.currency)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>VAT:</Text>
          <Text style={styles.totalValue}>{formatCurrency(invoice.vatTotal, invoice.currency)}</Text>
        </View>
         <View style={[styles.totalRow, { borderTop: '1px solid #000', paddingTop: 5 }]}>
          <Text style={[styles.totalLabel, { fontSize: 12 }]}>Total:</Text>
          <Text style={[styles.totalValue, { fontSize: 12 }]}>{formatCurrency(invoice.total, invoice.currency)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
