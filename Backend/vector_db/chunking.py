import fitz  # PyMuPDF for PDF text extraction
from chromadb.config import Settings

import os
from flask import Flask


# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    document = fitz.open(pdf_path)
    text = ""
    for page_num in range(document.page_count):
        page = document.load_page(page_num)
        text += page.get_text()
    # return text
   
    text_with_page_numbers = []
    for page_num in range(document.page_count):
        page = document.load_page(page_num)
        text_with_page_numbers.append({"page": page_num + 1, "data": page.get_text()})
    return text_with_page_numbers

# Function to chunk the extracted text into smaller pieces
def chunk_text(text, chunk_size=500):
    chunks = []
    words = text.split()
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks



def files_processing(files, folder_path):
    if not files:
        return 
    
    files_data = []
    for file in files:
        if file.filename == '':
            continue

        # Save file to uploads folder
        file_path = os.path.join(folder_path, file.filename)
        file.save(file_path)

        # Read content from the file (for simplicity, assuming text files)
        texts = extract_text_from_pdf(file_path)
        files_data.append({"filename": file.filename, "texts": texts}) 

        # Delete the file after processing
        os.remove(file_path)

    return files_data