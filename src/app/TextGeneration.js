// 프론트
import { SmileOutlined } from '@ant-design/icons';
import { Button, Form, Upload, Image, Input, Radio, Slider } from "antd";
import axios from 'axios';
import { useState } from 'react';
const { TextArea } = Input;

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3006/textGeneration";

const TextGeneration = () => {
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
        console.log(values);

        const data = {
            // "text": 
            //     "제목: "
            //     + values.title 
            //     + "\n"
            //     + "장르: "
            //     + values.genre
            //     + "\n"
            //     + "등장인물: "
            //     + values.actor
            //     + "\n"
            //     + "소설: ",

            "text":
                "제목: 보통 여자\n장르: 스릴러\n등장인물: 수진, 철호(수진의 남자친구), 태성(철호의 친구)\n소설:\n수진은 여느 20대 여자들 같이 데이트 준비를 위해 치장을 하고 있다.\n시내에서 남자친구인 철호를 만나 이것저것 구경도 하고 영화도 보고 저녁도 함께 먹는다.\n음식을 얼굴에 살짝 묻히면서 맛있게 먹는 수진을 보며 철호는 음식 먹는 것도 예쁘게 먹는다고 웃으며 칭찬을 한다.\n데이트가 끝나고 집으로 올라오는 엘리베이터 문이 열리면서 수진의 모습이 보인다.\n수진의 양손에는 빵, 과자와 같은 먹을거리가 한 가득이다.\n양 손에든 음식들은 식탁위에 펼쳐놓으며 식탁 맞은편에 카메라를 설치하기 시작한다.\n카메라 삼각대가 없는 것을 후회하며 상자 위에 책을 여러 권 쌓아가며 눈높이를 맞춰본다.\n카메라의 동영상 촬영버튼을 누른 후 식탁에 앉아 사다 놓은 음식들을 게걸스럽게 먹기 시작한다.\n그 많던 음식을 다 먹고 난 후 자신의 모습을 찍은 동영상을 저장한다."
                + "제목: "
                + values.title 
                + "\n"
                + "장르: "
                + values.genre
                + "\n"
                + "등장인물: "
                + values.actor
                + "\n"
                + "소설: "
            ,
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
                "maxTokens": [500],
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
              문장 생성 Text Generation
            </div>
            <div style={{ fontSize: "30px", marginBottom: "50px" }}>
                예시: 시나리오 만들기
            </div>
            <Form.Item
              label="제목"
              name="title"
              getValueFromEvent={normFile}
              style={{ width: "400px" }}
            >
              <TextArea rows={2} showCount maxLength={50} />
            </Form.Item>

            <Form.Item
              label="장르"
              name="genre"
              getValueFromEvent={normFile}
              style={{ width: "400px" }}
            >
              <TextArea rows={1} showCount maxLength={30} />
            </Form.Item>

            <Form.Item
              label="등장인물"
              name="actor"
              getValueFromEvent={normFile}
              style={{ width: "400px" }}
            >
              <TextArea rows={3} showCount maxLength={200} />
            </Form.Item>


            <Form.Item label='출력문장수' name="maxTokens" getValueFromEvent={normFile} style={{ width: "400px" }}>
                    <Slider
                    range
                        min={0}
                        max={1000}
                        step={50}
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
                style={{ fontSize: "20px", color: "white", padding: "20px" }}
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

export default TextGeneration;