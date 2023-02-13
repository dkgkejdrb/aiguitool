import { Button } from "antd";
import React, { useState } from "react";


const FaceCam = () => {
    // 웹캠 가져오기
    const getWebcam = (callback) => {
        try {
            const constraints = {
                'video': true,
                'audio': false
            }
        
        navigator.mediaDevices.getUserMedia(constraints)
            .then(callback);
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    const [playing, setPlaying] = useState(undefined);
    const videoRef = React.useRef(null);

    // 캠 허용
    React.useEffect(() => {
        getWebcam((stream => {
            setPlaying(true);
            videoRef.current.srcObject = stream;
        }));
    }, []);

    const startOrStop = () => {
        if(playing) {
            const s = videoRef.current.srcObject;
            s.getTracks().forEach((track) => {
                track.stop();
            });
        } else {
            getWebcam((stream => {
                setPlaying(true);
                videoRef.current.srcObject = stream;
            }));
        }
        setPlaying(!playing);
    }


    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "850px", height: "100%", backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>음성 인식 CSR</div>
                <Button style={{ marginTop: "100px", width: "100px", height: "40px" }} type='primary' 
                    onClick={() => startOrStop()}>
                        {playing ? 'Stop': 'Start'}
                    </Button>
                {/* <Button style={{ marginTop: "20px", width: "100px", height: "40px" }}  
                    // onClick={onSubmitAudioFile}
                >결과 확인</Button> */}
            </div>
        <div style={{ width: "850px", height: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div style={{ fontSize: "40px", color: "white" }}>
                {/* {
                    res ?
                      res.data.text
                    : 
                      <>...</>
                } */}
            </div>
        </div>

      </div>
    );
}

export default FaceCam;