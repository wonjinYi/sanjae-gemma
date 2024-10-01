import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (see "Set up your API key" above)
const API_KEY = `AIzaSyDHc1Hi2Uy1keEVnDQowQHQtarqn0BP3Ek`;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export default async function getItems() {
    console.log('시작');
    const genText = await generateTexts();
}

