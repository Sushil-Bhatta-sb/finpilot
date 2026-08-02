const PDFDocument = require('pdfkit');
const Transaction = require('../models/Transaction');

// Build a dynamic Mongoose filter/sort from query params.
function buildQuery(req) {
  const { search, category, type, sortBy, order, startDate, endDate } = req.query;

  const filter = { user: req.user.id };
  const and = [];

  if (type) filter.type = type;
  if (search) and.push({ description: { $regex: search, $options: 'i' } });
  if (category) and.push({ description: { $regex: category, $options: 'i' } });
  if (and.length) filter.$and = and;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const sortField = sortBy || 'date';
  const sortOrder = order === 'asc' ? 1 : -1;

  return { filter, sort: { [sortField]: sortOrder } };
}

exports.getTransactions = async (req, res) => {
  const { filter, sort } = buildQuery(req);
  const transactions = await Transaction.find(filter).sort(sort);
  res.json(transactions);
};

// Minimal CSV builder (no external dependency).
exports.exportCSV = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

  const escape = (value) => {
    const s = value == null ? '' : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const header = ['Date', 'Type', 'Description', 'Amount'];
  const rows = transactions.map((t) =>
    [
      new Date(t.date).toISOString(),
      t.type,
      t.description || '',
      t.amount != null ? t.amount : '',
    ]
      .map(escape)
      .join(',')
  );

  const csv = [header.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
  res.send(csv);
};

// Stream a simple tabular PDF using pdfkit.
exports.exportPDF = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="transactions.pdf"');
  doc.pipe(res);

  doc.fontSize(18).text('FinPilot — Transaction Report', { align: 'center' });
  doc.moveDown(1);

  const cols = { date: 40, type: 170, description: 260, amount: 470 };

  const drawRow = (row, bold) => {
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);
    const y = doc.y;
    doc.text(row.date, cols.date, y, { width: 120 });
    doc.text(row.type, cols.type, y, { width: 80 });
    doc.text(row.description, cols.description, y, { width: 200 });
    doc.text(row.amount, cols.amount, y, { width: 90 });
    doc.moveDown(0.6);
  };

  drawRow({ date: 'Date', type: 'Type', description: 'Description', amount: 'Amount' }, true);

  transactions.forEach((t) => {
    drawRow(
      {
        date: new Date(t.date).toISOString().slice(0, 10),
        type: t.type,
        description: t.description || '',
        amount: t.amount != null ? String(t.amount) : '',
      },
      false
    );
    if (doc.y > 760) doc.addPage();
  });

  doc.end();
};
