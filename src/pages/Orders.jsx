import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Chip,
  Image,
  Pagination,
  Skeleton,
} from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { generateApiOrigin } from "../utils/apiOrigin";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import {
  statusLabels,
  PENDING_PAYMENT,
  CONFIRMED,
  ALL,
  CANCELLED,
} from "../utils/movies";

const urlFetch = generateApiOrigin("/api/orders");
const urlFetchPending = generateApiOrigin("/api/orders/pending-payment");
const urlFetchConfirmed = generateApiOrigin("/api/orders/confirmed");
const urlFetchCancelled = generateApiOrigin("/api/orders/cancelled");

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleAllStatus = async (e) => {
    try {
      setIsLoading(true);
      setSelectedStatus(ALL);
      const { data } = await axios.get(urlFetch, {
        withCredentials: true,
        params: {
          limit: 10,
          page: currentPage,
        },
      });
      setOrders(data.orders);
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

  const handlePendingStatus = async (e) => {
    try {
      setIsLoading(true);
      setSelectedStatus(PENDING_PAYMENT);
      const { data } = await axios.get(urlFetchPending, {
        withCredentials: true,
        params: {
          limit: 10,
          page: currentPage,
        },
      });
      setOrders(data.orders);
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

  const handleConfirmedStatus = async (e) => {
    try {
      setIsLoading(true);
      setSelectedStatus(CONFIRMED);
      const { data } = await axios.get(urlFetchConfirmed, {
        withCredentials: true,
        params: {
          limit: 10,
          page: currentPage,
        },
      });
      setOrders(data.orders);
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

  const handleCancelledStatus = async (e) => {
    try {
      setIsLoading(true);
      setSelectedStatus(CANCELLED);
      const { data } = await axios.get(urlFetchCancelled, {
        withCredentials: true,
        params: {
          limit: 10,
          page: currentPage,
        },
      });
      setOrders(data.orders);
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

  const statusUrl = {
    [ALL]: handleAllStatus,
    [PENDING_PAYMENT]: handlePendingStatus,
    [CONFIRMED]: handleConfirmedStatus,
    [CANCELLED]: handleCancelledStatus,
  };

  useEffect(() => {
    handleAllStatus();
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      statusUrl[selectedStatus]();
    }
  }, [currentPage]);

  return (
    <div className="p-6">
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Account</BreadcrumbItem>
        <BreadcrumbItem>Orders</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex gap-2 mt-4">
        {Object.keys(statusLabels).map((status) => (
          <Chip
            key={status}
            color={selectedStatus === status ? "secondary" : "default"}
            variant="bordered"
            as={Button}
            onClick={statusUrl[status]}
          >
            {statusLabels[status]}
          </Chip>
        ))}
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={`skeleton-order-${i}`}>
                <CardBody>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-28 h-6 rounded-lg" />
                    <Skeleton className="w-32 h-4 rounded-lg" />
                  </div>
                  <div className="flex mt-4 gap-3">
                    <Skeleton className="w-24 h-32 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-3/4 h-5 rounded-lg" />
                      <Skeleton className="w-full h-4 rounded-lg" />
                      <Skeleton className="w-1/2 h-4 rounded-lg" />
                    </div>
                    <Skeleton className="w-6 h-6 rounded-lg" />
                  </div>
                </CardBody>
              </Card>
            ))
        ) : orders && orders.length > 0 ? (
          orders.map((order) => {
            const date = new Date(order.jam);
            const dayKey = date.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              year: "numeric",
            });
            const currentStatus = order.status[order.status.length - 1].tipe;

            return (
              <Card key={order.id}>
                <CardBody>
                  <div className="flex items-center gap-2">
                    <Chip color="secondary" size="sm">
                      {statusLabels[currentStatus]}
                    </Chip>
                    <span className="text-gray-400 text-sm">| {dayKey}</span>
                  </div>
                  <div className="flex mt-4 gap-3">
                    <Image
                      alt="Movie Poster"
                      src={order.filePath}
                      width={100}
                    />
                    <div className="flex-1">
                      <h2 className="text-indigo-700 font-semibold">
                        Order ID: {order.id}
                      </h2>
                      <p>
                        {order.judul} | {order.studio} | Seats:{" "}
                        {order.seats.join(", ")}
                      </p>
                      <p>Rp. {order.totalPrice.toLocaleString("id-ID")}</p>
                    </div>
                    <Link className="mr-4" to={`${order.id}`}>
                      <HiChevronRight size={24} className="text-indigo-500" />
                    </Link>
                  </div>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <p className="text-gray-500">You don't have any orders yet.</p>
        )}
      </div>
      {orders && orders.length > 0 && (
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

export default Orders;
