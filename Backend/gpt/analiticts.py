from helper.gpt import call_gpt
from helper.utils import convert_to_json, convert_string_to_json




sample_output = [
  {
    
    "x-axis": "field1",
    "y-axis": ["field2"],
    "type": "Bar Chart"
  },
  {
    
    "x-axis": "field1",
    "y-axis": ["field2", "field3"],
    "type": "Line Chart"
  }
]

def get_analitics(sample_data):

    print("sample_data",sample_data)
    # Prepare the prompt for OpenAI
    prompt = f"""
        Analyze the following dataset and identify combinations of fields that can be used to create various types of charts. For each combination, provide the following:

        The type of chart (e.g., pie chart, bar chart, line chart).
        Dataset:
        {sample_data}
        Guidelines:
        - The dataset may contain multiple fields.
        - The fields can be used to create different types of charts.
        - The output should include the type of chart and the fields that can be used to create it.
        - The output should be in JSON format.
        - The output should include at least two different combinations of fields and chart types.
        - The output should be based on the dataset provided.
        - only a json data no extra text
        -strict format of the  Output:
        {sample_output}


    """
    # Call GPT to get the converted data
    response = call_gpt("You are a good analitics expart",prompt,1000)
    return response


def sample_result(result, sample_size=2):
                return result[:sample_size]

def getAnalitics(result):
    if isinstance(result, list):
        try:
            sampled_result = sample_result(convert_to_json(result))
            analitics_string = get_analitics(sampled_result)
            analitics = convert_string_to_json(analitics_string)
        except Exception as e:
            analitics = {"error": str(e)}
    else:
        analitics = {}
    return analitics
