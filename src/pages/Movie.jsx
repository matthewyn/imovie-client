import { useEffect, useState } from "react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  DatePicker,
  form,
  Input,
  TimeInput,
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/react";
import { Button } from "@heroui/react";
import axios from "axios";
import { generateApiOrigin } from "../utils/apiOrigin";
import toast from "react-hot-toast";

export const ageCategory = [
  { key: "g", label: "G" },
  { key: "pg", label: "PG" },
  { key: "pg-13", label: "PG-13" },
  { key: "r", label: "R" },
  { key: "nc-17", label: "NC-17" },
];

export const genre = [
  { key: "action", label: "Action" },
  { key: "adventure", label: "Adventure" },
  { key: "animation", label: "Animation" },
  { key: "comedy", label: "Comedy" },
  { key: "crime", label: "Crime" },
  { key: "documentary", label: "Documentary" },
  { key: "drama", label: "Drama" },
  { key: "family", label: "Family" },
  { key: "fantasy", label: "Fantasy" },
  { key: "history", label: "History" },
  { key: "horror", label: "Horror" },
  { key: "music", label: "Music" },
  { key: "mystery", label: "Mystery" },
  { key: "romance", label: "Romance" },
  { key: "science-fiction", label: "Science Fiction" },
  { key: "thriller", label: "Thriller" },
  { key: "war", label: "War" },
  { key: "western", label: "Western" },
];

export const runtimeCategory = [
  { key: "now-playing", label: "Now Playing" },
  { key: "upcoming", label: "Upcoming" },
];

const urlFetch = generateApiOrigin("/api/movies");

function Movie() {
  const [judul, setJudul] = useState("");
  const [file, setFile] = useState(null);
  const [kategoriUmur, setKategoriUmur] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [kategoriGenre, setKategoriGenre] = useState("");
  const [kategoriRuntime, setKategoriRuntime] = useState("");
  const [jam, setJam] = useState("");
  const [menit, setMenit] = useState("");
  const [video, setVideo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("file", file);
      formData.append("kategoriUmur", kategoriUmur);
      formData.append("sinopsis", sinopsis);
      formData.append("genre", kategoriGenre);
      formData.append("runtime", kategoriRuntime);
      formData.append("jam", jam);
      formData.append("menit", menit);
      formData.append("video", video);

      const response = await axios.post(urlFetch, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Movie successfully created!");
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
        const response = await axios.get(urlFetch);
        setStudios(response.data);
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
        <BreadcrumbItem>Movies</BreadcrumbItem>
      </Breadcrumbs>
      <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
        <div>
          <Input
            isRequired
            className="max-w-xs"
            label="Title"
            type="text"
            placeholder="Enter the movie title"
            value={judul}
            labelPlacement="outside-top"
            onChange={(e) => setJudul(e.target.value)}
          />
        </div>
        <div>
          <Input
            isRequired
            className="max-w-xs"
            label="Video URL"
            placeholder="Enter the movie video URL"
            labelPlacement="outside-top"
            type="text"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
          />
        </div>
        <div>
          <Input
            isRequired
            className="max-w-xs"
            label="Poster"
            placeholder="Enter the movie poster file"
            labelPlacement="outside-top"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div>
          <Select
            isRequired
            className="max-w-xs"
            label="Age Category"
            placeholder="Select age category"
            labelPlacement="outside-top"
            selectedKeys={kategoriUmur ? [kategoriUmur] : []}
            onSelectionChange={(e) => setKategoriUmur(Array.from(e)[0])}
          >
            {ageCategory.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div>
          <Textarea
            isRequired
            label="Synopsis"
            placeholder="Enter the movie synopsis"
            labelPlacement="outside-top"
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
          />
        </div>
        <div>
          <Select
            isRequired
            className="max-w-xs"
            label="Genre Category"
            placeholder="Select genre category"
            labelPlacement="outside-top"
            selectedKeys={kategoriGenre ? [kategoriGenre] : []}
            onSelectionChange={(e) => setKategoriGenre(Array.from(e)[0])}
          >
            {genre.map((genre) => (
              <SelectItem key={genre.key}>{genre.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div>
          <Select
            isRequired
            className="max-w-xs"
            label="Select Hours"
            placeholder="Select duration in hours"
            labelPlacement="outside-top"
            selectedKeys={jam ? [jam] : []}
            onSelectionChange={(e) => setJam(Array.from(e)[0])}
          >
            {[...Array(5).keys()].slice(1).map((num) => (
              <SelectItem key={num.toString()}>{num.toString()}</SelectItem>
            ))}
          </Select>
        </div>
        <div>
          <Select
            isRequired
            className="max-w-xs"
            label="Select Minutes"
            placeholder="Select duration in minutes"
            selectedKeys={menit ? [menit] : []}
            labelPlacement="outside-top"
            onSelectionChange={(e) => setMenit(Array.from(e)[0])}
          >
            {[...Array(60).keys()].map((num) => (
              <SelectItem key={num.toString()}>{num.toString()}</SelectItem>
            ))}
          </Select>
        </div>
        <div>
          <Select
            isRequired
            className="max-w-xs"
            label="Runtime Category"
            placeholder="Select runtime category"
            labelPlacement="outside-top"
            selectedKeys={kategoriRuntime ? [kategoriRuntime] : []}
            onSelectionChange={(e) => setKategoriRuntime(Array.from(e)[0])}
          >
            {runtimeCategory.map((runtime) => (
              <SelectItem key={runtime.key}>{runtime.label}</SelectItem>
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

export default Movie;
