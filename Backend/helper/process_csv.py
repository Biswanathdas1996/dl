import pandas as pd
from fpdf import FPDF

def csv_to_pdf(input_csv, output_pdf, col1, col2):
    # Load the CSV file
    try:
        data = pd.read_csv(input_csv, encoding="utf-8")
    except Exception as e:
        print(f"Error loading CSV file: {e}")
        return

    # Check if the specified columns exist
    if col1 not in data.columns or col2 not in data.columns:
        print(f"Columns '{col1}' and/or '{col2}' not found in the CSV file.")
        return

    # Extract the specified columns
    extracted_data = data[[col1, col2]]

    # Create a PDF instance
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Set font
    pdf.set_font("Arial", size=12)

    # Add title
    pdf.set_font("Arial", size=14, style="B")
    pdf.cell(200, 10, txt="Extracted Data", ln=True, align="C")
    pdf.ln(10)  # Add a line break

    # Add column headers
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(95, 10, txt=col1, border=1, align="C")
    pdf.cell(95, 10, txt=col2, border=1, align="C")
    pdf.ln()

    # Add rows
    pdf.set_font("Arial", size=12)
    for _, row in extracted_data.iterrows():
        pdf.cell(95, 10, txt=str(row[col1]), border=1)
        pdf.cell(95, 10, txt=str(row[col2]), border=1)
        pdf.ln()

    # Output the PDF
    try:
        pdf.output(output_pdf)
        print(f"PDF saved as {output_pdf}")
    except Exception as e:
        print(f"Error saving PDF file: {e}")

# Example usage
input_csv = "MEL___PL_BAU_1.csv"  # Input CSV file
output_pdf = "output.pdf"  # Output PDF file
column1 = "Summary"  # Name of the first column to extract
column2 = "Description"  # Name of the second column to extract

csv_to_pdf(input_csv, output_pdf, column1, column2)
