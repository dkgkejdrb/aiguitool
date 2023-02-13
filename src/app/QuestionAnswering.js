// 프론트
import { SmileOutlined } from '@ant-design/icons';
import { Button, Form, Upload, Image, Input, Radio, Slider } from "antd";
import axios from 'axios';
import { useState } from 'react';
const { TextArea } = Input;

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3005/questioningAnswering";

const QuestionAnswering = () => {
    // 서버에서 응답받은 결과값 저장
    const [res, setRes] = useState("");


    // 업로드 클릭 시, 미들웨어로 이미지 파일 전송
    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }

        return e.target.value;
      };



    const onFinish = (values) => {
        const data = {
            "text": values.text,
            "maxTokens": values.maxTokens[0],
            "temperature": values.temperature[0],
            "topK": values.topK[0],
            "topP": values.topP[0],
            "repeatPenalty": values.penalty[0],
            "start": "\n답:",
            "restart": "\n###\n질문:",
            "stopBefore": ["###\n", " 질문:", " 답:"],
            "includeTokens": true,
            "includeAiFilters": true,
            "includeProbs": false
        };

        console.log(data);

        const config = { 
            "Content-Type": 'application/json' 
        };

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
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "850px",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Form
            onFinish={onFinish}
            // 초기 슬라이더 설정값
            initialValues={{
                "maxTokens": [30],
                "temperature": [0.5],
                "topK": [0],
                "topP": [0.8],
                "penalty": [5],
            }}

            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              className="title"
              style={{ fontSize: "30px" }}
            >
              질문 답변 Question answering
            </div>
            <div style={{ fontSize: "30px", marginBottom: "50px" }}>
                예시: MBTI 백과사전
            </div>
            <Form.Item
              name="text"
              getValueFromEvent={normFile}
              style={{ width: "400px" }}
            >
              <TextArea rows={10} showCount maxLength={2000} />
            </Form.Item>

            <Form.Item label='출력문장수' name="maxTokens" getValueFromEvent={normFile} style={{ width: "400px" }}>
                    <Slider
                    range
                        min={0}
                        max={100}
                    />
                </Form.Item>

                <Form.Item label='변화치 조절' name="temperature" getValueFromEvent={normFile} style={{ width: "400px" }}>
                    <Slider
                    range
                        min={0}
                        max={1}
                        step={0.1}
                    />
                </Form.Item>

                <Form.Item label='차순위 조절' name="topK" getValueFromEvent={normFile} style={{ width: "400px" }}>
                    <Slider
                    range
                        min={0}
                        max={128}
                    />
                </Form.Item>

                <Form.Item label='정확도 조절' name="topP" getValueFromEvent={normFile} style={{ width: "400px" }}>
                    <Slider
                        range
                        min={0}
                        max={1}
                        step={0.1}
                    />
                </Form.Item>

                <Form.Item label='표현범위 조절' name="penalty" getValueFromEvent={normFile} style={{ width: "400px" }}>
                    <Slider
                        range
                        min={0}
                        max={10}
                    />
                </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                제출
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          style={{
            width: "850px",
            height: "100%",
            backgroundColor: "black",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ color: "white", fontSize: "80px" }}>
            <SmileOutlined />
          </div>
          {res ? (
            <>
              <div
                style={{ fontSize: "40px", color: "white", padding: "20px" }}
              >
                {res.data.result.outputTokens.map((i) => {
                  return i;
                })}
              </div>
            </>
          ) : (
            <div style={{ fontSize: "40px", color: "white" }}>...</div>
          )}
        </div>
      </div>
    );
}

export default QuestionAnswering;