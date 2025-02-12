async function startSearch() {
  const collegeName = document.getElementById('college-input').value;
  if (!collegeName) return alert('Please enter a college name');

  try {
    // Construct the Google Images search URL
    const googleImagesUrl = `https://www.google.com/search?q=${encodeURIComponent(collegeName)}&tbm=isch`;

    // Use CORS Anywhere as a proxy
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${googleImagesUrl}`;
    const response = await fetch(proxyUrl);
    const htmlText = await response.text();

    // Parse the HTML content to extract image URLs
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const imageElements = doc.querySelectorAll('img');
    const imageUrls = Array.from(imageElements)
      .map(img => img.dataset.src || img.src) // Extract from data-src or src
      .filter(src => src && src.startsWith('http')) // Filter out invalid URLs
      .slice(0, 200); // Limit to 200 images

    if (imageUrls.length === 0) {
      throw new Error('No images found');
    }

    flashImages(imageUrls);
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
