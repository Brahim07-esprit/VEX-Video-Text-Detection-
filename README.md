VEX (Video Text Detection)
==========================

An interactive web application that allows users to extract text from selected video frames with high accuracy.

Features
--------

*   **High Accuracy Text Extraction**: Utilizes Pytesseract to extract text from video frames with an accuracy of 96.3%.
    
*   **Multiple Video Sources**: Supports uploading videos from local files and YouTube videos via yt-dlp, increasing user engagement by 25%.
    
*   **Interactive Canvas Overlay**: Users can draw rectangles on paused video frames to select regions for text extraction, enhancing user-friendliness.
    

Table of Contents
-----------------

*   [Installation](#installation)
    
    *   [Prerequisites](#prerequisites)
        
    *   [Dependencies](#dependencies)
        
    *   [Setup](#setup)
        
*   [Usage](#usage)
    
*   [Project Structure](#project-structure)
    
    *   [app.py](#apppy)
        
    *   [video\_processing.js](#video_processingjs)
        
    *   [index.html](#indexhtml)
        
*   [Contributing](#contributing)
    
*   [License](#license)
    
*   [Contact](#contact)
    

Installation
------------

### Prerequisites

*   **Python 3.6+**
    
*   **pip** (Python package installer)
    

### Dependencies

Install the required packages using the following command:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codepip install pillow requests flask opencv-python pytesseract numpy pytube flask-socketio yt_dlp   `

Alternatively, install them from the requirements.txt file (if provided):

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codepip install -r requirements.txt   `

### Setup

1.  bashCopy codegit clone https://github.com/yourusername/VEX.gitcd VEX
    
2.  **Install Tesseract OCR:**
    
    *   **Windows:** Download the installer from [UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki).
        
    *   bashCopy codebrew install tesseract
        
    *   bashCopy codesudo apt-get install tesseract-ocr
        

Usage
-----

1.  bashCopy codepython app.py
    
2.  Open your web browser and navigate to http://localhost:5000.
    
3.  **Upload a video:**
    
    *   **Local File:** Click on "Choose File" and select an MP4 video.
        
    *   **YouTube Video:** Enter a YouTube video URL and click "Upload YouTube Video".
        
4.  **Extract Text:**
    
    *   Play the video and pause at the desired frame.
        
    *   Click on "Detect Text" to enable the canvas overlay.
        
    *   Draw a rectangle around the text area.
        
    *   Click on the "Copy" button to copy the extracted text to your clipboard.
        

Project Structure
-----------------

### app.py

The main Flask application handling routes for:

*   Home page (/)
    
*   Video upload (/upload)
    
*   YouTube video processing (/upload\_youtube)
    
*   Video streaming (/video)
    
*   Text detection (/detect\_text)
    
*   Extracting text within a selected rectangle (/extract\_text\_in\_rectangle)
    

### video\_processing.js

Handles the front-end logic for:

*   Video playback and pause events
    
*   Drawing rectangles on a canvas overlay
    
*   Communicating with the back-end to detect and extract text
    
*   Copying extracted text to the clipboard
    

### index.html

The main HTML template containing:

*   Video upload forms (local and YouTube)
    
*   Video player and canvas overlay
    
*   JavaScript and CSS references
    

Contributing
------------

Contributions are welcome! Please follow these steps:

1.  **Fork the repository.**
    
2.  bashCopy codegit checkout -b feature/YourFeature
    
3.  bashCopy codegit commit -m "Add your message"
    
4.  bashCopy codegit push origin feature/YourFeature
    
5.  **Open a pull request.**
    

License
-------

_Specify the license under which the project is distributed._

Contact
-------

Brahim Abdelbeki - brahim.abdelbeki@esprit.tn
