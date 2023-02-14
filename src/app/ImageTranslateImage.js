import { Button, Form } from "antd";
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";

// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3009/imageTranslateImage";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };


// base64 이미지 > File 객체로 변환하는 함수
const base64toFile = (base_data, filename) => {
    var arr = base_data.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
}


const ImageTranslateImage = () => {
    const [res, setRes] = useState(null);

    const webcamRef = React.useRef(null);
    // imgSrc 스트림
    const [imgSrc, setImgSrc] = useState(null);

    const [isCamOn, setIsCamOn] = useState(false);
    const [captureBtnShow, setCaptureBtnShow] = useState("none");


    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();
          setImgSrc(imageSrc);
          
          const file = base64toFile(imageSrc, 'image_file.png');
  
          const formData = new FormData();
          formData.append("image", file);
        //   formData.append("test", "LDK");
  
          axios.post(SUBMIT_URL, formData)
          .then((res) => {
              setRes(res);
            //   console.log(res)
          })
          .catch((error) => {
              console.log(error)
          })
        },
        [webcamRef]
      );
  
      const camOn = () => {
          setIsCamOn(!isCamOn);
          if(!isCamOn) {
              setCaptureBtnShow("");
          } else {
              setCaptureBtnShow("none");
          }
      } 


    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "850px", height: "100%", backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>이미지 번역 Image(ko) → Image(en)</div>
            <div style={{ width: "400px", height: "450px" }}>
                {
                    isCamOn ?
                    <Webcam
                        audio={false}
                        width={400}
                        height={420}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        />
                    : <div style={{ width: "400px", height: "420px" }}></div>
                }
            </div>
            <div style={{ display: "flex", width: "400px", justifyContent: "space-evenly" }}>
                <Button onClick={camOn} style={{ width: "100px", height: "100px" }}>웹캠</Button>
                <Button type='primary' onClick={capture} style={{ display: captureBtnShow, width: "100px", height: "100px" }}>캡처</Button>
            </div>
        </div>
        <div style={{ width: "850px", height: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div style={{ width: "400px", fontSize: "20px", color: "white" }}>
                <div>캡쳐 이미지:</div>
                <div style={{ width: "400px", height: "320px", marginBottom: "100px", border: "1px solid white" }}>
                    {
                        imgSrc && (
                            <img  style={{ width: "400px", height: "320px" }} src={imgSrc}></img>
                        )
                    }
                </div>
                <div>번역된 이미지:</div>
                <div style={{ width: "400px", height: "320px", border: "1px solid white" }}>
                    {
                        res && 
                            <img  style={{ width: "400px", height: "320px" }} src={"data:image/png;base64," + res.data.data.renderedImage}></img>
                    }
                </div>
            </div>
        </div>

  </div>
    );
}


export default ImageTranslateImage;