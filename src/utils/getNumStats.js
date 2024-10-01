import axios from 'axios';
import fetchPage from './fetchPage.js'
import { apiOptions }  from '@/globalConst.js'
export const URL = "https://apis.data.go.kr/B490001/sjbPrecedentInfoService/getSjbPrecedentNaeyongPstate"
export const serviceKey = "HL+Z1DVaoQ5w5vI/N1y1qA0pALQW7IcgLjf2XoNoq4ggQ0GtFiV1AoiXIXT55Q7hqxPa7OpeVdWPhZQFnDeCNg=="

export default async function getNumStats(reqParams) {
    const withoutKeywords = {};
    const withKeywords = {};
    const withKeywordsAndCourtLevel = {};

    const promises = apiOptions.kindA.map((option) => {
        return axios.get(URL, {
            params: {
                "serviceKey": serviceKey,
                "pageNo": 1,
                "numOfRows": 32235, //32235,
                "kindA": option,
                "kindB": reqParams.kindB,
                "kindC": reqParams.kindC,
            },
            maxContentLength: 50000000,
        
        },
        ).then((fetchedData) => {
            const res = fetchedData.data.response;
            if(!res){
                withoutKeywords[option] = 0;
                withKeywords[option] = 0;
                return;
            }

            const body = res.body;
            if(reqParams.keywords.length === 0){
                withoutKeywords[option] = body.totalCount;
                withKeywords[option] = body.totalCount;
                return;
            }

            withoutKeywords[option] = body.totalCount;
            withKeywords[option] = 0;

            const _arr = body.items.item;
            const arr = Array.isArray(_arr) ? _arr : [_arr];
            arr.forEach((item) => {
                const isNotBlank = item.noncontent.trim();
                const hasKeywords = reqParams.keywords.some((keyword) => item.noncontent.includes(keyword));
                if (isNotBlank && hasKeywords) {
                    withKeywords[option]++;
                }
            });
        });
    })
    await Promise.all(promises);
    
    withKeywords.total = Object.values(withKeywords).reduce((acc, cur) => acc + cur);
    withoutKeywords.total = Object.values(withoutKeywords).reduce((acc, cur) => acc + cur);
    // console.log(withKeywords);

    return ({
        withKeywords,
        withoutKeywords,
    });
}