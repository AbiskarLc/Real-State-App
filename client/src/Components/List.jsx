import axios from "axios";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaParking } from "react-icons/fa";
import { FaBath, FaBed, FaChair, FaLocationDot } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const List = () => {

    const {listId} = useParams();
    const [data,setData] = useState({
        imageUrls:[]
    });
  
    console.log(data);
    useEffect(()=>{

        getListData();
    },[])
    const getListData = async() =>{

        try {
            
            const response = await axios.get(`http://localhost:8000/api/list/getlist/${listId}`,
        {
            headers:{
                "Content-Type":"application/json"
            },
            withCredentials:true
        });

        if(response.data){

            setData(response.data);
        }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className="min-h-screen pb-2 mx-2 text-black dark:text-gray-300">
 

      <img
        src={
          data.imageUrls[0]
        }
        alt="Property image"

        className="mt-2 rounded-md h-96 w-full bg-cover bg-center"
        srcSet=""
      />
      <div className="mt-4 sm:max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Details About The Property- <span>${data.regularPrice}</span></h1>
        <div className="flex flex-col gap-2 mt-3">
        <div className=" flex text-xs items-center gap-1  text-green-700">
        <FaLocationDot />
            <p className="">{data.address}</p>
        </div>
        <div className="flex gap-6 mt-2 ">
           <button type="button" className=" bg-red-700 px-4 py-1 border-2 border-transparent hover:bg-transparent  hover:text-blue-500 hover:border-teal-400 text-sm rounded-md capitalize">{data.type}</button>
           <button type="button" className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%  text-sm py-1 px-4 rounded-md hover:outline hover:bg-transparent">${data.discountedPrice} <span>Discount</span> </button>
        </div>
        <p className="text-sm"><span className=" font-semibold mr-1">Description:</span>{data.description}</p>
        <div className="flex  gap-4 sm:gap-8 text-sm text-green-600 cursor-pointer">
            <div className="flex items-center gap-2 ">
                <FaBed/>
                <p>{data.bedrooms}</p>
            </div>
            <div className="flex items-center gap-2 ">
                <FaBath/>
                <p>{data.bathrooms}</p>
            </div>
            <div className="flex items-center gap-2 ">
                <FaParking/>
                <p>{data.parking?"Parking Available":"No Parking Space"}</p>
            </div>
            <div className="flex items-center gap-2 ">
                <FaChair/>
                <p>{data.parking?"Furnished":"Not Furnished"}</p>
            </div>
        </div>
        <Button gradientDuoTone={"purpleToBlue"} className="mt-8" outline>Contact LandLord</Button>
        </div>
       
      </div>
    </div>
  );
};

export default List;
