// 프론트
import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, Upload, Image, Input, Radio, InputNumber } from "antd";
import axios from 'axios';
import { useState } from 'react';
const { TextArea } = Input;

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3003/summary";

const Summary = () => {
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

    // const option = {  
    //     "language": "ko",
    //     "model": "news",
    //     "tone": 2,
    //     "summaryCount": 3
    // }

    const onFinish = (values) => {

        // console.log(values)

        const data = {
            // "document" : values.content,
            // "document" : {
            //     "title": "'하루 2000억' 판 커지는 간편송금 시장",
            //     "content": "간편송금 이용금액이 하루 평균 2000억원을 넘어섰다. 한국은행이 17일 발표한 '2019년 상반기중 전자지급서비스 이용 현황'에 따르면 올해 상반기 간편송금서비스 이용금액(일평균)은 지난해 하반기 대비 60.7% 증가한 2005억원으로 집계됐다. 같은 기간 이용건수(일평균)는 34.8% 늘어난 218만건이었다. 간편 송금 시장에는 선불전자지급서비스를 제공하는 전자금융업자와 금융기관 등이 참여하고 있다. 이용금액은 전자금융업자가 하루평균 1879억원, 금융기관이 126억원이었다. 한은은 카카오페이, 토스 등 간편송금 서비스를 제공하는 업체 간 경쟁이 심화되면서 이용규모가 크게 확대됐다고 분석했다. 국회 정무위원회 소속 바른미래당 유의동 의원에 따르면 카카오페이, 토스 등 선불전자지급서비스 제공업체는 지난해 마케팅 비용으로 1000억원 이상을 지출했다. 마케팅 비용 지출규모는 카카오페이가 491억원, 비바리퍼블리카(토스)가 134억원 등 순으로 많았다."
            // },

            "document": {
                "title": values.title,
                "content": values.content
            },
            "option": {
                "language": "ko",
                "model": values.model,
                "tone": values.tone,
                "summaryCount": values.summaryCount
            }
        };

        console.log(data);

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
                <div className='title' style={{ fontSize: "30px", marginBottom: "50px" }}>문장 요약 Summary</div>
                <Form.Item label="제목" name="title" getValueFromEvent={normFile}  style={{ width: "400px" }}>
                    <TextArea rows={4} showCount maxLength={100}/>
                </Form.Item>

                <Form.Item label="본문" name="content" getValueFromEvent={normFile}  style={{ width: "400px" }}>
                    <TextArea rows={10} showCount maxLength={1900}/>
                </Form.Item>

                <div className='optionWrap' style={{ display: "flex", flexDirection: "column" }}>
                    <Form.Item label="요약 모델" name="model" getValueFromEvent={normFile}>
                        <Radio.Group>
                            <Radio value="general">general</Radio>
                            <Radio value="news">news</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="어투 변환" name="tone" getValueFromEvent={normFile}>
                        <Radio.Group>
                            <Radio value="0">원문체</Radio>
                            <Radio value="1">해요체</Radio>
                            <Radio value="2">정중체</Radio>
                            <Radio value="3">종결체</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="요약 문장 수" name="summaryCount" getValueFromEvent={normFile}>
                        <Input placeholder='1 이상'/>
                    </Form.Item>
                </div>

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
                        <div style={{ fontSize: "30px", color: "white" }}>
                            {`문장 요약: ${res.data.summary}`}
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

export default Summary;