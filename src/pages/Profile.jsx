import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Skeleton,
  Textarea,
} from "@heroui/react";
import { useAuth } from "../contexts/AuthContext";
import { HiMiniEnvelope, HiMiniUser, HiOutlinePencil } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";
import { generateApiOrigin } from "../utils/apiOrigin";
import axios from "axios";
import { getAuthHeader, saveToken } from "../utils/token";
import {
  COUNTRIES,
  PhoneInput,
  formatPhoneNumber,
  getCountryFlag,
} from "../components/PhoneInput";
import toast from "react-hot-toast";

const urlFetchPhoto = generateApiOrigin("/api/account/upload-photo");
const urlFetchPersonalInfo = generateApiOrigin("/api/account/update-profile");
const urlFetchAddress = generateApiOrigin("/api/account/update-address");

function Profile() {
  const { user, loading, fetchUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressCountry, setAddressCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setPhone(user.phone);
      setAddressCountry(user.country);
      setState(user.state);
      setCity(user.city);
      setPostalCode(user.postalCode);

      // Try to detect country from phone if it's available
      if (user.phone && user.country) {
        const country = COUNTRIES.find((c) => c.name === user.country);
        if (country) {
          setSelectedCountry(country);
        }
      }
    }
  }, [user]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    if (file) {
      try {
        setIsLoading(true);
        const result = await axios.post(urlFetchPhoto, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeader(),
          },
        });
        if (result.status === 200) {
          saveToken(result.data.token);
          toast.success("Profile picture updated successfully!");
          await fetchUser();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error uploading photo:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.put(
        urlFetchPersonalInfo,
        {
          name,
          bio,
          phone,
          country: selectedCountry.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        },
      );
      if (response.status === 200) {
        saveToken(response.data.token);
        toast.success("Profile updated successfully!");
        await fetchUser();
        setIsEditingPersonalInfo(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        console.error("Error updating profile:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.put(
        urlFetchAddress,
        {
          country: addressCountry,
          state,
          city,
          postalCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        },
      );
      if (response.status === 200) {
        saveToken(response.data.token);
        toast.success("Address updated successfully!");
        await fetchUser();
        setIsEditingAddress(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        console.error("Error updating address:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Account</BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-2xl font-bold my-4">My Profile</h1>
      <div className="flex flex-col gap-4">
        {loading ? (
          <>
            {/* Profile Card Skeleton */}
            <div className="bg-white rounded-xl border border-gray-400/30 p-6 flex gap-4 items-center">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-32 mb-2 rounded-lg" />
                <Skeleton className="h-4 w-48 mb-2 rounded-lg" />
                <Skeleton className="h-4 w-64 rounded-lg" />
              </div>
            </div>

            {/* Personal Information Skeleton */}
            <div className="bg-white rounded-xl border border-gray-400/30 p-6">
              <Skeleton className="h-6 w-48 mb-4 rounded-lg" />
              <div className="flex mt-4">
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="h-5 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-20 rounded-lg mt-2" />
                  <Skeleton className="h-5 w-40 rounded-lg" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-12 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg mt-2" />
                  <Skeleton className="h-5 w-28 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Address Skeleton */}
            <div className="bg-white rounded-xl border border-gray-400/30 p-6">
              <Skeleton className="h-6 w-32 mb-4 rounded-lg" />
              <div className="flex mt-4">
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-20 rounded-lg" />
                  <Skeleton className="h-5 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg mt-2" />
                  <Skeleton className="h-5 w-20 rounded-lg" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="h-5 w-20 rounded-lg" />
                  <Skeleton className="h-4 w-12 rounded-lg mt-2" />
                  <Skeleton className="h-5 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-400/30 p-6 flex gap-4 items-center">
              <Avatar
                name={user.username}
                className="w-16 h-16 text-large"
                src={user.profileUrl}
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">
                  {`${user.city && user.city + ", "} ${user.state && user.state + ", "} ${user.country}`.replace(
                    /,\s*$/,
                    "",
                  )}
                </p>
              </div>
              <Button
                color="secondary"
                startContent={<HiOutlinePencil />}
                variant="bordered"
                onPress={handleUploadClick}
                isLoading={isLoading}
              >
                Upload picture
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-400/30 p-6">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <Button
                  color="secondary"
                  startContent={<HiOutlinePencil />}
                  variant="bordered"
                  onClick={() => {
                    setIsEditingPersonalInfo(!isEditingPersonalInfo);
                    setName(user.name);
                    setBio(user.bio);
                    setPhone(user.phone);
                  }}
                  isLoading={isLoading}
                >
                  Edit
                </Button>
              </div>
              {isEditingPersonalInfo ? (
                <>
                  <div className="flex gap-3 mt-4">
                    <div className="flex-1 flex flex-col gap-3">
                      <div>
                        <Input
                          isRequired
                          label="Name"
                          type="text"
                          placeholder="Name"
                          startContent={
                            <HiMiniUser size={20} className="text-gray-400" />
                          }
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          minLength={2}
                        />
                      </div>
                      <div>
                        <Input
                          isDisabled
                          isRequired
                          defaultValue={user.email}
                          label="Email"
                          startContent={
                            <HiMiniEnvelope
                              size={20}
                              className="text-gray-400"
                            />
                          }
                          type="email"
                          variant="bordered"
                        />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <Textarea
                        label="Bio"
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                      <PhoneInput
                        countryIsDisabled={true}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        phone={phone}
                        setPhone={setPhone}
                      />
                    </div>
                  </div>
                  <Button
                    color="secondary"
                    type="submit"
                    isLoading={isLoading}
                    className="w-full mt-6"
                    onClick={handlePersonalInfoSubmit}
                  >
                    Submit Changes
                  </Button>
                </>
              ) : (
                <div className="flex gap-6 mt-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-gray-500">Name</h3>
                    <p>{user.name}</p>
                    <h3 className="text-gray-500">Email Address</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-gray-500">Bio</h3>
                    <p>{user.bio || "No bio available"}</p>
                    <h3 className="text-gray-500">Phone Number</h3>
                    <div className="flex gap-2 items-center">
                      {
                        <>
                          <span className="font-semibold">
                            {getCountryFlag(
                              COUNTRIES.find((c) => c.name === user.country)
                                ?.code || "US",
                            )}{" "}
                            {
                              COUNTRIES.find((c) => c.name === user.country)
                                ?.dialCode
                            }
                          </span>
                          <p>{formatPhoneNumber(user.phone, user.country)}</p>
                        </>
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl border border-gray-400/30 p-6">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Address</h2>
                <Button
                  color="secondary"
                  startContent={<HiOutlinePencil />}
                  variant="bordered"
                  onClick={() => {
                    setIsEditingAddress(!isEditingAddress);
                    setAddressCountry(user.country);
                    setState(user.state);
                    setCity(user.city);
                    setPostalCode(user.postalCode);
                  }}
                  isLoading={isLoading}
                >
                  Edit
                </Button>
              </div>
              {isEditingAddress ? (
                <>
                  <div className="flex gap-3 mt-4">
                    <div className="flex-1 flex flex-col gap-3">
                      <Input
                        label="Country"
                        isRequired
                        isDisabled
                        type="text"
                        placeholder="Country"
                        value={addressCountry}
                        onChange={(e) => setAddressCountry(e.target.value)}
                      />
                      <Input
                        label="Postal Code"
                        type="text"
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <Input
                        label="State"
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                      <Input
                        label="City"
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    color="secondary"
                    type="submit"
                    isLoading={isLoading}
                    className="w-full mt-6"
                    onClick={handleAddressSubmit}
                  >
                    Submit Changes
                  </Button>
                </>
              ) : (
                <div className="flex mt-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-gray-500">Country</h3>
                    <p>{user.country || "No country available"}</p>
                    <h3 className="text-gray-500">Postal Code</h3>
                    <p>{user.postalCode || "No postal code available"}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-gray-500">State</h3>
                    <p>{user.state || "No state available"}</p>
                    <h3 className="text-gray-500">City</h3>
                    <p>{user.city || "No city available"}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
