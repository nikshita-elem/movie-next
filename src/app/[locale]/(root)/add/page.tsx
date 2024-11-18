/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Movie } from "@/types/common";

export default function Page() {
//   const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Movie>({
    title: "",
    year: 2024,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Add");

  /**
   * Handles changes in text input fields.
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles changes in the year input field, ensuring only digits are entered.
   */
  const handleChangeYear = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({
        ...formData,
        [e.target.name]: value,
      });
    }
  };

  /**
   * Handles image file selection and uploads the image to the server.
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageError(null);
      };

      reader.readAsDataURL(file);

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const data = await response.json();
        setBase64Image(data.data); // Assuming 'data.data' contains the base64 string
      } catch (error) {
        console.error("Error uploading image:", error);
        setImageError("Failed to upload image. Please try again.");
      }
    }
  };

  /**
   * Clears the selected image from the form.
   */
  const clearImage = () => {
    setImagePreview(null);
    setBase64Image(null);
    setImageError(null);
  };

  /**
   * Handles form submission to create a new movie.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!base64Image) {
      setImageError("Image is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = {
        ...formData,
        image: base64Image,
        year: formData.year && parseInt(formData.year.toString(), 10), // Convert year to number
      };

      const res = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (!res.ok) {
        throw new Error("Failed to submit the form");
      }
      router.push("/");
    } catch (error) {
      console.log("Error submitting form:", error);
      // Optionally, set an error state here to inform the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containers pe-3 ps-3">
      <div className="max-w-6xl w-full p-4 sm:p-12 relative z-10">
        <h2 className="heading-two pb-24">{t("Create a new movie")}</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-20"
        >
          {/* Image Upload Section */}
          <div className="w-full max-w-md sm:w-1/2 flex flex-col justify-center items-center border-2 border-dashed border-white h-72 sm:h-96 rounded-lg bg relative">
            <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer relative">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Selected Movie"
                    className="object-cover h-full w-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 pb-1 pt-1 hover:bg-red-700 transition"
                    aria-label="Clear selected image"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <svg
                    className="h-8 w-8 text-white mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span className="text-white text-lg">
                    {t("Drop an image here")}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </>
              )}
            </label>
            {imageError && (
              <span className="text-red-500 text-sm mt-2">{imageError}</span>
            )}
          </div>

          {/* Form Inputs Section */}
          <div className="w-full sm:w-1/2 flex flex-col gap-6">
            {/* Title Input */}
            <div className="flex flex-col">
              <label htmlFor="title" className="sr-only">
                {t("Title")}
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder={t("Title")}
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field max-w-md"
              />
            </div>

            {/* Year Input */}
            <div className="flex flex-col">
              <label htmlFor="year" className="sr-only">
                {t("Publishing Year")}
              </label>
              <input
                id="year"
                name="year"
                placeholder={t("Publishing Year")}
                value={formData.year}
                onChange={handleChangeYear}
                required
                pattern="\d{4}"
                maxLength={4}
                className="input-field max-w-md sm:w-2/4"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 max-w-md w-full sm:w-3/4 pt-8">
              <Link
                href="/"
                className="sm:w-3/4 bg-transparent body-regular border border-white px-16 py-3 rounded-lg hover:bg-white hover:text-gray-800 transition text-center"
              >
                {t("Cancel")}
              </Link>
              <button
                type="submit"
                className="px-16 py-3 sm:w-3/4 custom-button pb-0"
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-white animate-spin items-center"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  t("Submit")
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
