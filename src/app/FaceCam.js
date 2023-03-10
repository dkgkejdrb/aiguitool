import { Button, Form } from "antd";
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";

// https://www.npmjs.com/package/react-webcam

// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3007/faceCam";

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


const FaceCam = () => {
    const [res, setRes] = useState("");

    const webcamRef = React.useRef(null);
    // imgSrc 스트림
    const [imgSrc, setImgSrc] = useState(null);

    const [isCamOn, setIsCamOn] = useState(false);
    const [captureBtnShow, setCaptureBtnShow] = useState("none");

    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // console.log(imageSrc);
        setImgSrc(imageSrc);
        
        const file = base64toFile(imageSrc, 'image_file.png');

        const formData = new FormData();
        formData.append("image", file);

        axios.post(SUBMIT_URL, formData)
        .then((res) => {
            setRes(res);
            console.log(res)
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
                <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>얼굴인식 (캠)</div>
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
            <div style={{ width: "400px", fontSize: "40px", color: "white" }}>
                <div style={{ width: "400px", height: "450px" }}>
                    {
                        imgSrc && (
                            <img  style={{ width: "400px", height: "320px" }} src={imgSrc}></img>
                        )
                    }
                    <div style={{ fontSize: "40px", color: "white" }}>
                    {
                        res ?
                        res.data.faces.map((face) => 
                            <div style={{ backgroundColor: "black" }}>
                              {`나이: ${face.age.value} / ${face.age.confidence}`}<br></br>
                              {`감정: ${face.emotion.value} / ${face.emotion.confidence}`}<br></br>
                              {`성별: ${face.gender.value} / ${face.gender.confidence}`}<br></br>
                              {`자세: ${face.pose.value} / ${face.pose.confidence}`}<br></br><br></br>
                            </div>
                        )
                        :
                        <div style={{ fontSize: "40px", color: "white" }}>
                            ...
                        </div>
                    }
                    </div>
                </div>
            </div>
        </div>

      </div>
    );
}

export default FaceCam;


    // // 웹캠 가져오기
    // const getWebcam = (callback) => {
    //     try {
    //         const constraints = {
    //             'video': true,
    //             'audio': false
    //         }
        
    //         navigator.mediaDevices.getUserMedia(constraints).then(callback);
    //     } 
        
    //     catch (err) {
    //         console.log(err);
    //         return undefined;
    //     }
    // }

    // const [playing, setPlaying] = useState(undefined);
    // const videoRef = React.useRef(null);

    // // 캠 허용
    // React.useEffect(() => {
    //     getWebcam((stream => {
    //         setPlaying(true);
    //         videoRef.current.srcObject = stream;
    //     }));
    // }, []);

    // const startOrStop = () => {
    //     if(playing) {
    //         const s = videoRef.current.srcObject;
    //         s.getTracks().forEach((track) => {
    //             // console.log(track)
    //             track.stop();
    //         });
    //     } else {
    //         getWebcam((stream => {
    //             setPlaying(true);
    //             videoRef.current.srcObject = stream;
    //         }));
    //     }
    //     setPlaying(!playing);
    // }

    // const webcamRef = React.useRef(null);
    // const [imgSrc, setImgSrc] = React.useState(null);

    // // 캠 캡처
    // const capture = React.useCallback(() => {
    //     const imageSrc = webcamRef.current.getScreenshot();
    //     setImgSrc(imageSrc);
    //     console.log(imageSrc);
    // }, [webcamRef, setImgSrc]);


    // return (
    //     <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
    //         <div style={{ width: "850px", height: "100%", backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
    //             <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>얼굴인식 (캠)</div>
    //             <video 
    //                 ref={videoRef}
    //                 autoPlay={playing}
    //                 style={{ width: "200px" }}>
    //             </video>
    //             <Button style={{ marginTop: "100px", width: "100px", height: "40px" }} type='primary' 
    //                 onClick={startOrStop}>
    //                     {playing ? <>Stop</>: <>Start</>}
    //                 </Button>
    //             <Button style={{ marginTop: "20px", width: "100px", height: "40px" }}  
    //                 onClick={capture}
    //             >캡처하기</Button>
    //         </div>
    //     <div style={{ width: "850px", height: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center"}}>
    //         <div style={{ width: "400px", fontSize: "40px", color: "white" }}>
    //             {
    //                 imgSrc && (
    //                 <img src={imgSrc}></img>
    //                 )
    //             }
    //         </div>
    //     </div>

    //   </div>
    // );