import React, { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5';
import {
  BASE_URL,
} from "../../config";

const Profile = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    name: 'Tom Lasaster',
    address: '',
    email: 'm.poul@example.com',
    phone: '',
    password:'P@ssword',
    about:
      'To get social media testimonials like these, keep your customers engaged with your social media accounts by posting regularly yourself.',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  useEffect(()=>{
    try{
    const userid = JSON.parse(localStorage.getItem("user"))._id;
    axios.get(`${BASE_URL}/auth/profile`,{
      headers: {
        userid: userid,
      }
    }).then((response)=>{
      setUserDetails(response.data.user);
    })}catch(err){
      console.log("err");
    }
  },[]);

  
  const handleSave = () => {
    setIsEditing(false);
    // Add code here to save the updated user details to a database or API
    const tmp = {...userDetails}
    tmp.password = md5(userDetails.password);
    try{
      axios
      .post(`${BASE_URL}/auth/profile`, tmp)
      .then((response)=>{
        console.log(response.data);
      })
      .catch((err)=>{
        console.log(err);
      })
    }catch(err){
      console.log('err')
    }
    
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((userDetails) => ({
      ...userDetails,
      [name]: value,
    }));

  };

  const handleImageChange = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    fileReader.onloadend = () => {
      setUserDetails((userDetails) => ({
        ...userDetails,
        ['avatar']:fileReader.result
      }));
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-5 sm:px-6">
          <div className="mb-3 sm:mb-0">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              User Profile
            </h2>
          </div>
          <div>
            {isEditing ? (
              <>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-md pb-10">
          <div>
            <dl>
              <div className="bg-gray-50 px-4 py-5 flex items-center sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-4">
                <dt className="text-sm font-medium text-gray-500">Profile Picture</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2">
                 <div className="flex items-center">
                    <label htmlFor="profileImg" className="relative cursor-pointer">
                      <span className="sr-only">Change Image</span>
                      <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <img src={userDetails.avatar} alt="avatar" className="w-full h-full object-cover"/>
                      </span>
                      {isEditing ? (
                        <input type="file" accept=".jpg, .jpeg, .png, .gif" id="profileImg" className="sr-only" onChange={handleImageChange}/>
                      ) : null}
                    </label>
                  </div>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2 cursor-pointer">
                  {isEditing ? (
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      name="name"
                      value={userDetails.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    userDetails.name
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2 cursor-pointer">
                  {isEditing ? (
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      name="address"
                      value={userDetails.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                    />
                  ) : (
                    userDetails.address
                  )}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2 cursor-pointer">
                  {isEditing ? (
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      name="email"
                      value={userDetails.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                    />
                  ) : (
                    userDetails.email
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2 cursor-pointer">
                  {isEditing ? (
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    userDetails.phone
                  )}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2 cursor-pointer">
                  {isEditing ? (
                    <textarea
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="about"
                      value={userDetails.about}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                    ></textarea>
                  ) : (
                    userDetails.about
                  )}
                </dd>
              </div>
              {isEditing ? (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              
                <dt className="text-sm font-medium text-gray-500">Password</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2 cursor-pointer">
                  
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="password"
                      name="password"
                      value={userDetails.password}
                      onChange={handleChange}
                      placeholder="Enter your password number"
                    />
                </dd>
              </div>
              ) : (
                ""
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Profile;
