// 프론트
import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, Upload, Image, Input, Radio } from "antd";
import axios from 'axios';
import { useState } from 'react';
const { TextArea } = Input;

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3010/papagoTextTranslation";

const PapagoTextTranslation = () => {
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
            "text" : values.text,
            "source" : values.source,
            "target" : values.target,
            "honorific" : values.honorific,
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
                <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>Papago 텍스트 번역</div>

                <Form.Item name="text" getValueFromEvent={normFile}  style={{ width: "400px" }}>
                    <TextArea rows={10} showCount maxLength={5000}/>
                </Form.Item>

                <Form.Item label="원본언어" name="source" getValueFromEvent={normFile}>
                    <Radio.Group>
                        <Radio value="ko">한국어</Radio>
                        <Radio value="en">영어</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="타겟언어" name="target" getValueFromEvent={normFile}>
                    <Radio.Group>
                        <Radio value="ko">한국어</Radio>
                        <Radio value="en">영어</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="반말표현" name="honorific" getValueFromEvent={normFile}>
                    <Radio.Group>
                        <Radio value='False'>On</Radio>
                        <Radio value='True'>Off</Radio>
                    </Radio.Group>
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
                        <div style={{ fontSize: "40px", color: "white", padding: "10px" }}>
                            {res.data.message.result.translatedText}
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

export default PapagoTextTranslation;