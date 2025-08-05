from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from .core.logic import rag_processor, FinalResponse 

router = APIRouter()

# --- THIS IS THE FIX ---
# We have REMOVED 'response_model=FinalResponse' to prevent the version conflict.
@router.post("/process")
async def process_document_and_get_answer(
    query: str = Form(...),
    file: UploadFile = File(...)
):
    """Accepts a PDF document and a text query, returning a structured JSON answer."""
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        file_bytes = await file.read() 
        result = rag_processor.process_document_and_query(file_bytes=file_bytes, query=query)
        
        # This part is still correct - we return a simple dictionary.
        return result.dict()

    except Exception as e:
        import traceback
        print("---! PYTHON SERVER ERROR !---")
        traceback.print_exc()
        print("---------------------------")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")