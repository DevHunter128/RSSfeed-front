import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import urlJoin from "url-join";

import {
  PUBLIC_PINATA_API_KEY,
  PUBLIC_PINATA_SECRET_API_KEY,
  BASE_URL,
} from "../../config";

function Dashboard() {
  const [pageCount, setpageCount] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [flag, setflag] = useState(false);
  const [isLoading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [feedUrl, setFeedUrl] = useState(null);
  const [watermark, setwatermark] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleDeleteImage = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handlePrevPageClick = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPageClick = () => {
    if (currentPage < pageCount) setCurrentPage(currentPage + 1);
  };

  const handleUpload = async () => {
    if (watermark != "") {
      setloading(true);
      // const datas = await uploadFilesFIU(files);
      // try {
      //   await axios
      //     .post(`${BASE_URL}/api/upload`, datas)
      //     .then((response) => {
      //       console.log(response.data);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // } catch (err) {
      //   console.log(err);
      // }
      console.log("files:", files);
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        formData.append("files", files[i]);
      }
      console.log(formData);
      const userid = JSON.parse(localStorage.getItem("user"))._id;
      try {
        await axios
          .post(`${BASE_URL}/api/upload`, formData, {
            headers: { 
              userID: userid,
              watermarktext: watermark 
            },
          })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }

      setloading(false);
      setflag(!flag);
      setwatermark("");
      for (var i = 0; i < files.length; i++) {
        handleDeleteImage(0);
      }
    }
    else{
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
  };
  const Alert = ({ message, onClose }) => {
    return (
      <div className="fixed top-0 right-0 m-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button onClick={onClose} className="text-white hover:text-red-200">
            &times;
          </button>
        </div>
      </div>
    );
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleClick = (url) => {
    setSelectedImage(url);
    setShowModal(true);
  };

  const getIpfsHash = async (formData) => {
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data`,
            pinata_api_key: PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: PUBLIC_PINATA_SECRET_API_KEY,
          },
        }
      );
      return res.data.IpfsHash;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFilesFIU = async (files) => {
    try {
      const userid = JSON.parse(localStorage.getItem("user"))._id;
      console.log("files: ", files);
      let hashes = [];
      for await (const _file of files) {
        const formData = new FormData();
        formData.append("file", _file);
        const hash = await getIpfsHash(formData);
        hashes.push([_file.name, hash, userid]);
      }
      console.log("hashes: ", hashes);
      return hashes;
    } catch (err) {
      console.log(err);
    }
  };

  const feedHandler = async () => {
    const userid = JSON.parse(localStorage.getItem("user"))._id;
    let url = `${BASE_URL}/api/rss/${userid}`;
    setFeedUrl(url);
  };

  const fetchImageData = async () => {
    try {
      axios.get(`${BASE_URL}/api/photos`).then(async (response) => {
        console.log("response: ", response);
        setpageCount(parseInt(response.data.length / 18) + 1);
        console.log(currentPage);
        if (currentPage * 18 > response.data.length) {
          await setImageUrl(
            response.data.slice((currentPage - 1) * 18, response.data.length)
          );
        } else {
          await setImageUrl(
            response.data.slice((currentPage - 1) * 18, currentPage * 18)
          );
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchImageData();
  }, [currentPage, flag]);

  return (
    <>
      <div
        className="bg-cover bg-center flex-grow"
        style={{ backgroundImage: `url('lake.jpg')` }}
      >
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-center md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                name="search"
                id="search"
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                placeholder="Search"
              />
              <button className="absolute top-0 right-0 mt-3 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M8 14a6 6 0 110-12 6 6 0 010 12zm0 0v4m0 4V14"
                  />
                </svg>
              </button>
            </div>

            <div className="relative flex-shrink-0">
              <input
                type="text"
                name="rss-feed"
                id="rss-feed"
                value={feedUrl}
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500 placeholder-gray-400 pointer-events-none"
                placeholder="RSS Feed"
                readOnly
              />
              <button
                className="absolute top-0 right-10 bg-transparent text-gray-400 mr-6 font-bold py-2 rounded-l-none rounded-r-lg focus:outline-none"
                onClick={() => {
                  const rssFeedInput = document.getElementById("rss-feed");
                  rssFeedInput.select();
                  document.execCommand("copy");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5h7a2 2 0 012 2v10a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2zm0 0V3a2 2 0 012-2h3m-5 5l5-5m0 0L8 10m5-5h5a2 2 0 012 2v10a2 2 0 01-2 2h-5m5-12v5a2 2 0 01-2 2H9a2 2 0 01-2-2V3m5 17l-5-5m0 0l5-5m-5 5h5"
                  />
                </svg>
              </button>
              <button
                className="absolute top-0 right-0 bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg"
                onClick={feedHandler}
              >
                RSS
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-8 pb-16 px-4">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/4 px-2 py-8">
            <div className="pb-8 mb-8 mt-16">
              <div className="flex flex-col items-center justify-center space-y-4 md:space-x-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="inline-flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                      <svg
                        className="w-8 h-8 mb-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Choose file</span> or
                        drag and drop here
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept=".jpg, .png, .jpeg, .gif, .svg, .bmp"
                      multiple
                      onChange={handleFileChange}
                    />
                    <button
                      className={`py-2 px-4 rounded-md ${
                        isLoading ? "bg-gray-500" : "bg-blue-500"
                      } text-white`}
                      // className={`bg-green-500 hover:bg-green-700 ${isLoading ? 'bg-gray-500' : 'bg-blue-500'}  text-white font-bold py-2 px-4 rounded-full`}
                      onClick={handleUpload}
                      disabled={isLoading}
                    >
                      Upload
                    </button>
                  </label>
                </div>
                <div className="flex items-center justify-center w-full">
                  <input
                    type="text"
                    name="watermark"
                    id="watermark"
                    value={watermark}
                    onChange={(e) => setwatermark(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                    placeholder="WatermarkText"
                  />
                </div>
                {showAlert && <Alert message="Confirm your WatermarkText" onClose={handleCloseAlert} />}
              </div>
            </div>

            <div className="flex flex-wrap mt-8 justify-center">
              {files.map((file, index) => (
                <div key={index} className="relative w-20 h-20 p-1">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded Image ${index}`}
                    className="rounded-lg w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 p-1 bg-white-800 text-gray rounded-full hover:bg-red-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          

          <div className="hidden lg:block border-l border-gray-300 h-full my-8"></div>

          <div className="w-full lg:w-3/4 px-2 py-8">
            <div className="container mx-auto mt-16 p-4">
              <div className="flex flex-row justify-between items-center mb-4 border-b border-gray-500 pb-4">
                <h2 className="text-primary text-2xl font-bold">My Photos</h2>
                <div className="text-primary">
                  <label htmlFor="pageInput" className="mr-4">
                    Page
                  </label>
                  <input
                    id="pageInput"
                    type="number"
                    min={1}
                    max={pageCount}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                    className="w-20 h-8 rounded-md border border-gray-300 px-3 py-1 mr-4 text-sm"
                  />
                  of {pageCount}
                </div>
              </div>

              <div className="flex flex-wrap mt-8 justify-center gap-2 m-4">
                {imageUrl.map(({ filename, userID, _id }) => (
                  <div key={_id} className="relative">
                    <img
                      className="rounded-lg w-40 h-40 object-cover cursor-pointer"
                      src={`${BASE_URL}/public/image/${userID}/${filename}`}
                      alt={filename}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100 bg-black bg-opacity-60">
                      <h2 className="text-white text-xl font-bold mb-2">
                        {filename}
                      </h2>
                      <button
                        href="#"
                        className="text-white hover:text-primary text-sm"
                        onClick={() =>
                          handleClick(
                            `${BASE_URL}/public/image/${userID}/${filename}`
                          )
                        }
                      >
                        View more
                      </button>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm mt-2 px-2">
                      <span>2023/06/06</span>
                      <span>23,472 views</span>
                    </div>
                  </div>
                ))}
                {showModal && (
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 p-6">
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-black opacity-40"
                      onClick={() => setShowModal(false)}
                    ></div>
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg transform animate__animated animate__zoomIn m-2">
                      <img
                        className="w-full object-contain"
                        src={selectedImage}
                        alt=""
                        style={{ filter: "brightness(100%)" }}
                        onClick={() => {
                          setShowModal(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-row justify-center items-center mb-16">
                <button
                  onClick={handlePrevPageClick}
                  className={`bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-l-lg  ml-1 mt-4 md:mt-0 ${
                    currentPage === 1 ? "opacity-50 cursor-default" : ""
                  }`}
                  disabled={currentPage === 1}
                >
                  Pre
                </button>
                <div className="flex justify-center items-center h-10 space-x-2 mt-4 md:mt-0">
                  {{ pageCount } > 5
                    ? [1, 2, 3, 4, 5]
                    : Array.from({ length: pageCount }, (_, i) => i + 1).map(
                        (pageNumber) => (
                          <a
                            key={`page-${pageNumber}`}
                            href={`#${pageNumber}`}
                            className={`${
                              pageNumber === currentPage
                                ? "bg-primary text-white"
                                : "bg-white text-gray-600 hover:text-primary"
                            } font-semibold py-2 px-4 rounded-md transition-colors duration-300`}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </a>
                        )
                      )}
                </div>
                <button
                  onClick={handleNextPageClick}
                  className="bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-r-lg ml-1 mt-4 md:mt-0"
                >
                  Nex
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
