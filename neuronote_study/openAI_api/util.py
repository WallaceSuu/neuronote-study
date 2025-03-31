import openai
from api.models import *


def getPDFInfo(user_key):
    pdf_list = uploadPDF.objects.filter(user=user_key)
    pdf_info = []
    if not pdf_list.exists():
        return {"error": "No PDFs found"}
    for pdf in pdf_list:
        pdf_info.append({"pdf_file": pdf.pdf_file, "pdf_name": pdf.pdf_name, "key": pdf.pdf_key})
    return pdf_info


