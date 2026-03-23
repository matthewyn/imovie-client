import axios from "axios";
import { useEffect, useState } from "react";
import { generateApiOrigin } from "../utils/apiOrigin";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Chip, Divider, Image, Skeleton } from "@heroui/react";
import { HiMiniStar, HiOutlineTrash, HiPlus } from "react-icons/hi2";
import { HiMiniClock } from "react-icons/hi2";
import SeatImage from "../assets/seat.png";
import toast from "react-hot-toast";

const getRowLabel = (index) => {
  return String.fromCharCode(65 + index);
};

const urlFetch = generateApiOrigin("/api/orders");

function MovieDetail() {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const grouped = {};
  const totalPrice = selectedSeats.length * 35000;
  const navigate = useNavigate();

  const toggleSeat = (row, col) => {
    const key = `${row}-${col}`;

    setSelectedSeats((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const result = await axios.post(
        urlFetch,
        {
          idMovie: id,
          selectedTime,
          scheduleId: selectedSchedule.id,
          seats: selectedSeats,
          studio: selectedSchedule.nama,
          judul: movieDetail.judul,
          totalPrice,
          filePath: movieDetail.filePath,
        },
        {
          withCredentials: true,
        },
      );

      if (result.status === 201) {
        toast.success("Ticket successfully booked! Please complete payment.");
        navigate(`/account/orders/${result.data.id}`);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 400) {
          toast.error(error.response?.data.message);
        }

        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await axios.post(
        generateApiOrigin(`/api/wishlists/${!isInWishlist ? "add" : "remove"}`),
        {
          movieId: id,
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

      toast.success(
        !isInWishlist
          ? "Movie successfully added to wishlist!"
          : "Movie successfully removed from wishlist!",
      );
      setIsInWishlist((prev) => !prev);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const { data } = await axios.get(
          generateApiOrigin(`/api/movies/${id}`),
          {
            withCredentials: true,
          },
        );
        setMovieDetail(data.movie);
        setSchedules(data.schedules);
        setIsInWishlist(data.isInWishlist);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error("Please log in to view movie details.");
            navigate("/login");
            return;
          }

          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetail();
  }, [id]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const { data } = await axios.get(
          generateApiOrigin(`/api/movies/${id}/schedules/${selectedTime}`),
        );
        setSelectedSchedule(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
    if (selectedDay && selectedTime) {
      fetchSchedules();
    }
  }, [selectedDay, selectedTime]);

  schedules.forEach((s) => {
    const date = new Date(s.score);

    const dayKey = date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    });

    const timeLabel = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    if (!grouped[dayKey]) grouped[dayKey] = [];

    grouped[dayKey].push({
      id: s.value,
      time: timeLabel,
      raw: s.score,
    });
  });

  return (
    <>
      <section className="mt-10 px-8">
        {/* Day Selection */}
        <div className="flex gap-2">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={`day-skeleton-${i}`}
                    className="w-32 h-16 rounded-xl"
                  />
                ))
            : Object.keys(grouped).map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedTime("");
                      setSelectedDay(day);
                      setSelectedSchedule(null);
                    }}
                    className={`px-12 py-2 rounded-xl transition-all duration-200 cursor-pointer select-none
                  ${
                    isSelected
                      ? "bg-gradient-to-b from-[#4a1fa8] to-[#2a0d6e] border border-[#7c3aed] shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                      : "bg-[#352848] border border-[#4e3868] hover:bg-[#3d3055]"
                  }
                `}
                  >
                    <span
                      className={`text-sm font-medium whitespace-pre-line text-white`}
                    >
                      {day.split(" ").join("\n")}
                    </span>
                  </button>
                );
              })}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-2 mt-6">
          {/* Left side - Movie Details */}
          <div className="pr-6 border-r border-gray-400/30">
            <h2 className="font-bold text-4xl">Movie Details</h2>
            {isLoading ? (
              <div className="flex mt-4 gap-6">
                <Skeleton className="w-64 h-80 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="w-full h-10 rounded-lg" />
                  <Skeleton className="w-32 h-8 rounded-lg" />
                  <Skeleton className="w-full h-6 rounded-lg" />
                  <Skeleton className="w-full h-20 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="flex mt-4 gap-6">
                <Image
                  src={movieDetail.filePath}
                  width={250}
                  alt={movieDetail.judul}
                  className="col"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-3xl mt-4">
                    {movieDetail.judul}
                  </h3>
                  <div className="flex gap-2 items-center mt-1">
                    <Chip color="secondary" radius="sm" size="lg">
                      {movieDetail.genre}
                    </Chip>
                    <Button
                      color="warning"
                      startContent={
                        isInWishlist ? <HiOutlineTrash /> : <HiPlus />
                      }
                      size="sm"
                      variant="ghost"
                      onClick={handleWishlist}
                    >
                      Wishlist
                    </Button>
                  </div>
                  <div className="flex items-center mt-2 gap-1">
                    <HiMiniStar className="text-amber-400" size={20} />
                    <span>4,5 (1.300)</span>
                    <span>•</span>
                    <span>
                      {Math.floor(movieDetail.durasi / 60)} hour{" "}
                      {movieDetail.durasi % 60 !== 0
                        ? `${movieDetail.durasi % 60} minute`
                        : ""}
                    </span>
                  </div>
                  <p className="mt-2">{movieDetail.sinopsis}</p>
                </div>
              </div>
            )}
            <Divider className="my-6" />

            {/* Time selection */}
            <div className="flex items-center gap-1">
              <HiMiniClock size={20} className="text-gray-600" />
              <span>Selected Time</span>
            </div>
            {isLoading ? (
              <div className="flex mt-2 gap-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={`time-skeleton-${i}`}
                      className="w-24 h-10 rounded-xl"
                    />
                  ))}
              </div>
            ) : (
              <div className="flex mt-2 gap-2">
                {selectedDay &&
                  grouped[selectedDay].map((s) => {
                    const isSelected = selectedTime === s.raw;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedTime(s.raw)}
                        className={`px-8 py-2 rounded-xl transition-all duration-200 cursor-pointer select-none
                          ${
                            isSelected
                              ? "bg-gradient-to-b from-[#4a1fa8] to-[#2a0d6e] border border-[#7c3aed] shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                              : "bg-[#352848] border border-[#4e3868] hover:bg-[#3d3055]"
                          }
                        `}
                      >
                        <span className={`text-sm font-medium text-white`}>
                          {s.time}
                        </span>
                      </button>
                    );
                  })}
              </div>
            )}

            {/* Total price and submit */}
            <div className="mt-6 flex justify-between">
              {isLoading ? (
                <>
                  <Skeleton className="w-48 h-8 rounded-lg" />
                  <Skeleton className="w-24 h-10 rounded-lg" />
                </>
              ) : (
                <>
                  <p>
                    <span className="font-light">Total - Rp.</span>{" "}
                    <span className="text-2xl">
                      {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </p>
                  <Button color="secondary" onClick={handleSubmit}>
                    Book
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right side - Seat Selection */}
          <div>
            <div className="flex flex-col items-center gap-2">
              {selectedSchedule ? (
                <>
                  <div className="w-[80%] h-6 overflow-hidden">
                    <div className="w-full h-12 bg-linear-to-b from-indigo-400/40 to-transparent rounded-[50%]" />
                  </div>
                  <p className="text-gray-400 text-sm mt-2 mb-6 tracking-widest">
                    SCREEN
                  </p>
                  {selectedSchedule &&
                    selectedSchedule.seats.map((row, rowIndex) => {
                      const rowLabel = getRowLabel(rowIndex);

                      return (
                        <div key={rowIndex} className="flex items-center gap-2">
                          {/* Left row label */}
                          <span className="w-6 text-gray-400">{rowLabel}</span>

                          {/* Seats */}
                          <div className="flex gap-2">
                            {row.map((seat, colIndex) => {
                              const seatNumber = colIndex + 1;
                              const key = `${rowLabel}-${seatNumber}`;

                              const isSelected = selectedSeats.includes(key);
                              const isBooked = seat === 0;
                              const isReserved = seat === 2;

                              return (
                                <button
                                  key={key}
                                  disabled={isBooked || isReserved}
                                  onClick={() =>
                                    toggleSeat(rowLabel, seatNumber)
                                  }
                                  className={`w-8 h-8 rounded-md text-xs flex items-center justify-center
                                  ${
                                    isBooked
                                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                      : isReserved
                                        ? "bg-lime-400 text-black cursor-not-allowed"
                                        : isSelected
                                          ? "bg-indigo-500 text-white"
                                          : "bg-[#1f2a3a] text-gray-300 hover:bg-indigo-400"
                                  }
                                `}
                                >
                                  {seatNumber}
                                </button>
                              );
                            })}
                          </div>

                          {/* Right row label */}
                          <span className="w-6 text-gray-400">{rowLabel}</span>
                        </div>
                      );
                    })}
                  <div className="w-[60%] flex flex-col items-center mt-8">
                    <Divider />
                    <div className="flex gap-6 mt-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                        Selected
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#1f2a3a] rounded"></div>
                        Available
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-700 rounded"></div>
                        Booked
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-lime-400 rounded"></div>
                        Reserved
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Image src={SeatImage} width={360} alt="Seat image" />
                  <p className="text-gray-400 text-sm">
                    Select a schedule to see available seats.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MovieDetail;
