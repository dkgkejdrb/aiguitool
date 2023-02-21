// 프론트
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Input, Slider, InputNumber, Tag, Space, Image, Modal, Select, Alert } from "antd";
import axios from 'axios';
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import logo from '../Assets/logo.png';

const { TextArea } = Input;

// middleware HOST 주소
// 나중에 정식 Host URL 필요함
const SUBMIT_URL = "http://localhost:3005/questioningAnswering";

const QuestionAnswering = () => {
    // 서버에서 응답받은 결과값 저장
    const [res, setRes] = useState(null);

    // 에러 상태값
    // 0: 지원하지 않는 파일형식
    // 1: 텍스트가 없는 경우
    const [errorCode, setErrorCode] = useState(null);

    // 실행하기 
    // 로딩 상태값 (실행하기를 누르면, true / 실행종료가 되면, false)
    const [loading, setLoading] = useState(false);
    const onSubmit = () => {
      // text가 없는 경우, errorCode 1
      if (!text) {
        setErrorCode(1);
        alert("텍스트가 없으면, 실행할 수 없습니다.")
        return;
      }

      // 불러오기 시, ↵ 기호 모양이 포함된 화면의 값(tags, inputValue2, inputValue3)을 \n 으로 전부 변경해야 함
      let _tags = []
      tags.map((_tag) => {
        let __tag = _tag.replaceAll('↵', '\n');
        _tags.push(__tag);
      });
      const _inputValue2 = inputValue2.replaceAll('↵', '\n');
      const _inputValue3 = inputValue3.replaceAll('↵', '\n');

      const data = {
          "engine": engine,
          "topP": topPValue,
          "topK": topKValue,
          "text": text,
          "maxTokens": maxTokens,
          "temperature": temperature,
          "repeatPenalty": repetitionPenalty,
          "stopBefore": _tags,
          "start": _inputValue2,
          "restart": _inputValue3,
          "includeTokens": true,
          "includeAiFilters": true,
          "includeProbs": false
      };

      const config = { 
          "Content-Type": 'application/json' 
      };

      // 실행하기가 진행되는 동안 로딩 상태
      setLoading(true);

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
          // loading 상태 초기화
          setLoading(false);
          console.log(res);
      })
      .catch((error) => {
          console.log(error)
          // loading 상태 초기화
          setLoading(false);
      })
  }
    // 학습엔진 스테이트, 이벤트
    const [engine, setEngine] = useState("https://clovastudio.apigw.ntruss.com/testapp/v1/completions/LK-B");
    const onChangeEngine = (e) => {
      console.log(e)
      setEngine(e);
    }


    // title 스테이트, 이벤트
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
        setTopPValue(v[0]);
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
    // tab 키 클릭 시, 정지키워드에 포커스
    const inputRef = useRef(null);
    const handleClose = (removedTag) => {
      const newTags = tags.filter((tag) => tag !== removedTag);
      setTags(newTags);
      setTagsSend(newTags);
    };
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
    const handleInputEnter = (e) => {
      // 엔터키 입력시, 커서 위치에 ↵ 입력
      let slicedBeforeWords = inputValue.slice(0, e.target.selectionEnd);
      let slicedAfterWords = inputValue.slice(e.target.selectionEnd);
      setInputValue(slicedBeforeWords + '↵' + slicedAfterWords)
    }
    const handleInputConfirm = () => {
      // input 값이 있을 때에만 포커스
      if (inputValue) {
        inputRef.current.input.focus();
      }
      if (inputValue && tags.indexOf(inputValue) === -1) {
        const inputValueSend = inputValue.replace(/↵/g, '\n');
        setTags([...tags, inputValue]);
        // 수정
        setTagsSend([...tagsSend, inputValueSend]);
      } 
      setInputVisible(false);
      setInputValue('');
      // inputRef.current.input.focus(); 
    };


    // 결괏값앞텍스트추가(inject start text)
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue2Send, setInputValue2Send] = useState('');
    const handleInputChange2 = (e) => {
      setInputValue2(e.target.value);
    };
    const handleInputEnter2 = (e) => {
      // 엔터키 입력시, 커서 위치에 ↵ 입력
      // 커서 위치부터 끝까지
      // console.log(inputValue2.slice(e.target.selectionEnd));
      // 처음부터 커서위치까지
      // console.log(inputValue2.slice(0, e.target.selectionEnd));
      let slicedBeforeWords = inputValue2.slice(0, e.target.selectionEnd);
      let slicedAfterWords = inputValue2.slice(e.target.selectionEnd);
      setInputValue2(slicedBeforeWords + '↵' + slicedAfterWords)
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
      // 엔터키 입력시, 커서 위치에 ↵ 입력
      let slicedBeforeWords = inputValue3.slice(0, e.target.selectionEnd);
      let slicedAfterWords = inputValue3.slice(e.target.selectionEnd);
      setInputValue3(slicedBeforeWords + '↵' + slicedAfterWords)
    }
    const handleInputConfirm3 = () => {
      if (inputValue3 && tags.indexOf(inputValue3) === -1) {
        const inputValueSend = inputValue3.replace(/↵/g, '\n');
        setInputValue3Send(inputValueSend)
      } 
    };

    // 콘솔창 출력 메시지
    const [outputTokens, setOutputTokens] = useState(null);

    // 저장하기기능
    const today = new Date(Date.now());
    const [fileName, setFileName] = useState(
      `${today.getFullYear()}${today.getMonth()+1}${today.getDate()}_작품`
    );
    const onChangeFileName = (e) => {
      setFileName(e.target.value);
    }
    const downloadJsonFile = () => {
      // 저장할 데이터
      let contentText = {
        "engine": engine,
        "topP": topPValue,
        "topK": topKValue,
        "title": title,
        "text": text,
        "maxTokens": maxTokens,
        "temperature": temperature,
        "repeatPenalty": repetitionPenalty,
        "start": inputValue2,
        "restart": inputValue3,
        "stopBefore": tags,
        "includeTokens": true,
        "includeAiFilters": true,
        "includeProbs": false
      };
      console.log(contentText)

      // javascript 객체를 Json으로 변환
      let contentJson = JSON.stringify(contentText);

      const element = document.createElement('a');
      const file = new Blob([contentJson], {
        type: "application/json"
      });
      element.href = URL.createObjectURL(file);

      // 파일 저장시, 파일 이름에 '.'이 포함되면, '_'로 변경하여 다운로드
      if (fileName.indexOf(".") !== -1)
      {
        const validFileName = fileName.replaceAll('.', '_')
        element.download = validFileName;
        document.body.appendChild(element);
        element.click();
      } else {
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
      }
    };

    // 불러오기기능
    // 불러오기 전, 저장할지 안할지 선택하는 경고 모달창
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (e) => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
      downloadJsonFile();
      inputHidden.current?.click();
    };
    const handleCancel = () => {
      setIsModalOpen(false);
      inputHidden.current?.click();
    };

    // 화면에 뿌려질 파일 데이터
    const uploadJsonFile = (e) => {
      let file = e.target.files[0];

      // 확장자에 .json이 포함되지 않았는지 체크
      let extention = file.name.slice(file.name.indexOf(".") + 1).toLowerCase();
      if(extention !== "json") {
        // 에러코드
        // 0: 지원하지 않는 파일 형식
        setErrorCode(0);
        alert("지원하지 않는 파일형식입니다.");
        return;
      }

      let fileReader = new FileReader();
      setFileName(file.name.replace(".json", ""));
      // 파일이 선택되었을 때, 
      fileReader.onload = () => {
        let jsonStr = fileReader.result;
        let jsonObj = JSON.parse(jsonStr);

        // 정상적으로 파일이 로드되었을 때, json key로 모든 value set
        setEngine(jsonObj.engine);
        setTitle(jsonObj.title);
        setText(jsonObj.text);
        setTopPValue(jsonObj.topP);
        setTopKValue(jsonObj.topK);
        setMaxTokens(jsonObj.maxTokens);
        setTemperature(jsonObj.temperature);
        setRepetitionPenalty(jsonObj.repeatPenalty);
        // \n을 ↵로 변경 후, set
        if(jsonObj.stopBefore.length !== 0) {
          const _tags = [];
          const tags = jsonObj.stopBefore;
          tags.map((tag) => {
            const _tag = tag.replaceAll('\n', '↵');
            _tags.push(_tag);
          })
          setTags(_tags);
        }

        if(jsonObj.start || jsonObj.start !== "") {
          const value = jsonObj.start.replaceAll('\n', '↵');
          setInputValue2(value);
        } else {
          setInputValue2(jsonObj.start);
        }
        if(jsonObj.restart || jsonObj.restart !== "") {
          const value = jsonObj.restart.replaceAll('\n', '↵');
          setInputValue3(value);
        } else {
          setInputValue3(jsonObj.restart);
        }
      }

      fileReader.readAsText(file);
    };

    // 불러오기 input창 숨기기
    const inputHidden = useRef(null);

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
            // alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
                {/* 저장하기 클릭시, 입력되는 파일제목 */}
                <div style={{ marginBottom: "30px", width: "100%", height: "50px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <Image width={120} src={logo} preview={false} />
                  <Input placeholder={"파일이름 입력"} value={fileName} style={{ marginLeft: "20px", width: "160px", fontWeight: "600" }} onChange={(e) => onChangeFileName(e)} />
                </div>
                <div style={{ width: "300px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", marginBottom: "5px", alignItems: "center", justifyContent: "space-between" }}>
                    <div>학습엔진(Engine)</div>

                  </div>
                  <Select
                      // defaultValue="LK-B"
                      value={engine}
                      options={[
                        {
                          value: "https://clovastudio.apigw.ntruss.com/testapp/v1/completions/LK-B",
                          label: "LK-B"
                        },
                        {
                          value: "https://clovastudio.apigw.ntruss.com/testapp/v1/completions/LK-C",
                          label: "LK-C"
                        },
                        {
                          value: "https://clovastudio.apigw.ntruss.com/testapp/v1/completions/LK-D",
                          label: "LK-D"
                        },
                        {
                          value: "https://clovastudio.apigw.ntruss.com/testapp/v1/completions/LE-C",
                          label: "LE-C"
                        },
                      ]}
                      style={{
                        width: "100%"
                      }}
                      onChange={onChangeEngine}
                    />
                </div>

                <div style={{ width: "300px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>정확도조절(Top P)</div>
                    <InputNumber 
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={onChangeTopP}
                      // defaultValue={topPValue}
                      value={topPValue}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={onChangeTopP}
                      // defaultValue={topPValue}
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
                      // defaultValue={topKValue}
                      value={topKValue}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={128}
                      step={1}
                      onChange={onChangeTopK}
                      // defaultValue={topKValue}
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
                      // defaultValue={maxTokens}
                      value={maxTokens}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={2048}
                      step={1}
                      onChange={onChangeMaxTokens}
                      // defaultValue={maxTokens}
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
                      // defaultValue={temperature}
                      value={temperature}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={onChangeTemperature}
                      // defaultValue={temperature}
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
                      // defaultValue={repetitionPenalty}
                      value={repetitionPenalty}
                      />
                  </div>
                    <Slider
                      range
                      min={0}
                      max={10}
                      step={1}
                      onChange={onChangeRepetitionPenalty}
                      // defaultValue={repetitionPenalty}
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
          </div>
        </div>

        {/* 중간 영역 */}
        <div
          style={{
            width: "1100px",
            height: "850px",

            display: "flex",
            flexDirection: "column",
            // 왼쪽 네비게이션 칸 띄우기
            marginLeft: "30px",
            borderLeft: "1px solid #e7e7e7"
          }}>
            {/* 툴바 메뉴 */}
            <div
              style={{ 
                width: "100%",
                height: "50px",
                paddingLeft: "30px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}>
              <Button 
                onClick={showModal} icon={<UploadOutlined />} style={{marginRight: "10px"}}>불러오기</Button>
              <>
                <Modal title="저장 후, 불러오기" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                  <p>현재 작업중인 파일을 저장해야만, 불러올 수 있습니다.</p>
                  <p>현재 작업중인 파일을 저장 후 불러올까요?</p>
                </Modal>
              </>
              {/* 숨김처리되어야 하는 input */}
              <input
                ref={inputHidden}
                type='file'
                onChange={(e) => uploadJsonFile(e)}
                style={{ display: 'none' }}
              ></input>
              <Button onClick={downloadJsonFile} icon={<DownloadOutlined />} style={{marginRight: "10px"}}>저장하기</Button>
              <Button
                type='primary'
                onClick={onSubmit}
                loading={loading}
                >
                실행하기
              </Button>
            </div>
            {/* 입출력창 */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f1f1f1",
                // 안쪽 title, text 간격 띄우기
                paddingLeft: "30px"
              }}>
                {/* error 팝업창 */}
                {
                  errorCode === 0
                  ? <Alert  message="지원하지 않는 파일형식입니다." type='error'  closable showIcon style={{ position: 'fixed', left: '50%' }} />
                  : errorCode === 1 
                  ? <Alert  message="실행하려면 텍스트가 있어야 합니다." type='error'  closable showIcon style={{ position: 'fixed', left: '50%' }} />
                  : <></>
                }
                
              <div
                name="title"
                style={{ width: "100%", paddingTop: "50px" }}
              >
                <TextArea value={title} placeholder='제목을 입력해주세요.' rows={1} bordered={false} maxLength={20} onChange={(e) => onChangeTitle(e)} style={{ height: "50px", resize: "none", fontSize: "25px", fontWeight: "700" }} />
              </div>
              <div
                name="text"
                style={{ width: "100%" }}
              >
                  <TextArea 
                      // defaultValue={"응답결과 있음"}
                      // value={"응답결과 있음"}
                      value={text}
                      placeholder='완료하려면 텍스트를 입력하고 실행 버튼을 눌러주세요.' 
                      rows={10} bordered={false} showCount maxLength={2000} onChange={(e) => onChangeText(e)} style={{ height: "500px", resize: "none", fontSize: "15px",  }} />
              </div>
            </div>
            <div 
                className='console' 
                style={{ width: "100%", height: "120px", backgroundColor: "#1e232e", paddingLeft: "30px", paddingTop: "10px" }}>
                  <div style={{ fontSize: "14px", color: "white" }}>최근실행결과</div>
                  <TextArea
                    bordered={false}
                    className='outputText' style={{ color: "white", height: "80px", resize: "none" }}
                    value={outputTokens}
                    />
            </div>
        </div>
      </div>
    );
}

export default QuestionAnswering;