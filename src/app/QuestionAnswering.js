// 프론트
import { SmileOutlined } from '@ant-design/icons';
import { Button, Form, Input, Slider, InputNumber, Tag, theme, Space, Tooltip } from "antd";
import axios from 'axios';
import { createRef, useEffect, useRef, useState } from 'react';
const { TextArea } = Input;

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3005/questioningAnswering";

const QuestionAnswering = () => {
    // 서버에서 응답받은 결과값 저장
    const [res, setRes] = useState(null);

    const onSubmit = () => {
      const data = {
          "topP": topPValue,
          "topK": topKValue,
          "text": text,
          "maxTokens": maxTokens,
          "temperature": temperature,
          "repeatPenalty": repetitionPenalty,
          "start": inputValue2Send,
          "restart": inputValue3Send,
          "stopBefore": tagsSend,
          "includeTokens": true,
          "includeAiFilters": true,
          "includeProbs": false
      };

      console.log(data)

      const config = { 
          "Content-Type": 'application/json' 
      };

      // setOutputTokens
      axios.post(SUBMIT_URL, data, config)
      .then((res) => {
          setRes(res);
          setText(res.data.result.text);

          const outputTokens = res.data.result.outputTokens;
          let words = "";
          outputTokens.map((word) => {
            words += word;
          });
          setOutputTokens(words);
          console.log(res);
      })
      .catch((error) => {
          console.log(error)
      })
  }
    // title 스테이트, 이벤
    const [title, setTitle] = useState("");
    const onChangeTitle = (e) => {
      setTitle(e.target.value);
    }


    // text 스테이트, 이벤트
    const [text, setText] = useState("");
    const onChangeText = (e) => {
      setText(e.target.value);
    }

    // topP 스테이트, 이벤트
    const [topPValue, setTopPValue] = useState(0.8);
    const onChangeTopP = (v) => {
      if(typeof v === "object") {
        if(v[0] === "string")
        {
          return;
        } else {
          setTopPValue(v[0]);
        }
      } else {
        setTopPValue(v);
      }
    }

    // topK 스테이트, 이벤트
    const [topKValue, setTopKValue] = useState(0);
    const onChangeTopK = (v) => {
      if(typeof v === "object") {
        setTopKValue(v[0]);
      } else {
        setTopKValue(v);
      }
    }

    // maxTokens 스테이트, 이벤트
    const [maxTokens, setMaxTokens] = useState(100);
    const onChangeMaxTokens = (v) => {
      if(typeof v === "object") {
        setMaxTokens(v[0]);
      } else {
        setMaxTokens(v);
      }
    }

    // temperature 스테이트, 이벤트
    const [temperature, setTemperature] = useState(0.5);
    const onChangeTemperature = (v) => {
      if(typeof v === "object") {
        setTemperature(v[0]);
      } else {
        setTemperature(v);
      }
    }

    // repetitionPenalty 스테이트, 이벤트
    const [repetitionPenalty, setRepetitionPenalty] = useState(5);
    const onChangeRepetitionPenalty = (v) => {
      if(typeof v === "object") {
        setRepetitionPenalty(v[0]);
      } else {
        setRepetitionPenalty(v);
      }
    }

    // 화면에 보여지는 tags
    const [tags, setTags] = useState([]);
    // 서버로 전송되는 tags
    const [tagsSend, setTagsSend] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    // const inputRef = useRef(null);
    // const editInputRef = useRef(null);
    // useEffect(() => {
    //   if (inputVisible) {
    //     inputRef.current?.focus();
    //   }
    // }, [inputVisible]);
    // useEffect(() => {
    //   editInputRef.current?.focus();
    // }, [inputValue]);
    const handleClose = (removedTag) => {
      const newTags = tags.filter((tag) => tag !== removedTag);
      setTags(newTags);
      setTagsSend(newTags);
    };
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
    const handleInputEnter = (e) => {
      if(!(e.target.value)) {
        setInputValue("↵"+inputValue)
      } else {
        setInputValue(inputValue+"↵")
      }
    }
    const handleInputConfirm = () => {
      if (inputValue && tags.indexOf(inputValue) === -1) {
        const inputValueSend = inputValue.replace(/↵/g, '\n');
        setTags([...tags, inputValue]);
        // 수정
        setTagsSend([...tagsSend, inputValueSend]);
      } 
      setInputVisible(false);
      setInputValue('');
      inputRef.current.input.focus(); 
    };
    // tab 키 클릭 시, 정지키워드에 포커스
    const inputRef = useRef(null);


    // 결괏값앞텍스트추가(inject start text)
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue2Send, setInputValue2Send] = useState('');
    const handleInputChange2 = (e) => {
      setInputValue2(e.target.value);
    };
    const handleInputEnter2 = (e) => {
      if(!(e.target.value)) {
        setInputValue2("↵"+inputValue2)
      } else {
        setInputValue2(inputValue2+"↵")
      }
    }
    const handleInputConfirm2 = () => {
      if (inputValue2 && tags.indexOf(inputValue2) === -1) {
        const inputValueSend = inputValue2.replace(/↵/g, '\n');
        setInputValue2Send(inputValueSend)
      } 
    };

    // 출력값뒤텍스트추가(inject start text)
    const [inputValue3, setInputValue3] = useState('');
    const [inputValue3Send, setInputValue3Send] = useState('');
    const handleInputChange3 = (e) => {
      setInputValue3(e.target.value);
    };
    const handleInputEnter3 = (e) => {
      if(!(e.target.value)) {
        setInputValue3("↵"+inputValue3)
      } else {
        setInputValue3(inputValue3+"↵")
      }
    }
    const handleInputConfirm3 = () => {
      if (inputValue3 && tags.indexOf(inputValue3) === -1) {
        const inputValueSend = inputValue3.replace(/↵/g, '\n');
        setInputValue3Send(inputValueSend)
      } 
    };

    // 콘솔창 출력 메시지
    const [outputTokens, setOutputTokens] = useState(null);



    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* 왼쪽 네비게이션 영역 */}
        <div
          className='navigation'
          style={{
            width: "300px",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            paddingTop: "50px"
            // alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
                <div style={{ width: "300px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>정확도조절(Top P)</div>
                    <InputNumber 
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={onChangeTopP}
                      defaultValue={topPValue}
                      value={topPValue}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={onChangeTopP}
                      defaultValue={topPValue}
                      value={topPValue}
                      />
                </div>

                <div style={{ width: "300px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>차순위조절(TopK)</div>
                    <InputNumber 
                      min={0}
                      max={128}
                      step={1}
                      onChange={onChangeTopK}
                      defaultValue={topKValue}
                      value={topKValue}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={128}
                      step={1}
                      onChange={onChangeTopK}
                      defaultValue={topKValue}
                      value={topKValue}
                      />
                </div>

                <div style={{ width: "300px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>출력문장수(Max tokens)</div>
                    <InputNumber 
                      min={0}
                      max={2048}
                      step={1}
                      onChange={onChangeMaxTokens}
                      defaultValue={maxTokens}
                      value={maxTokens}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={2048}
                      step={1}
                      onChange={onChangeMaxTokens}
                      defaultValue={maxTokens}
                      value={maxTokens}
                      />
                </div>

                <div style={{ width: "300px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>다양성조절(Temperature)</div>
                    <InputNumber 
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={onChangeTemperature}
                      defaultValue={temperature}
                      value={temperature}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={onChangeTemperature}
                      defaultValue={temperature}
                      value={temperature}
                      />
                </div>

                <div style={{ width: "300px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>중복표현억제조절 (Repetition penalty)</div>
                    <InputNumber 
                      min={0}
                      max={10}
                      step={1}
                      onChange={onChangeRepetitionPenalty}
                      defaultValue={repetitionPenalty}
                      value={repetitionPenalty}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={10}
                      step={1}
                      onChange={onChangeRepetitionPenalty}
                      defaultValue={repetitionPenalty}
                      value={repetitionPenalty}
                      />
                </div>

                <div style={{ width: "300px", marginBottom: "10px" }}>
                  <div style={{ marginBottom: "10px" }}>정지키워드 (Stop sequences)</div>
                  <Space size={[0, 8]} wrap>
                    <Space size={[0, 8]} wrap>
                      {/* 인풋창 */}
                      <Input
                        className='stopSequence'
                        type="text"
                        size="small"
                        placeholder="키워드 입력 후 Tab"
                        style={{ width: 300, height: 30 }}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputEnter}
                        ref={inputRef}
                        tabIndex={-1}
                      />
                    </Space>
                    <div style={{ width: "300px", minHeight: "36px" }}>
                      {/* 태그창 */}
                      {tags.map((tag, index) => {
                        const isLongTag = tag.length > 20;
                        const tagElem = (
                          <Tag
                            key={tag}
                            // closable={index !== 0}
                            closable
                            style={{
                              userSelect: 'none',
                            }}
                            onClose={() => handleClose(tag)}
                          >
                            <span>
                              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </span>
                          </Tag>
                        );
                        return (
                          tagElem
                        );
                      })}
                      </div>
                </Space>
              </div>

              <div style={{ width: "300px", marginBottom: "10px" }}>
                <div style={{ marginBottom: "10px" }}>결괏값앞텍스트추가(Inject start text)</div>
                <Input 
                  style={{ width: "300px", height: "30px" }}
                  onChange={handleInputChange2}
                  onPressEnter={handleInputEnter2}
                  onBlur={handleInputConfirm2}
                  value={inputValue2}
                ></Input>
              </div>

              <div style={{ width: "300px", marginBottom: "10px" }}>
                <div style={{ marginBottom: "10px" }}>결괏값뒤텍스트추가(Inject restart text)</div>
                <Input 
                  style={{ width: "300px", height: "30px" }}
                  onChange={handleInputChange3}
                  onPressEnter={handleInputEnter3}
                  onBlur={handleInputConfirm3}
                  value={inputValue3}
                  
                ></Input>
              </div>
            <Button
              type='primary'
              onClick={onSubmit}
              loading
              >
              제출하기
            </Button>
          </div>
        </div>

        {/* 중간 영역 */}
        <div
          style={{
            width: "1100px",
            height: "750px",

            display: "flex",
            flexDirection: "column",
            // 왼쪽 네비게이션 칸 띄우기
            marginLeft: "30px",
            borderLeft: "1px solid #e7e7e7"
          }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f1f1f1",
                // 안쪽 title, text 간격 띄우기
                paddingLeft: "30px"
              }}>
              <div
                name="title"
                style={{ width: "100%", paddingTop: "50px" }}
              >
                <TextArea placeholder='제목을 입력해주세요.' rows={1} bordered={false} maxLength={20} onChange={(e) => onChangeTitle(e)} style={{ height: "50px", resize: "none", fontSize: "25px", fontWeight: "700" }} />
              </div>
              <div
                name="text"
                style={{ width: "100%" }}
              >
                {
                  res ?
                  <TextArea 
                      // defaultValue={"응답결과 있음"}
                      // value={"응답결과 있음"}
                      defaultValue={text}
                      value={text}
                      placeholder='완료하려면 텍스트를 입력하고 실행 버튼을 눌러주세요.' 
                      rows={10} bordered={false} showCount maxLength={2000} onChange={(e) => onChangeText(e)} style={{ height: "450px", resize: "none", fontSize: "15px",  }} />
                  :
                  <TextArea 
                      placeholder='완료하려면 텍스트를 입력하고 실행 버튼을 눌러주세요.' rows={10} bordered={false} showCount maxLength={2000} onChange={(e) => onChangeText(e)} style={{ height: "450px", resize: "none", fontSize: "15px" }} />
                }
              </div>
            </div>
            <div 
                className='console' 
                style={{ width: "100%", height: "150px", backgroundColor: "#1e232e", paddingLeft: "30px", paddingTop: "10px" }}>
                  <div style={{ color: "white" }}>최근실행결과</div>
                  {
                    res ?
                    <TextArea
                      bordered={false}
                      className='outputText' style={{ color: "white", height: "100%" }}
                      value={outputTokens}
                      />
                    :
                    <TextArea
                      bordered={false}
                      className='outputText' style={{ color: "white", height: "100%" }}
                    />
                  }
            </div>
        </div>
      </div>
    );
}

export default QuestionAnswering;