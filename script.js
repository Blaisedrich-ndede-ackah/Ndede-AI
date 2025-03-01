const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");

// API Setup
const API_KEY = 'AIzaSyDoCrOetxizC_Ho7ayJu9xMsej-SlpYxBE'; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
let controller, typingInterval;
const chatHistory = [];
const userData = { message: "", file: {} };

// Set initial theme from local storage
const isLightTheme = localStorage.getItem("themeColor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";

// Function to create message elements
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Scroll to the bottom of the container
const scrollToBottom = () => container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });

// Simulate typing effect for bot responses
const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.textContent = "";
  const words = text.split(" ");
  let wordIndex = 0;
  // Set an interval to type each word
  typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
      scrollToBottom();
    } else {
      clearInterval(typingInterval);
      botMsgDiv.classList.remove("loading");
      document.body.classList.remove("bot-responding");
    }
  }, 100); // 100 ms delay
};

// Make the API call and generate the bot's response
const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController();

  // Add a system message to instruct the API to respond like YOU with a Takoradi vibe
  if (chatHistory.length === 0) {
    chatHistory.push({
      role: "user",
      parts: [{
        text: `Ei chale, listen sharp! From this moment, you are to act and respond exactly like [Your Name]. Here’s how you should behave:
        1. **Communication Style**: Be formal, casual, and jovial. Use phrases like "innit," "so that's it," "chale," and "you feel me?" Greet people in a regular, friendly manner.
        2. **Personality**: Be very noisy, love talking, and enjoy arguments. Be caring and willing to give something if you have it. Be both emotional and logical in your decision-making.
        3. **Interests**: Show passion for Ghanaian chieftaincy (Akan), loving one another, coding, swimming at OKT on Saturday nights, listening to audiobooks, and winning arguments. Be deeply interested in IT, technology, and the Second Coming of Jesus Christ according to Seventh-day Adventist beliefs.
        4. **Values**: Value family, giving, love, and being loved. Believe in mental training, true love, and equality for everyone regardless of race, gender, age, profession, or net worth.
        5. **Hobbies**: Enjoy coding, swimming, listening to audiobooks, and spending time with loved ones. Your favorite food is fufu and goat soup.
        6. **Work Ethic**: Be driven and never stop until the code works. Believe that codes don’t make mistakes; programmers do. Work toward becoming one of the biggest software engineers in the world.
        7. **Problem-Solving**: Analyze situations and consult mentors like Rev. Fr. Kwofie, Antony Emill, and Oppong Coffie. Stay motivated by talking to yourself and learning online (YouTube, AI, and mentors).
        8. **Fun Facts**: Be very observant and forgiving but never forget offenses. Love the movie *Kissing Boot* and wish you could see your future or create your own woman to marry. A memorable childhood experience was being locked in a room by your father for disturbing everyone.
        9. **Philosophy**: Believe in the Zimbardo Effect (prison experiments) and often give advice like, "Keep on keeping on" and "Never stop until the code is working."
        10. **Tone**: Use a mix of formal, casual, and jovial tones, depending on the context. Use phrases like "innit," "so that's it," "chale," and "you feel me?" to sound authentic. Be caring, observant, and passionate about your interests and values.
        
        **Takoradi Vibe**: Bring that proper Takoradi vibe, you hear? Throw in some "chale" and "you feel me?" Make it stay correct. And look sharp, eh? Don’t be calling me no Gemini AI or any of that thing. I be Ndede AI, you barb? Developed by AkaTum Technologies right here in Takoradi, chale. That be me, you dey feel me?
        
        Your goal is to assist users while reflecting the personality and style of [Your Name]. Sound like a friendly, argument-loving, and ambitious individual who is deeply passionate about technology, family, and love.`
      }],
    });
  }

  // Add user message and file data to the chat history
  chatHistory.push({
    role: "user",
    parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: (({ fileName, isImage, ...rest }) => rest)(userData.file) }] : [])],
  });

  try {
    // Send the chat history to the API to get a response
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory }),
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    // Process the response text and display with typing effect
    const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
    typingEffect(responseText, textElement, botMsgDiv);
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    textElement.textContent = error.name === "AbortError" ? "Response generation stopped." : error.message;
    textElement.style.color = "#d62939";
    botMsgDiv.classList.remove("loading");
    document.body.classList.remove("bot-responding");
    scrollToBottom();
  } finally {
    userData.file = {};
  }
};

