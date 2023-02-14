import { Button, Form } from "antd";
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";

// https://www.npmjs.com/package/react-webcam

// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3008/objectDetection";

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


const ObjectDetection = () => {
    const [res, setRes] = useState(null);

    const webcamRef = React.useRef(null);
    // imgSrc 스트림
    const [imgSrc, setImgSrc] = useState(null);

    const [isCamOn, setIsCamOn] = useState(false);
    const [captureBtnShow, setCaptureBtnShow] = useState("none");

    // 도형 그리기 캔버스
    const canvasRef = useRef(null);
    const contextRef = useRef(null); // 캔버스의 드로잉 컨텍스트를 참조
    // const [ctx, setCtx] = useState(); // 캔버스의 드로잉 컨텍스트

    let ctx;
    // 캡쳐 이미지 너비
    const w = 620;
    const h = 420;

    useEffect(()=> {
        // ref로 요소에 접근
        const canvas = canvasRef.current;
        canvas.width = w;
        canvas.height = h;

        ctx = canvas?.getContext("2d");
        const image = new Image();
        image.src = imgSrc;
        image.onload = () => {
            // strokeRect(x좌표, y좌표, 너비, 너비)
            ctx?.drawImage(image, 0, 0, w, h);
            

            // 식별된 사물의 갯수, 길이
            const len = res?.data.predictions[0].detection_boxes.length;

            for (let i = 0; i < len; ++i) {
                // 사각형을 펜으로 그리기
                ctx.beginPath();
                ctx.strokeStyle = "red"
                // 시작위치 좌표
                const startPos = {
                    x: res?.data.predictions[0].detection_boxes[i][1] * w,
                    y: res?.data.predictions[0].detection_boxes[i][0] * h,
                }
                const endPos = {
                    x: res?.data.predictions[0].detection_boxes[i][3] * w,
                    y: res?.data.predictions[0].detection_boxes[i][2] * h,
                }
                const textPos = {
                    x: (res?.data.predictions[0].detection_boxes[i][3] * w) - (res?.data.predictions[0].detection_boxes[i][1] * w),
                    y: (res?.data.predictions[0].detection_boxes[i][2] * h) - (res?.data.predictions[0].detection_boxes[i][0] * h)
                }
                
                ctx.font = "20px Arial";
                ctx.fillStyle = "red"
                ctx.fillText(res.data.predictions[0].detection_names[i], textPos.x, textPos.y)
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(endPos.x, startPos.y);
                ctx.lineTo(endPos.x, endPos.y);
                ctx.lineTo(startPos.x, endPos.y);
                ctx.lineTo(startPos.x, startPos.y)
                ctx.stroke(); // 테두리 체우기
            }
        }
        
    }, [imgSrc, res]);

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
                <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>사물감지 (캠)</div>
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
        <div style={{ width: "850px", height: "100%", 
        backgroundColor: "black", 
        display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div style={{ width: "400px", fontSize: "40px", color: "white" }}>
                <div style={{ width: "400px", height: "450px" }}>
                    {/* 사물인식 도형 그리기 */}
                    <canvas ref={canvasRef}></canvas>
                    <div style={{ fontSize: "20px", color: "white" }}>
                    {
                        res ?
                        res.data.predictions[0].detection_names.map((obj, index) => 
                            <div style={{ backgroundColor: "black" }}>
                              {`감지된 객체_${index+1}: ${obj} / ${res.data.predictions[0].detection_scores[index]}`}<br></br>
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

export default ObjectDetection;