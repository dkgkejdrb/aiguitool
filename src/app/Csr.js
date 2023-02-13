// 프론트
import { InboxOutlined, AudioOutlined } from '@ant-design/icons';
import { Button, Form, Upload, Image, Input, Radio, InputNumber } from "antd";
import axios from 'axios';
import { useCallback, useState } from 'react';
const { TextArea } = Input;

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3004/CSR";

const Csr = () => {
  const [res, setRes] = useState("");
  const [msg, setMsg]= useState("녹음");
  const [backColor, setBackColor] = useState("#1677ff");

  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();

  const onRecAudio = () => {
    setMsg("녹음 중...");
    setBackColor("red");

    // 음원정보를 담은 노드를 생성하거나 음원을 실행 또는 디코딩 시킴
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // 자바스크립트를 통해 음원의 진행상태에 직접접근하여 사용가능
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    const makeSound = (stream) => {
      // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여줌
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    // 마이크 사용 권한 획득
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        setStream(stream);
        setMedia(mediaRecorder);
        makeSound(stream);

        analyser.onaudioprocess = function (e) {
          // 1분(59초) 지나면 자동으로 음성 저장 및 녹음 중지
          if (e.playbackTime > 59) {
            stream.getAudioTracks().forEach(function(track) {
              track.stop();
            });
            mediaRecorder.stop();
            // 메서드가 호출 된 노드 연결 해제
            analyser.disconnect();
            audioCtx.createMediaElementSource(stream).disconnect();

            mediaRecorder.ondataavailable = function (e) {
              setAudioUrl(e.data);
              setOnRec(true);
            };
        } else {
          setOnRec(false);
        }
      };
    });
  }

  // 사용자가 음성 녹음을 중지했을 때
  const offRecAudio = () => {
    setMsg("녹음")
    setBackColor("#1677ff");


    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
    };

    // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    // 미디어 캡처 중지
    media.stop();
    // 메서드가 호출 된 노드 연결 해제
    analyser.disconnect();
    source.disconnect();
  };

  const onSubmitAudioFile = useCallback(() => {
    setRes("");

    if (audioUrl) {
      console.log(URL.createObjectURL(audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
    }
    // File 생성자를 사용해 파일로 변환
    const sound =
      new File([audioUrl], "soundBlob", { 
        lastModified: new Date().getTime(), 
        type: "audio"
      });
      console.log(sound);

      // forData로 image 키에 묶어 전송
      const formData = new FormData();
      formData.append("image", sound);

      axios.post(SUBMIT_URL, formData, {
        headers: {
          "Content-Type": "multipart/formed-data"
        }
      })
      .then((res) => {
          console.log("success")
          setRes(res);
          console.log(res)
      })
      .catch((error) => {
          console.log(`에러: ${error}`)
      })
  }, [audioUrl]);


    return (
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "850px", height: "100%", backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>음성 인식 CSR</div>
          <AudioOutlined style={{ fontSize: "200px", color: "#1677ff" }} />
          <Button style={{ marginTop: "100px", backgroundColor: backColor, width: "100px", height: "40px" }} type='primary' onClick={onRec ? onRecAudio : offRecAudio}>{msg}</Button>
          <Button style={{ marginTop: "20px", width: "100px", height: "40px" }}  onClick={onSubmitAudioFile}>결과 확인</Button>
        </div>
        <div style={{ width: "850px", height: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{ fontSize: "40px", color: "white" }}>
                {
                    res ?
                      res.data.text
                    : 
                      <>...</>
                }
          </div>
        </div>

      </div>
    );
}

export default Csr;