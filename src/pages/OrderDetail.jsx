import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { generateApiOrigin } from "../utils/apiOrigin";
import axios from "axios";
import {
  HiChevronDown,
  HiChevronLeft,
  HiChevronUp,
  HiMinus,
  HiPlus,
  HiTicket,
} from "react-icons/hi2";
import { Button, Divider, Image, Skeleton } from "@heroui/react";
import PopcornImage from "../assets/popcorn.png";
import TicketImage from "../assets/ticket.png";
import { formatDate, formatDateOnly } from "../utils/dates";
import { statusLabels, ORDER_STEPS } from "../utils/movies";
import toast from "react-hot-toast";
import { DateTime } from "luxon";

function mapStatusToSteps(statusHistory) {
  const statusMap = new Map(statusHistory.map((s) => [s.tipe, s.createdAt]));

  if (statusMap.has("cancelled")) {
    return [
      {
        label: "pending-payment",
        done: statusMap.has("pending-payment"),
        date: statusMap.get("pending-payment") || null,
      },
      {
        label: "cancelled",
        done: true,
        date: statusMap.get("cancelled") || null,
      },
    ];
  }

  return ORDER_STEPS.map((step) => ({
    label: step,
    done: statusMap.has(step),
    date: statusMap.get(step) || null,
  }));
}

