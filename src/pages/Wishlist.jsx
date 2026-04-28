import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Pagination,
  Skeleton,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { generateApiOrigin } from "../utils/apiOrigin";
import axios from "axios";
import { getAuthHeader } from "../utils/token";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const urlFetch = generateApiOrigin("/api/wishlists");

function Wishlist() {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(urlFetch, {
          headers: getAuthHeader(),
          params: {
            limit: 10,
            page: currentPage,
          },
        });
        setMovies(data.wishlists);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchWishlistPage = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(urlFetch, {
          headers: getAuthHeader(),
          params: {
            limit: 10,
            page: currentPage,
          },
        });
        setMovies(data.wishlists);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlistPage();
  }, [currentPage]);

  return (
    <div className="p-6">
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Account</BreadcrumbItem>
        <BreadcrumbItem>Wishlists</BreadcrumbItem>
      </Breadcrumbs>
      {isLoading ? (
        <div className="grid grid-cols-5 gap-4 mt-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Card key={`skeleton-wishlist-${i}`} className="py-4">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <Skeleton className="w-full aspect-video rounded-xl" />
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Skeleton className="w-3/4 h-6 rounded-lg mb-2" />
                  <Skeleton className="w-1/2 h-4 rounded-lg" />
                </CardBody>
              </Card>
            ))}
        </div>
      ) : movies && movies.length > 0 ? (
        <div className="grid grid-cols-5 gap-4 mt-4">
          {movies.map((movie) => (
            <Card key={movie.id} className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <Image
                  alt="Movie image"
                  className="object-cover rounded-xl"
                  src={movie.filePath}
                  width={270}
                />
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <h4 className="font-bold text-xl">{movie.judul}</h4>
                <p className="text-default-500">{movie.genre}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-4">You don't have any movies in your Wishlist.</p>
      )}
      {movies && movies.length > 0 && (
        <div className="flex gap-2 mt-4 items-center">
          <Button
            color="default"
            size="sm"
            variant="light"
            isIconOnly
            isDisabled={currentPage <= 1}
            onPress={() =>
              setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
            }
          >
            <HiChevronLeft size={20} />
          </Button>
          <Pagination
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
          <Button
            color="default"
            size="sm"
            variant="light"
            isIconOnly
            isDisabled={currentPage >= totalPages}
            onPress={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
          >
            <HiChevronRight size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
