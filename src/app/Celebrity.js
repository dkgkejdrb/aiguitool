import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, Upload, Image } from "antd";
import axios from 'axios';
import { useState } from 'react';

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3000/celebrity";

const Celebrity = () => {
    // 서버에서 응답받은 결과값 저장
    const [res, setRes] = useState("");


    // 업로드 클릭 시, 미들웨어로 이미지 파일 전송
    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }

        return e?.fileList
      };

    const onFinish = (values) => {
        const formData = new FormData();
        formData.append("image", values.dragger[0].originFileObj);

        axios.post(SUBMIT_URL, formData)
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
                <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>유명인 얼굴 인식 CFR_Celebrity</div>
                <Form.Item>
                    {/* name="dragger" 필수 값, formdata의 key */}
                    <Form.Item name="dragger" valuePropName='fileList' getValueFromEvent={normFile} style={{ width: '400px' }}>
                        <Upload.Dragger 
                            name="files">
                            <div className='icon'>
                                <InboxOutlined style={{ fontSize: "50px", color: "#1677FF" }} />
                            </div>
                            <div className='text'>
                                업로드할 파일(jpg, jpeg, png)을 클릭하거나<br></br>이 영역으로 드래그 해주세요.
                            </div>

                        </Upload.Dragger>
                    </Form.Item>
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
                    res.data.faces.map((face) => 
                        <>
                            <div style={{ fontSize: "40px", color: "white" }}>
                                {`${face.celebrity.value} / ${face.celebrity.confidence}`}
                            </div>
                        </>
                    )
                    :                   
                    <div style={{ fontSize: "40px", color: "white" }}>
                        ...
                    </div>
                }
        </div>

      </div>
    );
}

export default Celebrity;