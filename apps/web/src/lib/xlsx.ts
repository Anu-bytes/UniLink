// A small .xlsx writer for the admin exports: styled cells, merged title
// rows, frozen headers, filters, formulas and data bars, nothing more.
// Written here rather than pulling in a spreadsheet library, which would add
// a large dependency tree for a handful of reports. Server-only (node:zlib).

import { deflateRawSync } from "node:zlib";

/**
 * The fixed style table. Each key maps to one entry in styles.xml, so a cell
 * names its look instead of carrying formatting of its own.
 */
export type CellStyle =
  | "title"
  | "subtitle"
  | "section"
  | "header"
  | "headerStart"
  | "text"
  | "textAlt"
  | "number"
  | "numberAlt"
  | "decimal"
  | "decimalAlt"
  | "percent"
  | "label"
  | "totalLabel"
  | "total"
  | "muted";

export type Cell = { value: string | number | null; style?: CellStyle; formula?: string } | string | number | null;

export type Sheet = {
  name: string;
  /** Column widths in characters. */
  columns: number[];
  rows: Cell[][];
  /** Ranges such as "A1:F1". */
  merges?: string[];
  /** Rows (from the top) and columns (from the start) kept in view. */
  freeze?: { rows: number; columns?: number };
  autoFilter?: string;
  /** Ranges that get an in-cell bar scaled to the largest value. */
  dataBars?: { range: string; color: string }[];
  /** Row heights in points, by 1-based row number. */
  heights?: Record<number, number>;
  rightToLeft?: boolean;
};

const STYLE_INDEX: Record<CellStyle, number> = {
  text: 1,
  textAlt: 2,
  title: 3,
  subtitle: 4,
  section: 5,
  header: 6,
  headerStart: 7,
  number: 8,
  numberAlt: 9,
  decimal: 10,
  decimalAlt: 11,
  percent: 12,
  label: 13,
  totalLabel: 14,
  total: 15,
  muted: 16,
};

// Fonts: 0 body, 1 title, 2 subtitle, 3 section, 4 header, 5 bold body, 6 muted.
// Fills: 0/1 required by Excel, 2 navy, 3 light blue, 4 zebra, 5 total.
// Borders: 0 none, 1 hairline bottom, 2 strong top.
const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="3"><numFmt numFmtId="164" formatCode="#,##0"/><numFmt numFmtId="165" formatCode="0.0"/><numFmt numFmtId="166" formatCode="+0%;-0%;0%"/></numFmts>
<fonts count="7">
<font><sz val="11"/><color rgb="FF1F2A44"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><i/><sz val="10"/><color rgb="FF64748B"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="12"/><color rgb="FF1E6DEB"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FF0B1220"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FF0B1220"/><name val="Calibri"/><family val="2"/></font>
<font><sz val="10"/><color rgb="FF94A3B8"/><name val="Calibri"/><family val="2"/></font>
</fonts>
<fills count="6">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF0B1220"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFEAF2FE"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF7F9FC"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFF6E5"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="3">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left/><right/><top/><bottom style="thin"><color rgb="FFE2E8F0"/></bottom><diagonal/></border>
<border><left/><right/><top style="medium"><color rgb="FF0B1220"/></top><bottom style="thin"><color rgb="FFE2E8F0"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="17">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" indent="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="bottom"/></xf>
<xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="164" fontId="0" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="165" fontId="0" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="5" fillId="5" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="164" fontId="5" fillId="5" borderId="2" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="6" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
<dxfs count="0"/>
</styleSheet>`;

const escapeXml = (text: string) =>
  text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** 0 -> "A", 26 -> "AA". */
export function columnName(index: number) {
  let name = "";
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  return name;
}

function cellXml(cell: Cell, ref: string) {
  if (cell === null || cell === undefined) return "";
  const { value, style, formula } = typeof cell === "object" ? cell : { value: cell, style: undefined, formula: undefined };
  const s = style ? ` s="${STYLE_INDEX[style]}"` : "";
  if (formula) {
    const cached = typeof value === "number" ? `<v>${value}</v>` : "";
    return `<c r="${ref}"${s}><f>${escapeXml(formula)}</f>${cached}</c>`;
  }
  if (value === null || value === "") return style ? `<c r="${ref}"${s}/>` : "";
  if (typeof value === "number") return Number.isFinite(value) ? `<c r="${ref}"${s}><v>${value}</v></c>` : `<c r="${ref}"${s}/>`;
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function sheetXml(sheet: Sheet) {
  const width = Math.max(sheet.columns.length, ...sheet.rows.map((row) => row.length), 1);
  const lastRef = `${columnName(width - 1)}${Math.max(sheet.rows.length, 1)}`;
  const freeze = sheet.freeze;
  const pane = freeze
    ? (() => {
        const x = freeze.columns ?? 0;
        const y = freeze.rows;
        const top = `${columnName(x)}${y + 1}`;
        const active = x && y ? "bottomRight" : y ? "bottomLeft" : "topRight";
        return `<pane${x ? ` xSplit="${x}"` : ""}${y ? ` ySplit="${y}"` : ""} topLeftCell="${top}" activePane="${active}" state="frozen"/><selection pane="${active}" activeCell="${top}" sqref="${top}"/>`;
      })()
    : "";
  const cols = sheet.columns.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("");
  const rows = sheet.rows
    .map((row, r) => {
      const height = sheet.heights?.[r + 1];
      const cells = row.map((cell, c) => cellXml(cell, `${columnName(c)}${r + 1}`)).join("");
      return `<row r="${r + 1}"${height ? ` ht="${height}" customHeight="1"` : ""}>${cells}</row>`;
    })
    .join("");
  const merges = sheet.merges?.length
    ? `<mergeCells count="${sheet.merges.length}">${sheet.merges.map((ref) => `<mergeCell ref="${ref}"/>`).join("")}</mergeCells>`
    : "";
  const bars = (sheet.dataBars ?? [])
    .map(
      (bar, i) =>
        `<conditionalFormatting sqref="${bar.range}"><cfRule type="dataBar" priority="${i + 1}"><dataBar><cfvo type="num" val="0"/><cfvo type="max"/><color rgb="FF${bar.color}"/></dataBar></cfRule></conditionalFormatting>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<dimension ref="A1:${lastRef}"/>
