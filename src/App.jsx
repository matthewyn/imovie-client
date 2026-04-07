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
  Chip,
} from "@heroui/react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { HiTicket } from "react-icons/hi2";
import FirstFeature from "./assets/feature_1.png";
import SecondFeature from "./assets/feature_2.png";
import Logo from "./assets/logo.png";
import StarRating from "./components/StarRating";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const urlFetch = generateApiOrigin("/api/movies");

function Home() {
  const [active, setActive] = useState(0);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const slide = nowPlayingMovies[active];
  const [isLoading, setIsLoading] = useState(true);
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container) => {
    console.log(container);
  };

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
      <div
        className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-12"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #2a0a4a, #080b14 70%)",
        }}
      >
        {/* Ambient glow background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Glow layers (keep yours, they are GOOD) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-purple-700/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-75 h-75 bg-blue-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-10 left-10 w-75 h-75 bg-pink-600/10 rounded-full blur-[80px]" />

          {/* Particles canvas */}
          {init && (
            <Particles
              id="tsparticles"
              className="absolute inset-0"
              options={{
                fullScreen: false,
                background: { color: "transparent" },
                particles: {
                  number: { value: 60 },
                  size: { value: { min: 1, max: 2 } },
                  move: { enable: true, speed: 0.2 },
                  opacity: { value: { min: 0.2, max: 0.6 } },
                  color: { value: "#ffffff" },
                },
              }}
            />
          )}
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
                  <ReactPlayer
                    src={slide.videoUrl}
                    controls={true}
                    style={{ width: "100%", height: "100%" }}
                  />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-violet-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    {slide.genre}
                  </div>
                </div>

                {/* Info overlay */}
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-white text-3xl font-black">
                        {slide.judul}
                      </h2>
                      <p className="text-sm mt-1">
                        <span className="text-gray-400">Duration: </span>
                        <span className="text-emerald-400 font-bold">
                          {`${Math.floor(slide.durasi / 60)} hour ${slide.durasi % 60} minute`}
                        </span>
                      </p>
                      <StarRating
                        count={slide.averageRating}
                        onChange={() => {}}
                        size={6}
                        customClass="mt-2"
                      />
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
            {isLoading
              ? Array(4)
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
              : nowPlayingMovies.map((movie) => (
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
                        <Chip radius="sm" className="mt-2 text-violet-500">
                          {movie.kategoriUmur}
                        </Chip>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
          </div>
        </div>
      </section>
      <section className="mt-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-4xl">Upcoming In Cinemas</h2>
          <div className="grid grid-cols-4 gap-4 mt-8">
            {isLoading
              ? Array(4)
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
              : upcomingMovies.map((movie) => (
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
                ))}
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
