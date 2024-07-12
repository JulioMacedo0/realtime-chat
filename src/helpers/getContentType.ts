/**
 * Returns the correct content type based on the file extension.
 *
 * @param {string} extension - The file extension.
 * @returns {string} - The corresponding content type.
 */
export const getContentType = (extension: string) => {
  const ContentTypes: { [key: string]: string } = {
    // Imagens
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
    svg: "image/svg+xml",

    // Vídeos
    mp4: "video/mp4",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    webm: "video/webm",

    // Áudios
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
    flac: "audio/flac",

    // Documentos
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    csv: "text/csv",

    // Outros
    zip: "application/zip",
    json: "application/json",
    xml: "application/xml",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
  };

  const ContentType = ContentTypes[extension.toLowerCase()];

  if (!ContentType) {
    throw new Error(`Unsupported file extension: ${extension}`);
  }

  return ContentType;
};
