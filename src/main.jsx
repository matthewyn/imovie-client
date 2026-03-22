import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import "./index.css";
import Movie from "./pages/Movie.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Studio from "./pages/Studio.jsx";
import Schedules from "./pages/Schedules.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import RootLayout from "./layouts/RootLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "movie/:id", element: <MovieDetail /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
      { path: "account/orders", element: <Orders /> },
      { path: "account/orders/:id", element: <OrderDetail /> },
      { path: "account/wishlists", element: <Wishlist /> },
      { path: "account/movies", element: <Movie /> },
      { path: "account/studio", element: <Studio /> },
      { path: "account/schedules", element: <Schedules /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <RouterProvider router={router}></RouterProvider>
    </HeroUIProvider>
  </StrictMode>,
);
