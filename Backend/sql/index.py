import sqlite3
import pandas as pd
import os
import json

# Function to load CSV into a temporary SQLite database

def load_all_csv_to_sqlite():
    data_folder = os.path.join(os.path.dirname(__file__), '../data')
    try:
        conn = sqlite3.connect(':memory:')
        for file_name in os.listdir(data_folder):
            if file_name.endswith('.csv'):
                file_path = os.path.join(data_folder, file_name)
                table_name = os.path.splitext(file_name)[0]
                df = pd.read_csv(file_path)
                df.to_sql(table_name, conn, index=False, if_exists='replace')
        return conn
    except Exception as e:
        print(f"Error loading CSV files to SQLite: {e}")
        return None

def get_table_headers(table_name, conn):
    try:
        cursor = conn.cursor()
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [info[1] for info in cursor.fetchall()]
        headers = ", ".join(columns)
        return headers
    except Exception as e:
        print(f"Error getting table headers: {e}")
        return None
    
def get_erd():
    try:
        with open(os.path.join(os.path.dirname(__file__), '../data/ERD/data.json'), 'r') as file:
            gpt_config = json.load(file)
            return gpt_config
    except FileNotFoundError:
        print("Configuration file not found.")
    except json.JSONDecodeError:
        print("Error decoding JSON from the configuration file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
  
    
def delete_temp_table(conn, table_name):
    try:
        cursor = conn.cursor()
        cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
        conn.commit()
    except Exception as e:
        print(f"Error deleting temp table: {e}")



# Function to execute SQL query and return results
def execute_query(query):
    print("Executing query:", query)
    try:
        conn = load_all_csv_to_sqlite()
        cursor = conn.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        result_with_headers = format_sql_result(result, conn, query)
        conn.close()    
        return result_with_headers
        
    except Exception as e:
        print(f"Error executing query: {e}")
        return None


def format_sql_result(result,conn, query):
    if not result:
        return None
    if len(result) == 1 and len(result[0]) == 1:
            return result[0][0]
        
    table_name = query.split()[query.split().index('FROM') + 1]
    headers = get_table_headers(table_name, conn)
    if headers is None:
        raise ValueError(f"Could not get headers for table: {table_name}")
    result_with_headers = [headers.split(", ")] + result
    delete_temp_table(conn, table_name)
    if 'JOIN' in query.upper():
        joined_table_name = query.split()[query.split().index('JOIN') + 1]
        joined_headers = get_table_headers(joined_table_name, conn)
        if joined_headers is None:
            raise ValueError(f"Could not get headers for joined table: {joined_table_name}")
        headers += ", " + joined_headers
        result_with_headers = [headers.split(", ")] + result
    return result_with_headers

