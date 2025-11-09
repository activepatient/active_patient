export function generateFilename(prefix = 'scanned') {
  const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '');
  const t = Date.now();
  return `${sanitizedPrefix}_${t}`;
}

export function isValidUri(uri) {
  if (typeof uri !== 'string') return false;
  return /^(file:\/\/|content:\/\/|https?:\/\/).+/i.test(uri);
}

export function normalizeUri(uri) {
  if (typeof uri !== 'string') return null;
  if (uri.startsWith('file://')) return uri;
  if (uri.startsWith('/')) return 'file://' + uri;
  return uri;
}

export function extractExtension(filename) {
  if (typeof filename !== 'string') return '';
  const baseName = filename.split('?')[0];
  const m = baseName.match(/(\.[0-9a-zA-Z]+)$/);
  return m ? m[1].toLowerCase() : '';
}
