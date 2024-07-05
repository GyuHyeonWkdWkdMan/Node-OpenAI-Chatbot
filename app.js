const express = require("express");
const app = express();
const port = 3000;
const fetch = require("node-fetch"); // node-fetch 모듈 추가
const privatekey = require("./private/apikey.js"); // Use your own key!!!

app.use(express.static("public"));
app.use(express.json()); //JSON 바디를 파싱

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/main.html");
});

app.get("/main", function (req, res) {
  res.sendFile(__dirname + "/public/main.html");
});

// POST 요청을 받아서 AI 응답을 출력하는 엔드포인트 추가
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  // AI에게 질문하기
  const aiResponse = await fetchAIResponse(question);
  console.log("질문:", question);
  console.log("답변:", aiResponse);

  res.json({ answer: aiResponse });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// OpenAI API 요청을 위한 함수 정의
async function fetchAIResponse(prompt) {
  const apiKey = privatekey.APIKEY; // Use your own key!!!
  const apiEndpoint = privatekey.ENDPOINT; // Use your own key!!!

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      stop: ["Human"],
    }),
  };

  try {
    const response = await fetch(apiEndpoint, requestOptions);
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    return aiResponse;
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    return "OpenAI API 호출 중 오류 발생";
  }
}
//dd
