Authentication & User Management
    Register with an existing username or email (should show error). ✓
    Register with missing fields (should show error). ✓
    Login with wrong credentials (should show error). ✓
    Password reset with non-existent email (should show generic success message). ✓
    Password reset with valid email (should send email). ✓
    Change password with wrong current password (should show error). 
    Change password to a weak password (should show error).
    Change username to an existing username (should show error). ✓
    Change username more than once per week (should show error). ✓
PDF Upload & Processing
    Upload a PDF larger than the allowed size (should show error).
    Upload a non-PDF file (should show error).
    Upload a corrupted PDF (should show error or handle gracefully).
    Upload a PDF with no text content (should handle gracefully).
Notes, Flashcards, and Sidebar
    Try to view notes/flashcards when not logged in (should redirect or show message).
    Try to add a note/flashcard with empty content (should show error).
    Try to add a note/flashcard with only whitespace (should show error).
    Try to add a note/flashcard with extremely long content (should handle gracefully).
    Try to delete a note/flashcard that doesn’t exist (should show error).
    Try to access a note/flashcard that belongs to another user (should not allow).
    Try to add the same note/flashcard multiple times (should handle gracefully).
Profile Page
    No PDFs/notes/flashcards (should show “No previous ...” message).
    Exactly 1, 2, or 3 PDFs/notes/flashcards (should display correctly).
    More than 3 PDFs/notes/flashcards (should only show 3, or handle overflow).
    User with a very long username or email (should not break layout).
General UI/UX
    Rapidly click buttons (e.g., upload, save, delete) (should not cause duplicate actions or errors).
    Navigate away during an upload or save (should not break app).
    Resize window to mobile size (should remain responsive).
    Try to access protected routes without authentication (should redirect or show message).
API & Backend
    API returns 500 error (should show user-friendly error).
    API returns slow response (should show loading spinner).
    API returns malformed data (should handle gracefully).
    Database connection lost (should show error).
Email
    Email sending fails (SMTP down, wrong credentials) (should log error, show user-friendly message).
    User tries to use expired password reset link (should show error).
    User tries to use already-used password reset link (should show error).
Security
    Try to access another user’s data via API (should be forbidden).
    Try to upload a file with malicious content (should be rejected).
    Try to perform actions with an expired or invalid token (should require re-login).
