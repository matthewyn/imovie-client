export function formatDate(date) {
  return new Date(date).toLocaleString();
}

export function formatDateOnly(date) {
  return new Date(date).toLocaleDateString();
}
