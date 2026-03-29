import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { generateApiOrigin } from "./utils/apiOrigin";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Skeleton,
  Button,
  Divider,
} from "@heroui/react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { HiTicket } from "react-icons/hi2";
import FirstFeature from "./assets/feature_1.png";
import SecondFeature from "./assets/feature_2.png";
import Logo from "./assets/logo.png";

function StarRating({ count }) {
  return (
    <div className="flex flex-row-reverse gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= count ? "text-amber-400" : "text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const urlFetch = generateApiOrigin("/api/movies");

function Home() {
  const [active, setActive] = useState(0);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const slide = nowPlayingMovies[active];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get(urlFetch, {
          params: {
            limit: 5,
          },
        });
        setNowPlayingMovies(data.nowPlaying);
        setUpcomingMovies(data.upcoming);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <>
      <div className="relative w-full min-h-screen bg-[#080b14] overflow-hidden flex flex-col items-center justify-center px-4 py-12">
        {/* Ambient glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-purple-700/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-75 h-75 bg-blue-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-10 left-10 w-75 h-75 bg-pink-600/10 rounded-full blur-[80px]" />
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Headline */}
        <div className="relative z-10 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            With{" "}
            <span className="bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              iMovie
            </span>
            , every moment is a fresh story!
          </h1>
          <p className="mt-3 text-gray-400 text-base md:text-lg">
            The latest movies and series, ready to be discovered — join iMovie
            today!
          </p>
        </div>

        {/* Carousel */}
        <div className="relative z-10 w-full max-w-5xl flex items-center justify-center gap-4">
          {/* Side cards */}
          {isLoading
            ? [-1, 1].map((offset) => (
                <div
                  key={`side-skeleton-${offset}`}
                  className="hidden md:block w-40 h-56 rounded-2xl overflow-hidden shrink-0 scale-95"
                >
                  <Skeleton className="w-full h-full rounded-2xl" />
                </div>
              ))
            : nowPlayingMovies.length > 2
              ? [-1, 1].map((offset) => {
                  const idx =
                    (active + offset + nowPlayingMovies.length) %
                    nowPlayingMovies.length;
                  const sideSlide = nowPlayingMovies[idx];
                  return (
                    <div
                      key={`side-${offset}`}
                      onClick={() => setActive(idx)}
                      className="hidden md:block w-40 h-56 rounded-2xl overflow-hidden shrink-0 cursor-pointer opacity-40 hover:opacity-60 transition-opacity duration-300 scale-95 bg-gray-800"
                    >
                      <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-end p-3">
                        <span className="text-white text-sm font-bold truncate">
                          {sideSlide.judul}
                        </span>
                      </div>
                    </div>
                  );
                })
              : null}

          {/* Main card */}
          <div className="relative flex-1 max-w-2xl rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/10 bg-gray-900">
            {isLoading ? (
              <>
                <Skeleton className="w-full aspect-video rounded-t-3xl" />
                <div className="p-5 flex flex-col gap-3">
                  <Skeleton className="w-3/4 h-10 rounded-lg" />
                  <Skeleton className="w-1/2 h-6 rounded-lg" />
                  <div className="flex gap-3 mt-1">
                    <Skeleton className="flex-1 h-10 rounded-xl" />
                    <Skeleton className="flex-1 h-10 rounded-xl" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Placeholder image area */}
                <div className="relative w-full aspect-video bg-linear-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-transparent to-transparent" />
                  {/* Movie image */}
                  {slide ? (
                    <ReactPlayer
                      src={slide.videoUrl}
                      controls={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <svg
                      className="w-20 h-20 text-gray-600 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                      />
                    </svg>
                  )}

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-violet-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    {slide ? slide.genre : "Loading..."}
                  </div>
                </div>

                {/* Info overlay */}
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-white text-3xl font-black">
                        {slide ? slide.judul : "Loading..."}
                      </h2>
                      <p className="text-sm mt-1">
                        <span className="text-gray-400">Duration: </span>
                        <span className="text-emerald-400 font-bold">
                          {slide
                            ? `${Math.floor(slide.durasi / 60)} hour ${slide.durasi % 60} minute`
                            : "Loading..."}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-1">
                    <Button
                      className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-bold px-5 py-2.5 rounded-xl text-sm flex-1 justify-center"
                      as={Link}
                      to={slide ? `/movie/${slide.id}` : "#"}
                    >
                      <HiTicket size={20} />
                      Buy Tickets
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="relative z-10 flex gap-2 mt-8">
          {(isLoading ? Array(5).fill(0) : nowPlayingMovies).map((_, i) => (
            <button
              key={i}
              onClick={() => !isLoading && setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active && !isLoading
                  ? "w-6 h-3 bg-violet-500"
                  : "w-3 h-3 bg-gray-600 hover:bg-gray-400"
              }`}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>
      <section className="mt-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-4xl">Now Playing In Cinemas</h2>
          <div className="grid grid-cols-4 gap-4 mt-8">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={`skeleton-now-${i}`} className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <Skeleton className="w-full aspect-video rounded-xl" />
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Skeleton className="w-3/4 h-6 rounded-lg mb-2" />
                      <Skeleton className="w-1/2 h-4 rounded-lg" />
                    </CardBody>
                  </Card>
                ))
            ) : nowPlayingMovies ? (
              nowPlayingMovies.map((movie) => (
                <Link to={`/movie/${movie.id}`} key={movie.id}>
                  <Card key={movie.id} className="py-4 h-full flex flex-col">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <div className="w-full aspect-2/3">
                        <Image
                          alt="Movie image"
                          className="object-cover rounded-xl"
                          src={movie.filePath}
                          width={270}
                          isZoomed
                        />
                      </div>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 flex flex-col grow">
                      <h4 className="font-bold text-xl">{movie.judul}</h4>
                      <p className="text-default-500">{movie.genre}</p>
                    </CardBody>
                  </Card>
                </Link>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </section>
      <section className="mt-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-4xl">Upcoming In Cinemas</h2>
          <div className="grid grid-cols-4 gap-4 mt-8">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card
                    key={`skeleton-upcoming-${i}`}
                    className="py-4 h-full flex flex-col"
                  >
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <Skeleton className="w-full aspect-video rounded-xl" />
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 flex flex-col grow">
                      <Skeleton className="w-3/4 h-6 rounded-lg mb-2" />
                      <Skeleton className="w-1/2 h-4 rounded-lg" />
                    </CardBody>
                  </Card>
                ))
            ) : upcomingMovies ? (
              upcomingMovies.map((movie) => (
                <Card key={movie.id} className="py-4 h-full flex flex-col">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <div className="w-full aspect-2/3">
                      <Image
                        alt="Movie image"
                        className="object-cover rounded-xl"
                        src={movie.filePath}
                        width={270}
                        isZoomed
                      />
                    </div>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2 flex flex-col grow">
                    <h4 className="font-bold text-xl">{movie.judul}</h4>
                    <p className="text-default-500">{movie.genre}</p>
                  </CardBody>
                </Card>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </section>
      <section className="mt-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-4xl">Our Features</h2>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Image src={FirstFeature} alt="First Feature" />
            <Image src={SecondFeature} alt="Second Feature" />
          </div>
          <p className="mt-12 font-bold text-2xl text-center">
            DISCOVER THE BEST MOVIES AND ENTERTAINMENT, STAY UPDATED WITH THE
            LATEST RELEASES, AND ENJOY EXCLUSIVE DEALS AND OFFERS!
          </p>
        </div>
      </section>
      <section className="mt-14">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardBody className="p-8">
              <div className="flex justify-between items-center">
                <Image src={Logo} alt="iMovie Logo" width={144} />
                <p className="text-gray-400 text-sm">
                  Best App For Movie Lovers
                </p>
              </div>
              <Divider className="my-6" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} iMovie. All rights reserved.
                </span>
                <div className="flex gap-2">
                  <Link
                    to="/terms"
                    className="text-gray-400 text-sm hover:underline"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy"
                    className="text-gray-400 text-sm hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </>
  );
}

export default Home;
