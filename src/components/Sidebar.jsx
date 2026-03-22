import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineShoppingCart,
  HiOutlineStar,
  HiOutlineFilm,
  HiOutlineClock,
  HiOutlineTableCells,
} from "react-icons/hi2";
import { useAuth } from "../contexts/AuthContext";

const menu = [
  {
    name: "Orders",
    path: "/account/orders",
    icon: <HiOutlineShoppingCart />,
    restricted: false,
  },
  {
    name: "Wishlists",
    path: "/account/wishlists",
    icon: <HiOutlineStar />,
    restricted: false,
  },
  {
    name: "Movies",
    path: "/account/movies",
    icon: <HiOutlineFilm />,
    restricted: true,
  },
  {
    name: "Studio",
    path: "/account/studio",
    icon: <HiOutlineTableCells />,
    restricted: true,
  },
  {
    name: "Schedules",
    path: "/account/schedules",
    icon: <HiOutlineClock />,
    restricted: true,
  },
];

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="w-64 p-6">
      <ul className="flex flex-col gap-4">
        {menu.map((item) => {
          if (item.restricted && user?.role !== "admin") {
            return null;
          }
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex px-4 py-2 rounded items-center hover:bg-gray-200 ${location.pathname.startsWith(item.path) ? "bg-indigo-50 text-indigo-500 font-semibold" : "text-gray-600"}`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
