import functions_framework
import google.generativeai as genai

######################################
# Use your gemini api key
######################################
API_KEY = '<YOUR_GEMINI_API_KEY>'
######################################

rule = '''위 재판 판결문 내용을 json형식으로 아래와 같이 한국어로 요약해줘. 한자는 사용하면 안돼. 
각 속성의 값은 한글과 문장부호 텍스트로만 채워줘. 최대한 쉬운 말을 사용해줘. 문장이 길어지는 경우 여러 문장으로 분할해. 반말을 사용하면 안돼. '했습니다'로 끝나는 존댓말을 사용해야 해. 산재보험사를 나타내고자 할 때는 '근로복지공단'이라는 말을 쓰면 돼. 완벽한 문장이라 함은 '~다.'로 끝나는 문장이야.
{
    preview : String, // 공백 제외 최대 50글자 내외로 전체 내용을 요약해서 알려줘. 재판의 결과, 소송 배경, 사고 유형, 상병의 명칭, 판결의 이유가 포함돼야해.
    summarizedContents : {
        p : String, // 원고가 누구인지 10글자 내로 알려줘.
        d : String, // 피고가 누구인지 10글자 내로 알려줘.
        result : String, // 누가 승소했는지, 누가 패소했는지 20글자 내로 요약해줘
        background: String, // 소가 왜 제기되었는지 배경에 대해 100글자 내외의 완전한 문장으로 요약해
        issue : String, // 재판의 쟁점을 100글자 내외의 완전한 문장으로 요약해
        reason : String, // 재판의 쟁점에 대해 주문(결정)이 내려진 이유를 100글자 내외의 완전한 문장으로 요약해
    }
}
'''

@functions_framework.http
def hello_http(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    # CORS Preflight 요청 처리
    if request.method == 'OPTIONS':
        return ('', 204, headers)
    

    request_json = request.get_json(silent=True)
    content = request_json['content']

    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"{content}\n{rule}"
    response = model.generate_content(prompt)

    # 받은 JSON 데이터를 그대로 반환
    if response and response.text:
        return (response.text, 200, headers)
    else:
        return ({'error': 'Invalid generated data'}, 400, headers)