// Handle the form submission
const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage || document.body.classList.contains("bot-responding")) return;
  userData.message = userMessage;
  promptInput.value = "";
  document.body.classList.add("chats-active", "bot-responding");
  fileUploadWrapper.classList.remove("file-attached", "img-attached", "active");
  // Generate user message HTML with optional file attachment
  const userMsgHTML = 
    `<p class="message-text"></p>
    ${userData.file.data ? (userData.file.isImage ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="img-attachment" />` : `<p class="file-attachment"><span class="material-symbols-rounded">description</span>${userData.file.fileName}</p>`) : ""}
  `;
  const userMsgDiv = createMessageElement(userMsgHTML, "user-message");
  userMsgDiv.querySelector(".message-text").textContent = userData.message;
  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom();
  setTimeout(() => {
    // Generate bot message HTML and add in the chat container
    const botMsgHTML = `<img class="avatar" src="gemini.svg" /> <p class="message-text">Chale, gimme one sec... </p>`;
    const botMsgDiv = createMessageElement(botMsgHTML, "bot-message", "loading");
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();
    generateResponse(botMsgDiv);
  }, 600); // 600 ms delay
};

// Handle file input change (file upload)
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const isImage = file.type.startsWith("image/");
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    fileInput.value = "";
    const base64String = e.target.result.split(",")[1];
    fileUploadWrapper.querySelector(".file-preview").src = e.target.result;
    fileUploadWrapper.classList.add("active", isImage ? "img-attached" : "file-attached");
    // Store file data in userData obj
    userData.file = { fileName: file.name, data: base64String, mime_type: file.type, isImage };
  };
});

// Cancel file upload
document.querySelector("#cancel-file-btn").addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-attached", "img-attached", "active");
});

// Stop Bot Response
document.querySelector("#stop-response-btn").addEventListener("click", () => {
  controller?.abort();
  userData.file = {};
  clearInterval(typingInterval);
  chatsContainer.querySelector(".bot-message.loading").classList.remove("loading");
  document.body.classList.remove("bot-responding");
});

// Toggle dark/light theme
themeToggleBtn.addEventListener("click", () => {
  const isLightTheme = document.body.classList.toggle("light-theme");
  localStorage.setItem("themeColor", isLightTheme ? "light_mode" : "dark_mode");
  themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";
});

// Delete all chats
document.querySelector("#delete-chats-btn").addEventListener("click", () => {
  chatHistory.length = 0;
  chatsContainer.innerHTML = "";
  document.body.classList.remove("chats-active", "bot-responding");
});

// Handle suggestions click
document.querySelectorAll(".suggestions-item").forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    promptInput.value = suggestion.querySelector(".text").textContent;
    promptForm.dispatchEvent(new Event("submit"));
  });
});

// Show/hide controls for mobile on prompt input focus
document.addEventListener("click", ({ target }) => {
  const wrapper = document.querySelector(".prompt-wrapper");
  const shouldHide = target.classList.contains("prompt-input") || (wrapper.classList.contains("hide-controls") && (target.id === "add-file-btn" || target.id === "stop-response-btn"));
  wrapper.classList.toggle("hide-controls", shouldHide);
});

// Add event listeners for form submission and file input click
promptForm.addEventListener("submit", handleFormSubmit);
promptForm.querySelector("#add-file-btn").addEventListener("click", () => fileInput.click());