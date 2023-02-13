// 프론트
import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, Upload, Image, Input } from "antd";
import axios from 'axios';
import { useState } from 'react';
const { TextArea } = Input;

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3002/sentiment";

const Sentiment = () => {
    // 서버에서 응답받은 결과값 저장
    const [res, setRes] = useState("");


    // 업로드 클릭 시, 미들웨어로 이미지 파일 전송
    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }

        // console.log(e.target.value)
        return e.target.value;
      };

    const onFinish = (values) => {

        const data = {
            "content" : values.content
        };

        const config = { "Content-Type": 'application/json' };

        axios.post(SUBMIT_URL, data, config)
        .then((res) => {
            setRes(res);
            console.log(res)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "850px", height: "100%", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Form
                onFinish={onFinish}
                style={{ 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
                >
                <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>감정 분석 Sentiment</div>
                <Form.Item name="content" getValueFromEvent={normFile}  style={{ width: "400px" }}>
                    <TextArea rows={10} showCount maxLength={2000}/>
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        제출
                    </Button>
                </Form.Item>
            </Form>
        </div>
        <div style={{ width: "850px", height: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center"}}>
                {
                    res ?
                    <>
                        <div style={{ fontSize: "40px", color: "white" }}>
                            {`감정: ${res.data.document.sentiment}`}
                        </div>
                    </>
                    :
                    <div style={{ fontSize: "40px", color: "white" }}>
                        ...
                    </div>
                }
        </div>

      </div>
    );
}

export default Sentiment;