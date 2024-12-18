import os
import json
from helper.gpt import call_gpt
import pandas as pd

def get_config():
    try:
        with open(os.path.join(os.path.dirname(__file__), '../string/const.json'), 'r') as file:
            gpt_config = json.load(file)
            return gpt_config
    except FileNotFoundError:
        print("Configuration file not found.")
    except json.JSONDecodeError:
        print("Error decoding JSON from the configuration file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def convert_string_to_json(input_string):
    # Replace the newline character '\n' and other formatting issues to make it a valid JSON string
    input_string = input_string.replace("'", '"').replace('\n', '').strip()
    
    try:
        # Parse the string into JSON format
        json_data = json.loads(input_string)
        return json_data
    except json.JSONDecodeError as e:
        return f"Error in decoding JSON: {str(e)}"

def extract_keywords(user_question):
    try:
        config = get_config()
        if config is None:
            return None
        sql_query_string = config.get('gpt').get('extract_keyword')
        prompt = f"Extract the exact key words from the following prompt:\n\n{user_question}\n\nKeywords:"
        keywords = call_gpt(sql_query_string, prompt)
        return keywords
    except AttributeError:
        print("Error accessing configuration data.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def convert_xlsx_to_csv():
        data_folder = os.path.join(os.path.dirname(__file__), '../data')
        for file_name in os.listdir(data_folder):
            if file_name.endswith(".xlsx"):
                xlsx_file = os.path.join(data_folder, file_name)
                csv_file = os.path.join(data_folder, file_name.replace(".xlsx", ".csv"))
                try:
                    df = pd.read_excel(xlsx_file)
                    df.to_csv(csv_file, index=False)
                    print(f"Converted {xlsx_file} to {csv_file}")
                except Exception as e:
                    print(f"Error converting {xlsx_file} to CSV: {e}")


def convert_to_json(data):
    if not isinstance(data, list):
        return data
    if not data or len(data) < 2:
        return data
    
    headers = data[0]  # Extract the headers (first row)
    rows = data[1:]    # Extract the data rows
    
    # Create a list of dictionaries using headers as keys
    result = [dict(zip(headers, row)) for row in rows]
    
    return result



def add_query_to_json(new_query):
    try:
        json_file_path = os.path.join(os.path.dirname(__file__), '../query_storage/query.json')
        
        # Read the existing data from the JSON file
        if os.path.exists(json_file_path):
            with open(json_file_path, 'r') as file:
                data = json.load(file)
        else:
            data = []

        # Add the new query to the data
        data.append(new_query)

        # Write the updated data back to the JSON file
        with open(json_file_path, 'w') as file:
            json.dump(data, file, indent=4)
        
        print("Query added successfully.")
    except FileNotFoundError:
        print("Query file not found.")
    except json.JSONDecodeError:
        print("Error decoding JSON from the query file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")