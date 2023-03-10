import React, { useState } from 'react';
import { Menu } from 'antd';
import Face from './app/Face';
import Celebrity from './app/Celebrity';
import Csr from './app/Csr';
import Sentiment from './app/Sentiment';
import Summary from './app/Summary';
import QuestionAnswering from './app/QuestionAnswering';
import TextGeneration from './app/TextGeneration';
import FaceCam from './app/FaceCam';
import ObjectDetection from './app/ObjectDetection';
import ImageTranslateImage from './app/ImageTranslateImage';
import PapagoTextTranslation from './app/PapagoTextTranslation';
import PapagoLanguageDetection from './app/PapagoLanguageDetection';

// 메뉴 item 폼
const getItem = (label, key, icon, children, type) => {
  return {
    key, icon, children, label, type
  }
};

// 메뉴 컨테이너
// 두번째 params가 key값
const items = [
  getItem('CSR*', 'csr', null),
  getItem('CFR*', 'cfr', null, [
    getItem('Celebrity*', 'celebrity'),
    getItem('Face*', 'face'),
    getItem('Face(Cam)*', 'faceCam')
  ]),
  getItem('Sentiment*', 'sentiment', null),
  getItem('Summary*', 'summary', null),
  getItem('Papago Image Translation*', 'imageTranslate', null, [
    getItem('Text', 'text'),
    getItem('Image*', 'image'),
  ]),
  getItem('Pose Estimation', 'poseEstimation'),
  getItem('Object Estimation*', 'objectEstimation'),
  getItem('CLOVA Chatbot', 'chatbot'),
  getItem('CLOVA Studio', 'studio', null, [
    getItem('Classification', 'classification'),
    getItem('Conversation', 'conversation'),
    getItem('QuestionAnswering*', 'questionAnswering'),
    getItem('Summarization', 'summarization'),
    getItem('Text generation*', 'textGeneration'),
    getItem('Transformation', 'transformation'),
  ]),
  getItem('Papago Translation*', 'papagoTranslation', null, [
    getItem('Text', 'papagoTextTranslation'),
    getItem('LangCode', 'papagoLanguageDetection')
  ])
]


function App() {
  const [key, setKey] = useState("csr");

  // 메뉴 버튼 클릭 시, key 값 출력
  const onClick = (e) => {
    const key = e.key;
    setKey(key);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
        <Menu onClick={onClick} style={{ width: "1200px" }} items={items} mode="horizontal"></Menu>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", }}>
          {
            key === 'csr'
            ? <Csr />
            : key === 'celebrity' 
            ? <Celebrity />
            : key === 'face'
            ? <Face />
            : key === 'sentiment'
            ? <Sentiment />
            : key === 'summary'
            ? <Summary />
            : key === 'questionAnswering'
            ? <QuestionAnswering />
            : key === 'textGeneration'
            ? <TextGeneration />
            : key === 'faceCam'
            ? <FaceCam />
            : key === 'objectEstimation'
            ? <ObjectDetection />
            : key === 'image'
            ? <ImageTranslateImage />
            : key === 'papagoTextTranslation'
            ? <PapagoTextTranslation />
            : key === 'papagoLanguageDetection'
            ? <PapagoLanguageDetection />
            : <></>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
