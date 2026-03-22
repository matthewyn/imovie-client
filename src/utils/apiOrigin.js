export function generateApiOrigin(path) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:3000${path}`;
  } else {
    return `${process.env.BACKEND_API}${path}`;
  }
}
