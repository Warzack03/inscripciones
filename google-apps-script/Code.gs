const SPREADSHEET_ID = "PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET";
const NOTIFICATION_EMAIL = "risingraimon@gmail.com";
const ALLOWED_SHEETS = ["Madrid", "Tarragona", "Barcelona"];

function doPost(e) {
  try {
    const payload = e.parameter || {};
    const targetSheetName = ALLOWED_SHEETS.includes(payload.sheetName) ? payload.sheetName : "Madrid";
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(targetSheetName) || spreadsheet.insertSheet(targetSheetName);

    ensureHeader(sheet);

    const row = [
      new Date(),
      payload.sede || "",
      payload.zona || "",
      targetSheetName,
      payload.nombre || "",
      payload.email || "",
      payload.telefono || "",
      payload.fechaNacimiento || "",
      payload.categoria || "",
      payload.posicion || "",
      payload.experiencia || "",
      payload.preferenciaEntreno || "",
      payload.preferenciaPartidos || "",
      payload.aceptaPolitica || "",
      payload.sourcePage || "",
      payload.urlOrigen || ""
    ];

    sheet.appendRow(row);
    sendNotification(row);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, sheet: targetSheetName })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow([
    "Timestamp",
    "Sede",
    "Zona",
    "Hoja destino",
    "Nombre",
    "Email",
    "Telefono",
    "Fecha nacimiento",
    "Categoria",
    "Posicion",
    "Experiencia",
    "Preferencia entreno",
    "Preferencia partidos",
    "Politica aceptada",
    "Pagina origen",
    "URL origen"
  ]);
}

function sendNotification(row) {
  const [
    timestamp,
    sede,
    zona,
    hojaDestino,
    nombre,
    email,
    telefono,
    fechaNacimiento,
    categoria,
    posicion,
    experiencia,
    preferenciaEntreno,
    preferenciaPartidos
  ] = row;

  const lines = [
    "Nueva inscripcion recibida en Rising Raimon",
    "",
    "Fecha: " + timestamp,
    "Sede: " + sede,
    "Zona: " + zona,
    "Hoja destino: " + hojaDestino,
    "Nombre: " + nombre,
    "Email: " + email,
    "Telefono: " + telefono,
    "Fecha de nacimiento: " + fechaNacimiento,
    "Categoria: " + categoria,
    "Posicion: " + posicion,
    "Experiencia: " + experiencia,
    "Preferencia entreno: " + preferenciaEntreno,
    "Preferencia partidos: " + preferenciaPartidos
  ];

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: "[Rising Raimon] Nueva inscripcion - " + nombre,
    body: lines.join("\n")
  });
}
