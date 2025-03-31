import pdfplumber


def extract_pdf_text(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            print(page.extract_text())
