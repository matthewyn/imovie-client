import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  NumberInput,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { generateApiOrigin } from "../utils/apiOrigin";
import axios from "axios";
import toast from "react-hot-toast";

export const kapasitasCategory = [
  {
    seats: Array(8)
      .fill(null)
      .map(() => Array(14).fill(1)),
    label: "112",
  },
  {
    seats: Array(9)
      .fill(null)
      .map(() => Array(14).fill(1)),
    label: "126",
  },
];

const urlFetch = generateApiOrigin("/api/studios");

function Studio() {
  const [nama, setNama] = useState("");
  const [kategoriKapasitas, setKategoriKapasitas] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const selectedKapasitas = kapasitasCategory.find(
        (k) => JSON.stringify(k.seats) === kategoriKapasitas,
      );

      const response = await axios.post(urlFetch, {
        nama,
        seats: selectedKapasitas.seats,
        kapasitas: selectedKapasitas.label,
      });

      if (response.status === 201) {
        toast.success("Studio berhasil dibuat!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    }
  };

  return (
    <div className="p-6">
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Account</BreadcrumbItem>
        <BreadcrumbItem>Studio</BreadcrumbItem>
      </Breadcrumbs>
      <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
        <div>
          <Input
            isRequired
            className="max-w-xs"
            label="Nama"
            type="text"
            placeholder="Masukkan nama dari studio"
            value={nama}
            labelPlacement="outside-top"
            onChange={(e) => setNama(e.target.value)}
          />
        </div>
        <div>
          <Select
            isRequired
            className="max-w-xs"
            label="Kategori Kapasitas"
            placeholder="Pilih kategori kapasitas"
            labelPlacement="outside-top"
            selectedKeys={kategoriKapasitas ? [kategoriKapasitas] : []}
            onSelectionChange={(e) => setKategoriKapasitas(Array.from(e)[0])}
          >
            {kapasitasCategory.map((kapasitas) => (
              <SelectItem key={JSON.stringify(kapasitas.seats)}>
                {kapasitas.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <Button color="primary" type="submit">
          Kirim
        </Button>
      </form>
    </div>
  );
}

export default Studio;