<sheetViews><sheetView workbookViewId="0" showGridLines="0"${sheet.rightToLeft ? ' rightToLeft="1"' : ""}>${pane}</sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="18"/>
${cols ? `<cols>${cols}</cols>` : ""}
<sheetData>${rows}</sheetData>
${sheet.autoFilter ? `<autoFilter ref="${sheet.autoFilter}"/>` : ""}
${merges}${bars}
<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>
<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>
</worksheet>`;
}

/** Excel sheet names: at most 31 characters, none of []:*?/\ and unique. */
function safeSheetNames(names: string[]) {
  const used = new Set<string>();
  return names.map((name, i) => {
    let base = name.replace(/[[\]:*?/\\]/g, " ").trim().slice(0, 31) || `Sheet${i + 1}`;
    while (used.has(base.toLowerCase())) base = `${base.slice(0, 28)} ${i + 1}`;
    used.add(base.toLowerCase());
    return base;
  });
}

// ---- Zip (stored as deflate), enough for an Office Open XML package. ----

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data: Buffer) {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(files: { name: string; data: string }[]) {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  // Fixed DOS timestamp (1 Jan 2020): entries do not need a real one.
  const time = 0;
  const date = ((2020 - 1980) << 9) | (1 << 5) | 1;
  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const raw = Buffer.from(file.data, "utf8");
    const packed = deflateRawSync(raw);
    const crc = crc32(raw);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, name, packed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);
    offset += local.length + name.length + packed.length;
  }
  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

/** Excel expects each filter range registered as a hidden name; an empty list is invalid. */
function definedNames(sheets: Sheet[], names: string[]) {
  const entries = sheets.flatMap((sheet, i) => {
    if (!sheet.autoFilter) return [];
    const range = sheet.autoFilter.replace(/([A-Z]+)(\d+)/g, (_, col: string, row: string) => `$${col}$${row}`);
    return [`<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${escapeXml(names[i].replace(/'/g, "''"))}'!${range}</definedName>`];
  });
  return entries.length ? `<definedNames>${entries.join("")}</definedNames>` : "";
}

/** Builds the .xlsx file. */
export function buildWorkbook(sheets: Sheet[], options: { title?: string } = {}) {
  const names = safeSheetNames(sheets.map((sheet) => sheet.name));
  const files = [
    {
      name: "[Content_Types].xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets
        .map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`)
        .join("")}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`,
    },
    {
      name: "_rels/.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
    },
    {
      name: "docProps/core.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${escapeXml(options.title ?? "")}</dc:title><dc:creator>UniLink</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 19)}Z</dcterms:created></cp:coreProperties>`,
    },
    {
      name: "xl/workbook.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>${names
        .map((name, i) => `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
        .join("")}</sheets>${definedNames(sheets, names)}</workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets
        .map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`)
        .join("")}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    },
    { name: "xl/styles.xml", data: STYLES_XML },
    ...sheets.map((sheet, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(sheet) })),
  ];
  return zip(files);
}
