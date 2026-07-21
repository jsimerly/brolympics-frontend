/** One honest error message out of whatever axios caught.
 *
 * The old inline pattern -- String(detail[0] ?? detail.detail ?? ...) --
 * silently broke on string bodies: detail[0] is the FIRST CHARACTER, so a
 * 500's HTML page rendered as "<" and a plain-string 400 showed one letter.
 * This handles every DRF shape and falls back to the caller's message.
 */
export const apiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (data == null) return fallback; // network error, timeout, no response
  if (typeof data === 'string') {
    // a real message passes through; an HTML error page is not a message
    const text = data.trim();
    return !text || text.startsWith('<') ? fallback : text;
  }
  if (Array.isArray(data)) {
    return data.length ? String(data[0]) : fallback;
  }
  if (typeof data === 'object') {
    if (data.detail) return String(data.detail);
    // DRF field errors: {field: ["msg", ...]} -- name the field
    const [field, messages] = Object.entries(data)[0] || [];
    if (field != null) {
      const first = Array.isArray(messages) ? messages[0] : messages;
      return `${field}: ${String(first)}`;
    }
  }
  return fallback;
};
