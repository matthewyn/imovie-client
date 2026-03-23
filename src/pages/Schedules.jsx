import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  DatePicker,
  Select,
  SelectItem,
  TimeInput,
} from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { generateApiOrigin } from "../utils/apiOrigin";
import toast from "react-hot-toast";

const urlFetchSchedules = generateApiOrigin("/api/schedules");
const urlFetchStudios = generateApiOrigin("/api/studios");
const urlFetchMovies = generateApiOrigin("/api/movies");

function Schedules() {
  const [tanggal, setTanggal] = useState(null);
  const [waktu, setWaktu] = useState(null);
  const [studios, setStudios] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [kategoriStudio, setKategoriStudio] = useState("");
  const [kategoriMovie, setKategoriMovie] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData();
      formData.append("kategoriStudio", kategoriStudio);
      formData.append("kategoriMovie", kategoriMovie);
      formData.append("tanggal", tanggal.toString());
      formData.append("waktu", waktu.toString());

      const response = await axios.post(urlFetchSchedules, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Schedule successfully created!");
      }
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
    const fetchStudios = async () => {
      try {
        const { data: studioData } = await axios.get(urlFetchStudios);
        const { data: movieData } = await axios.get(urlFetchMovies, {
          params: {
            limit: 5,
          },
        });
        setNowPlayingMovies(movieData.nowPlaying);
        setStudios(studioData);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      }
    };
    fetchStudios();
  }, []);

  return (
    <div className="p-6">
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Account</BreadcrumbItem>
        <BreadcrumbItem>Schedules</BreadcrumbItem>
      </Breadcrumbs>
      <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
        <div>
          <Select
            isRequired
            className="max-w-xs"
            label="Movie Title"
            placeholder="Select movie title"
            labelPlacement="outside-top"
            selectedKeys={kategoriMovie ? [kategoriMovie] : []}
            onSelectionChange={(e) => setKategoriMovie(Array.from(e)[0])}
          >
            {nowPlayingMovies.map((movie) => (
              <SelectItem key={movie.id}>{movie.judul}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex gap-4">
          <DatePicker
            isRequired
            className="max-w-71"
            label="Date"
            value={tanggal}
            labelPlacement="outside-top"
            onChange={setTanggal}
          />
          <TimeInput
            isRequired
            label="Time"
            value={waktu}
            labelPlacement="outside-top"
            onChange={setWaktu}
          />
        </div>
        <div>
          <Select
            isRequired
            className="max-w-xs"
            label="Studio Category"
            placeholder="Select studio category"
            labelPlacement="outside-top"
            selectedKeys={kategoriStudio ? [kategoriStudio] : []}
            onSelectionChange={(e) => setKategoriStudio(Array.from(e)[0])}
          >
            {studios.map((studio) => (
              <SelectItem key={studio.id}>{studio.nama}</SelectItem>
            ))}
          </Select>
        </div>
        <Button color="primary" type="submit" isLoading={isLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Schedules;
