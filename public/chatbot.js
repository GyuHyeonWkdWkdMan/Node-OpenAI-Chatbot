const chatMessages = document.querySelector("#chat-messages");
const userInput = document.querySelector("#user-input input");
const sendButton = document.querySelector("#user-input button");

const apiEndpoint = "http://localhost:3000/ask"; // 서버의 엔드포인트 주소    --CORS 위반을 하지 않기 위해 클라이언트 단에서 엔드포인트를 직접적으로 사용하지 않음

async function fetchAIResponse(prompt) {
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: prompt }),
    });
    const data = await response.json();
    const aiResponse = data.answer;
    return aiResponse;
  } catch (error) {
    console.error("서버 요청 중 오류 발생:", error);
    return "서버 요청 중 오류 발생";
  }
}

sendButton.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (message.length === 0) return;

  // 사용자 메시지 화면에 추가
  addMessage("나", message);
  userInput.value = "";

  // ChatGPT API 요청 및 답변 추가는 여기서 처리
  const aiResponse = await fetchAIResponse(message);
  addMessage("챗봇", aiResponse);

  // 콘솔에도 AI의 답변 출력
  console.log("AI의 답변:", aiResponse);
});

//---keydown 사용 절대금지!! keydown 쓸 시 한글 끝글자가 두번 입력됨
//---keypress 사용시 키를 꾹 누르면 실행이 계속 되지만 입력창 비었을때 실행되지 않는 코드를 추가했기 때문에 사용 가능
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

function addMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.textContent = `${sender}: ${message}`;
  chatMessages.prepend(messageElement);
}
