const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const advancedCorrection = async (korText, engText) => {
  const prompt = `사용자가 '${korText}'라는 문장을 영어로 '${engText}'로 표현했어. 만약 영어 문장이 문법적으로 올바르지 않다면, 문장을 고치고 이에 대한 자세한 설명을 한국어로 해줘. 답변은 'Corrected 문장: [정정된 문장] / Explanation: [설명]' 형식으로 작성해 줘.`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0].message.content;
};

const basicCorrection = async (korText, engText) => {
  const prompt = `사용자가 '${korText}'라는 문장을 영어로 '${engText}'로 표현했어. 만약 영어 문장이 문법적으로 올바르지 않다면, 문장을 고치고 이에 대한 간단한 설명을 한국어로 해줘. 답변은 'Corrected 문장: [정정된 문장] / Explanation: [설명]' 형식으로 작성해 줘.`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0].message.content;
};

const defaultCorrection = async (korText, engText) => {
  const prompt = `사용자가 '${korText}'라는 문장을 영어로 '${engText}'로 표현했어. 만약 영어 문장이 문법적으로 올바르지 않다면, 문장을 고쳐줘. 답변은 'Corrected 문장: [정정된 문장]' 형식으로 작성해 줘.`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
  });

  return response.choices[0].message.content;
};

module.exports = {
  advancedCorrection,
  basicCorrection,
  defaultCorrection,
};
