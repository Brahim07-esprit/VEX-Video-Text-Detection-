document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM content loaded");  // Debug line

    const video = document.getElementById('videoPlayer');
    const canvas = document.getElementById('canvasOverlay');
    const ctx = canvas.getContext('2d');
    const detectTextButton = document.getElementById('detectText');
    const clearButton = document.getElementById('clearCanvas');

    // Fetch the video from the server
    fetch('/video')
        .then(response => response.blob())
        .then(blob => {
            var url = URL.createObjectURL(blob);
            video.src = url;
        })
        .catch(error => console.error('Error fetching video:', error));

    clearButton.addEventListener('click', function () {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Remove any existing 'Copy' options
        if (copyOption) {
            copyOption.remove();
        }
        // Make the canvas non-interactive again
        canvas.style.pointerEvents = 'none';
        // Resume video playback if needed
        video.play();
    });

    function updateCanvasSize() {
        // Explicitly set canvas dimensions based on your CSS
        canvas.width = 1300; // Width as per your CSS
        canvas.height = (1300 / video.videoWidth) * video.videoHeight; // Keep aspect ratio
    }

    video.addEventListener('loadedmetadata', updateCanvasSize);
    window.addEventListener('resize', updateCanvasSize);

    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let detectedTextData;
    let copyOption;

    canvas.style.pointerEvents = 'none'

    video.addEventListener('pause', function () {
        detectTextButton.style.display = "inline-block";
        clearButton.style.display = "inline-block";
    });

    detectTextButton.addEventListener('click', function () {
        canvas.style.pointerEvents = 'auto'
        updateCanvasSize();
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/png');


        // Fetch detected text regions
        fetch('/detect_text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image_data: frameData })
        }).then(response => response.json())
            .then(data => {
                detectedTextData = data;
            });

        // Remove any existing copy option before drawing a new one
        if (copyOption) {
            copyOption.remove();
        }

        canvas.addEventListener('mousedown', function (e) {
            startX = e.clientX - canvas.getBoundingClientRect().left;
            startY = e.clientY - canvas.getBoundingClientRect().top;
            isDrawing = true;
        });

        canvas.addEventListener('mousemove', function (e) {
            if (!isDrawing) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const x = e.clientX - canvas.getBoundingClientRect().left;
            const y = e.clientY - canvas.getBoundingClientRect().top;

            ctx.strokeStyle = '#0AF';

            ctx.lineWidth = 2;

            ctx.strokeRect(startX, startY, x - startX, y - startY);
        });

        canvas.addEventListener('mouseup', function (e) {
            isDrawing = false;
            const x = e.clientX - canvas.getBoundingClientRect().left;
            const y = e.clientY - canvas.getBoundingClientRect().top;

            if (Math.abs(x - startX) > 0 && Math.abs(y - startY) > 0) {
                // Remove the previous copy button if it exists
                if (copyOption) {
                    copyOption.remove();
                }

                // Create a new 'Copy' option element
                copyOption = document.createElement('div');
                copyOption.innerHTML = 'Copy';
                copyOption.style.position = 'absolute';
                copyOption.style.left = `${x}px`;
                copyOption.style.top = `${y}px`;
                copyOption.style.backgroundColor = 'white';
                copyOption.style.border = '1px solid black';
                copyOption.style.padding = '5px';
                copyOption.style.cursor = 'pointer';

                // Append it to the canvas' parent (so it's positioned relative to the video player)
                video.parentNode.appendChild(copyOption);

                // Add click event for the 'Copy' option
                copyOption.addEventListener('click', function () {
                    // Handle the copying logic here
                    fetch('/extract_text_in_rectangle', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            image_data: frameData,
                            rect: {
                                x: Math.round(startX),
                                y: Math.round(startY),
                                width: Math.round(x - startX),
                                height: Math.round(y - startY)
                            }
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Data received from server: ", data);
                            if (data.text) {
                                navigator.clipboard.writeText(data.text);
                            }
                            // Remove the 'Copy' option after copying
                            copyOption.remove();
                        })
                        .catch(error => console.error('Error:', error));
                });
            }
        });

    });

    video.addEventListener('play', function () {
        detectTextButton.style.display = 'none';
        clearButton.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.style.pointerEvents = 'none'
    });
});
