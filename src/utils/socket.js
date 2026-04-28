import io from "socket.io-client";

const socket =
  process.env.NODE_ENV === "development"
    ? io.connect("http://localhost:3000")
    : io.connect(`${import.meta.env.VITE_BACKEND_API}`);

export default socket;