function OrderDetail() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [popcornCola, setPopcornCola] = useState(0);
  const [popcornChips, setPopcornChips] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const steps = orderDetail ? mapStatusToSteps(orderDetail.status) : [];
  const isCancelled = orderDetail
    ? steps[steps.length - 1].label === "cancelled"
    : false;
  const isNotConfirmed = orderDetail
    ? !steps[steps.length - 1].done && !isCancelled
    : true;

  const items = [
    {
      name: "Popcorn & Cola",
      desc: "Salt medium",
      price: 10000,
      image: PopcornImage,
      quantityState: popcornCola,
      setQuantityState: setPopcornCola,
    },
    {
      name: "Popcorn & Chips",
      desc: "Cheese medium",
      price: 12000,
      image: PopcornImage,
      quantityState: popcornChips,
      setQuantityState: setPopcornChips,
    },
  ];

  const toggleVisibility = () => setIsVisible(!isVisible);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(generateApiOrigin(`/api/orders/${id}`), {
        withCredentials: true,
      });
      setOrderDetail(data);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletePayment = async (e) => {
    try {
      e.preventDefault();

      const snacksData = items
        .filter((item) => item.quantityState > 0)
        .map((item) => ({
          name: item.name,
          desc: item.desc,
          price: item.price,
          image: item.image,
          quantity: item.quantityState,
          subtotal: item.quantityState * item.price,
        }));

      const totalPrice =
        orderDetail.totalPrice +
        items.reduce((sum, item) => sum + item.price * item.quantityState, 0);

      const response = await axios.post(
        generateApiOrigin(`/api/orders/confirm-payment/${id}`),
        {
          selectedTime: orderDetail.jam,
          snacks: snacksData,
          totalPrice,
          idMovie: orderDetail.idMovie,
          seats: orderDetail.seats,
        },
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201) {
        toast.success("Payment successfully confirmed!");
        fetchOrderDetail();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  useEffect(() => {
    if (!orderDetail?.paymentDeadline || !isNotConfirmed) {
      setTimeRemaining(null);
      return;
    }

    let interval;

    const updateCountdown = () => {
      const now = DateTime.now();
      const deadline = DateTime.fromMillis(orderDetail.paymentDeadline);
      const diff = deadline.diff(now, ["hours", "minutes", "seconds"]);

      if (diff.hours < 0 || diff.minutes < 0 || diff.seconds < 0) {
        setTimeRemaining(null);
        clearInterval(interval);
        setIsLoading(true);
        setTimeout(() => {
          fetchOrderDetail();
        }, 2000);
      } else {
        setTimeRemaining(diff);
      }
    };

    updateCountdown();
    interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [orderDetail?.paymentDeadline, isNotConfirmed]);

  return (
    <div className="p-6">
      <Link className="mr-4" to="/account/orders">
        <HiChevronLeft size={24} className="text-indigo-500" />
      </Link>
      {isLoading ? (
        <>
          <Skeleton className="w-48 h-10 rounded-lg" />
          <Skeleton className="w-32 h-4 rounded-lg mt-3" />
        </>
      ) : (
        <>
          <h1 className="font-semibold text-3xl">Order #{id}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {orderDetail ? formatDateOnly(orderDetail.jam) : "N/A"}
          </p>
        </>
      )}
      <div className="grid grid-cols-3 mt-4 gap-4">
        <div className="flex flex-col gap-4 col-span-2">
          <div className="bg-white rounded-xl border border-gray-400/30 p-6">
            {isLoading ? (
              <>
                <div className="flex justify-between mb-4">
                  <Skeleton className="w-32 h-6 rounded-lg" />
                  <Skeleton className="w-24 h-6 rounded-lg" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-24 h-5 rounded-lg" />
                    <Skeleton className="w-40 h-4 rounded-lg" />
                  </div>
                  <Skeleton className="w-20 h-4 rounded-lg" />
                  <Skeleton className="w-24 h-5 rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <h3 className="font-semibold text-black/80 text-lg">
                    Items Ordered
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">
                      {1 + orderDetail.snacks.length} item(s)
                    </span>
                    <button>
                      {isVisible ? (
                        <HiChevronUp
                          size={20}
                          onClick={toggleVisibility}
                          className="cursor-pointer"
                        />
                      ) : (
                        <HiChevronDown
                          size={20}
                          onClick={toggleVisibility}
                          className="cursor-pointer"
                        />
                      )}
                    </button>
                  </div>
                </div>
                {isVisible && (
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex gap-4">
                      <HiTicket
                        size={48}
                        className="text-indigo-500 bg-white border border-gray-400/30 p-1 rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">Cinema Ticket</h4>
                        <p>
                          Seats:{" "}
                          {orderDetail ? orderDetail.seats.join(", ") : "N/A"}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p>
                          <span className="text-gray-500">
                            {orderDetail ? orderDetail.seats.length : "N/A"} ×
                          </span>{" "}
                          Rp 35.000
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          Rp{" "}
                          {orderDetail
                            ? (orderDetail.seats.length * 35000).toLocaleString(
                                "id-ID",
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    {orderDetail &&
                      orderDetail.snacks.map((snack) => (
                        <div className="flex gap-4" key={snack.name}>
                          <Image
                            src={snack.image}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover bg-white border border-gray-400/30 p-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{snack.name}</h4>
                            <p>{snack.desc}</p>
                          </div>
                          <div className="flex-1">
                            <p>
                              <span className="text-gray-500">
                                {snack.quantity} ×
                              </span>{" "}
                              Rp {snack.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">
                              Rp {snack.subtotal.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="rounded-2xl p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            {isLoading ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="w-40 h-6 rounded-lg" />
                  <Skeleton className="w-40 h-4 rounded-lg" />
                </div>
                <div className="space-y-4">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={`snack-skeleton-${i}`}
                        className="flex items-center justify-between bg-black/40 p-4 rounded-xl"
                      >
                        <div className="flex gap-4 items-center">
                          <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
                          <div className="space-y-2">
                            <Skeleton className="w-32 h-4 rounded-lg" />
                            <Skeleton className="w-24 h-3 rounded-lg" />
                            <Skeleton className="w-20 h-3 rounded-lg" />
                          </div>
                        </div>
                        <Skeleton className="w-16 h-8 rounded-full flex-shrink-0" />
                      </div>
                    ))}
                </div>
              </>
            ) : isCancelled ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    ✕
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">Order Cancelled</h2>
                    <p className="text-sm text-gray-400">
                      Your order has been cancelled
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-4" />

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <Button
                    className="bg-lime-400 text-black px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition"
                    as={Link}
                    to={`/movie/${orderDetail.idMovie}`}
                  >
                    Create New Order
                  </Button>

                  <button className="border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/10 transition">
                    Contact Support
                  </button>
                </div>
              </>
            ) : isNotConfirmed ? (
              <>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    🍿 Make your movie better
                  </h2>

                  <span className="text-sm text-gray-300">
                    Add snacks & merchandise
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-black/40 p-4 rounded-xl"
                    >
                      {/* Left */}
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.image}
                          className="w-14 h-14 rounded-lg object-cover"
                        />

                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                          <p className="text-sm mt-1">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      {/* CTA */}
                      {item.quantityState > 0 ? (
                        <div className="flex gap-3 items-center">
                          <Button
                            isIconOnly
                            aria-label="Add"
                            variant="bordered"
                            color="success"
                            className="text-lime-400"
                            radius="full"
                            onClick={() => {
                              item.setQuantityState(item.quantityState + 1);
                            }}
                          >
                            <HiPlus />
                          </Button>
                          <span>{item.quantityState}</span>
                          <Button
                            isIconOnly
                            aria-label="Remove"
                            variant="bordered"
                            color="success"
                            className="text-lime-400"
                            radius="full"
                            onClick={() =>
                              item.setQuantityState(item.quantityState - 1)
                            }
                          >
                            <HiMinus />
                          </Button>
                        </div>
                      ) : (
                        <button
                          className="bg-lime-400 text-black px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition"
                          onClick={() => item.setQuantityState(1)}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    ✓
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">Order Complete</h2>
                    <p className="text-sm text-gray-400">
                      You're all set for the show
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-4" />

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Image src={PopcornImage} width={32} /> Snack ordering is
                    now closed.
                  </div>
                  <div className="flex items-center">
                    <Image src={TicketImage} width={32} /> Please arrive 15
                    minutes before the show starts.
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <button className="bg-lime-400 text-black px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition">
                    View Ticket
                  </button>

                  <button className="border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/10 transition">
                    Contact Support
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-400/30 p-6 flex flex-col gap-3">
            {isLoading ? (
              <>
                <Skeleton className="w-20 h-6 rounded-lg" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="w-24 h-4 rounded-lg" />
                    <Skeleton className="w-24 h-4 rounded-lg" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="w-12 h-4 rounded-lg" />
                    <Skeleton className="w-16 h-4 rounded-lg" />
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <Skeleton className="w-24 h-4 rounded-lg" />
                  <Skeleton className="w-24 h-4 rounded-lg" />
                </div>
                <Skeleton className="w-full h-10 rounded-lg" />
              </>
            ) : (
              <>
                <h3 className="font-semibold">Summary</h3>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Amount</span>
                  <span>
                    Rp{" "}
                    {orderDetail
                      ? orderDetail.totalPrice.toLocaleString("id-ID")
                      : "N/A"}
                  </span>
                </div>
                {items.map((item, i) =>
                  item.quantityState > 0 ? (
                    <div className="flex justify-between" key={i}>
                      <span className="text-gray-500">{item.name}</span>
                      <span>
                        Rp{" "}
                        {(item.price * item.quantityState).toLocaleString(
                          "id-ID",
                        )}
                      </span>
                    </div>
                  ) : null,
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">VAT</span>
                  <span>Rp 0</span>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span>
                    Rp{" "}
                    {orderDetail
                      ? (
                          orderDetail.totalPrice +
                          items.reduce(
                            (sum, item) =>
                              sum + item.price * item.quantityState,
                            0,
                          )
                        ).toLocaleString("id-ID")
                      : "N/A"}
                  </span>
                </div>
                {isNotConfirmed && (
                  <Button color="secondary" onClick={handleCompletePayment}>
                    Complete Payment
                  </Button>
                )}
              </>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-400/30 p-6 flex flex-col gap-4">
            {isLoading ? (
              <>
                <Skeleton className="w-24 h-6 rounded-lg" />
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={`status-skeleton-${i}`}
                        className="flex gap-3 items-start"
                      >
                        <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="w-32 h-4 rounded-lg" />
                          <Skeleton className="w-40 h-3 rounded-lg" />
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold">Order Status</h3>
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      {/* Circle */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${
                          step.done ? "bg-indigo-500" : "bg-gray-300"
                        }`}
                      >
                        {step.done ? "✓" : ""}
                      </div>

                      {/* Content */}
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {statusLabels[step.label]}
                        </p>

                        {step.date && (
                          <p className="text-xs text-gray-400">
                            {formatDate(step.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {isLoading || (isNotConfirmed && timeRemaining) ? (
            <div className="bg-white rounded-xl border border-gray-400/30 p-6 flex flex-col gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="w-24 h-6 rounded-lg" />
                  <div className="space-y-4">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={`status-skeleton-${i}`}
                          className="flex gap-3 items-start"
                        >
                          <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="w-32 h-4 rounded-lg" />
                            <Skeleton className="w-40 h-3 rounded-lg" />
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold">Complete Payment in</h3>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="text-3xl font-bold text-indigo-600">
                      {Math.floor(timeRemaining.hours)}h{" "}
                      {Math.floor(timeRemaining.minutes)}m{" "}
                      {Math.floor(timeRemaining.seconds)}s
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Complete payment before the deadline
                  </p>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
