import functions_framework
import requests

######################################
# Use your Hugging Face(HF) URL, KEY
######################################

API_URL = '<YOUR HF Inference Endpoints URL>'
# e.g., "https://something.us-east-1.aws.endpoints.huggingface.cloud"
API_KEY = '<YOUR HF Inference Endpoints KEY(Secret)>'
# e.g., "hf_something"

######################################

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
    
    # POST 요청으로 받은 JSON 데이터를 파싱
    print('request : ', request)
    request_json = request.get_json(silent=True)
    print('request_json: ', request_json)
    res_data = {}
    user_input=request_json['freeResponse']
    
    hf_headers = {
        "Accept" : "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json" 
    }


    rule = '''user의 입력으로 어떤 사람이 산업재해 불승인 처분을 받고 작성한 사례가 주어질 것이다.
산업재해보험은 업무상 관계가 있는 상황에서 사고를 당한 경우에 승인 처분을 내리고, 그렇지 않으면(예시:개인적인 사유) 불승인 처분을 내린다.
앞으로 입력으로 주어질 사례가 사고가 업무상 관계가 있는지를 근거로 산업재해 불승인 처분이 적절한지 아닌지 결정하여 아래 양식의 json객체를 1개 생성하시오.
{
"issue" : 소송 쟁점(불승인, 승인 여부를 가르는 요인), // 답변 형태 : 200자 내의 String
"is_correct" : 불승인 처분이 적절하면 true이고 승인처분이 적절하면 false, // 답변 형태 : Bool. true 또는 false
"reason" : 불승인이 올바른(또는 승인이 올바른) 근거 // 답변 형태 : 200자 내의 String
}
    '''
    prompt = f"{rule}\n사례: {user_input}"
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 2048,
            "handle_long_generation": "hole"
        }
    }
    response = requests.post(API_URL, headers=hf_headers, json=payload)
    # inference endpoints 자고있다가 init시작했을 때. 프론트에서 10분 기다리라고 하기.
    if response.status_code == 503:
        return ("NOT_AVAILABLE", 200, headers)

    output = response.json()
    output = output[0]['generated_text'][len(prompt):]
    
    # return

    # 받은 JSON 데이터를 그대로 반환
    if output:
        return (output, 200, headers)
    else:
        return ({'error': 'Invalid JSON data'}, 400, headers)

