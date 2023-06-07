import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PUBLIC_PINATA_API_KEY,
  PUBLIC_PINATA_SECRET_API_KEY,
  BASE_URL
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
    setCurrentPage(currentPage + 1);
  };

  const handleUpload = async () => {
    setloading(true);
    const datas = await uploadFilesFIU(files);
    console.log("receive datas", datas);
    try {
      await axios
        .post(`${BASE_URL}/upload`, datas)
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
    setloading(false);
    setflag(!flag);
    for(var i=0;i<files.length;i++){handleDeleteImage(0)}
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
      console.log('files: ', files)
      let hashes = [];
      for await (const _file of files) {
        const formData = new FormData();
        formData.append("file", _file);
        const hash = await getIpfsHash(formData);
        hashes.push([_file.name, hash, userid])
      }
      // const hashes = await Promise.all(
      //   files.map(async (_file) => {
      //     const formData = new FormData();
      //     formData.append("file", _file);
      //     const hash = await getIpfsHash(formData);
      //     return [_file.name, hash, userid];
      //   })
      // );
      console.log('hashes: ', hashes)
      return hashes;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchImageData = async () => {
    try {
      axios.get(`${BASE_URL}/photos`).then(async (response) => {
        console.log('response: ', response)
        setpageCount(parseInt(response.data.length / 18)+1);
        console.log(currentPage);
        if ((currentPage) * 18 > response.data.length) {
          await setImageUrl(
            response.data.slice((currentPage-1) * 18, response.data.length)
          );
        } else {
          await setImageUrl(
            response.data.slice((currentPage-1) * 18, currentPage * 18)
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
        <div className="container mx-auto px-4 py-32 flex justify-center items-center">
          <div className="w-full max-w-sm">
            <div className="flex border border-gray-300 rounded-full overflow-hidden">
              <input
                className="appearance-none bg-gray-100 border-none w-full text-gray-700 py-2 px-3 leading-tight focus:outline-none"
                type="text"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4">
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
                    d="M21 21l-4.35-4.35"
                  />
                  <circle cx="10" cy="10" r="8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-8 pb-16 px-4">
        
        {/* <button onClick={fetchImageData}>fewfefeefa</button> */}

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/4 px-2 py-8">
            <div className="container mx-auto mt-16 p-4">
              <div className="flex flex-row justify-between items-center mb-4">
                <h2 className="text-primary text-2xl font-bold">My Photos</h2>
                <form className="text-primary">
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
                </form>
              </div>

              <div className="flex flex-wrap mt-8 justify-center">
                {imageUrl.map(({ filename, filepath, _id }) => (
                  <div
                    key={_id}
                    className="relative w-40 h-40 aspect-w-1 aspect-h-1 py-6 m-2"
                  >
                    <img
                      className="rounded-lg w-40 h-40 object-cover cursor-pointer"
                      src={`https://brown-planned-manatee-865.mypinata.cloud/ipfs/${filepath}`}
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
                            `https://brown-planned-manatee-865.mypinata.cloud/ipfs/${filepath}`
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
                      className="absolute top-0 left-0 w-full h-full bg-black opacity-20"
                      onClick={() => setShowModal(false)}
                    ></div>
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg transform animate__animated animate__zoomIn">
                      <img
                        className="w-full object-contain"
                        src={selectedImage}
                        alt=""
                        style={{ filter: "brightness(100%)" }}
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
                  {{pageCount}>5?[1,2,3,4,5]:Array.from({length:pageCount}, (_, i) => i + 1).map((pageNumber) => (
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
                  ))}
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

          <div className="hidden lg:block border-l border-gray-300 h-full my-8"></div>

          <div className="w-full lg:w-1/4 px-2 py-8">
            <div className="pb-8 mb-8">
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
        </div>
      </div>
    </>
  );
}

export default Dashboard;
