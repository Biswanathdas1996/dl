from helper.utils import get_config
from helper.gpt import call_gpt
import os
from sql.index import get_erd

# Function to generate SQL query using OpenAI
def generate_sql_query(user_question, working_table_description):
    try:
        
       
        prompt = f"""
        Translate the following natural language query to SQL query: {user_question} '.
        Return only the SQL query without any additional text or explanation.
        
        Here is the schema of the database:
            {working_table_description}

        """
        # print(prompt)
        config = get_config()
        sql_query_string = config.get('gpt').get('generate_sql_query')
        print("sql_query_string",sql_query_string)
        query = call_gpt(sql_query_string, prompt, 500)
        return query.replace('\n', ' ').replace('\t', ' ').replace('```sql', '').replace('```', '')
    except Exception as e:
        print(f"An error occurred while generating the SQL query: {e}")
        return None


def nlq( user_question, working_table_description):
    try:
        query = generate_sql_query(user_question, working_table_description)
        print("Generated SQL Query:", query)
        return query
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return e