import axios from "axios";

// 공공데이터
const URL =
  "https://apis.data.go.kr/B490001/sjbPrecedentInfoService/getSjbPrecedentNaeyongPstate";
const serviceKey =
  "HL+Z1DVaoQ5w5vI/N1y1qA0pALQW7IcgLjf2XoNoq4ggQ0GtFiV1AoiXIXT55Q7hqxPa7OpeVdWPhZQFnDeCNg==";

export default async function fetchPage(reqParams) {
  const res = await axios.get(URL, {
    params: {
      serviceKey: serviceKey,
      pageNo: reqParams.pageNo,
      numOfRows: reqParams.numOfRows,
      kindA: reqParams.kindA,
      kindB: reqParams.kindB,
      kindC: reqParams.kindC,
      // "keywords" : reqParams.keywords
    },
  });
  const _raw = res.data.response.body.items.item;
  // console.log(_raw);
  if (!_raw) {
    return [];
  }

  const raw = Array.isArray(_raw) ? _raw : [_raw];

  const arr = raw.map((item) => {
    return {
      title: item.title,
      contents: item.noncontent,
      preview: "",
      summarizedContents: {},
      kindA: reqParams.kindA,
      kindB: reqParams.kindB,
      kindC: reqParams.kindC,
      accnum: item.accnum,
      courtName: item.courtname,
      courtLevel: getCourtLevel(item.courtname),
      keywordsIncluded: getKeywordsIncluded(
        reqParams.keywords,
        item.noncontent
      ),
    };
  });

  // filter only available itmes (contents should not be empty, should have keywords)
  const availableArr =
    reqParams.keywords.length === 0
      ? arr.filter((item) => item.contents.trim())
      : arr.filter(
          (item) => item.keywordsIncluded.length > 0 && item.contents.trim()
        );
  // filter by courtLevel
  const filteredArr =
    reqParams.courtLevel === 0
      ? availableArr
      : availableArr.filter((item) => item.courtLevel >= reqParams.courtLevel);
  // console.log(filteredArr);

  // Inject preview and summarizedContents with genAI
  const promises = filteredArr.map((item, index) => {
    return generateTexts(item.contents).then((genTexts) => {
      filteredArr[index].preview = genTexts.preview;
      filteredArr[index].summarizedContents = genTexts.summarizedContents;
    });
  });
  await Promise.all(promises);

  return filteredArr;
}

function getCourtLevel(name) {
  if (name.includes("지방")) {
    return 1;
  } else if (name.includes("행정")) {
    return 1;
  } else if (name.includes("고등")) {
    return 2;
  } else if (name.includes("대")) {
    return 3;
  } else {
    return 0;
  }
}

function getKeywordsIncluded(keywords, content) {
  return keywords.filter((keyword) => content.includes(keyword));
}

async function generateTexts(contents) {
  try {
    const REQ_URL =
      "https://us-central1-sanjae.cloudfunctions.net/gemini-summarization";
    const res = await axios.post(REQ_URL, {
      content: contents,
    });
    if (!res.data) throw new Error("No response data from the server");

    const text = res.data;
    const returnJson = text.includes("json") ? cleanJSONString(text) : text;
    return JSON.parse(returnJson);
  } catch (err) {
    console.error(err);
    return `(요약 과정에 문제가 생겨 전문의 앞부분을 대신 표시합니다.)\n ${contents.substring(
      0,
      100
    )}`;
  }
}

function cleanJSONString(input) {
  // 정규식을 사용하여 백틱과 그 사이의 내용을 추출
  const regex = /```json\s*({.*?})\s*```/s;
  const match = input.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error("Invalid input format");
  }
}
