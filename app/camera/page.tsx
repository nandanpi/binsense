'use client';
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useEffect } from 'react';
import { useIPStore } from '../store';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment',
  };
  
export default function Camera(){
  const webcamRef = useRef(null);

  const [photoLocation, setPhotoLocation] = useState(null);
  const [resArray, setResArray] = useState<string[]>([]);
  const ipNumber = useIPStore((state) => state.ip);
  const portNumber = useIPStore((state) => state.port);
  const role = useIPStore((state) => state.role);
  const cameraOpen = useIPStore((state) => state.cameraOpen);
  const setCameraOpen = useIPStore((state) => state.setCameraOpen);
  async function sendImage(imageBlob: Blob) {
    const formData = new FormData();
    formData.append("file", imageBlob, "image.jpg");

    const response = await fetch(`https://${ipNumber}:${portNumber}`, {
      method: "POST",
      body: formData,
    });

    // console.log(response);
    const data = await response.json();

    if (data.prediction) {
      const responseType = data.prediction;
      setResArray((prevArray) => {
        const newArray = [...prevArray, responseType];
        if (newArray.length > 10) {
          newArray.shift();
        }
        return newArray;
      });
    } else {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (webcamRef.current && cameraOpen) {
        //@ts-ignore
        const imageSrc = webcamRef.current.getScreenshot();
        setPhotoLocation(imageSrc);
        fetch(imageSrc)
          .then((res) => res.blob())
          .then(sendImage)
          .catch(console.error);
        // setPhotoLocation(imageSrc);
      }
    }, 1000 / parseInt(process.env.FPS ?? "3"));

    return () => {
      clearInterval(intervalId);
    };
  });

  if (role !== "camera") {
    return (
      <>
        <div className='text-5xl font-semibold justify-center w-full items-center'>Page Not found</div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5 justify-center items-center w-full ">
        {/* {cameraOpen && (
          <div className="flex flex-col gap-5 justify-center items-center w-full">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
        )} */}
        <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
        <div className="flex gap-5 justify-center items-center w-full">
          <Badge variant={"purple"}>{role.toUpperCase()}</Badge>
          <Badge variant={"pink"}>{`${ipNumber}:${portNumber}`}</Badge>
        </div>

        {/* <div className="flex gap-5 justify-center items-center w-full">
          {cameraOpen ? (
            <Button onClick={setCameraOpen} variant={"purple"}>
              Stop Camera
            </Button>
          ) : (
            <Button onClick={setCameraOpen} variant={"purpleo"}>
              Start Camera
            </Button>
          )}
        </div> */}

        {resArray.length > 0 && (
          <div className="flex flex-col gap-2 justify-center items-center w-full mt-5">
          <div className=" text-6xl font-black bg-gradient-to-b from-purple-500 to-white text-transparent bg-clip-text">
            Response
          </div>
          <div className="flex justify-center  ">
            <div className="bg-opacity-20 backdrop-filter w-[32rem] flex mx-auto justify-center backdrop-blur-md bg-white rounded-lg border-1 border-white/50">
              <div className="flex justify-center items-center h-[40vh] overflow-y-auto">
                <div className="flex flex-col gap-5 md:max-w-min mx-5">
                  {/* <div className="w-full flex gap-5"></div> */}
                  <ul className="justify-center flex flex-col gap-2">
                    {" "}
                    {resArray.map((item, index) => (
                      <li key={index}>
                        {" "}
                        <Badge>{item.toUpperCase()}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
    
  
}