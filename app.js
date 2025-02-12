async function startSearch() {
  const collegeName = document.getElementById('college-input').value;
  if (!collegeName) return alert('Please enter a college name');

  try {
    // Construct the Google Images search URL
    const googleImagesUrl = `https://www.google.com/search?q=${encodeURIComponent(collegeName)}&tbm=isch`;

    // Use a proxy service to bypass CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(googleImagesUrl)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();

    // Parse the HTML content to extract image URLs
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');
    const imageElements = doc.querySelectorAll('img');
    const imageUrls = Array.from(imageElements)
      .map(img => img.src)
      .filter(src => src.startsWith('http')); // Filter out invalid URLs

    flashImages(imageUrls.slice(0, 200)); // Limit to 200 images
  } catch (error) {
    console.error('Error fetching images:', error);
    alert('Failed to fetch images. Please try again.');
  }
}

function flashImages(imageUrls) {
  const container = document.getElementById('image-container');
  let index = 0;

  function showNextImage() {
    if (index >= imageUrls.length) index = 0; // Loop back to the start

    const img = document.createElement('img');
    img.src = imageUrls[index];
    img.onload = () => {
      container.appendChild(img);
      setTimeout(() => {
        img.style.opacity = 1;
        setTimeout(() => {
          img.style.opacity = 0;
          setTimeout(() => {
            container.removeChild(img);
            index++;
            showNextImage();
          }, 200); // Delay before removing the image
        }, 500); // Time the image stays visible
      }, 100); // Delay before fading in
    };
  }

  showNextImage();
}
