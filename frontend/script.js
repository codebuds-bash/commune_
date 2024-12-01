const uploadForm = document.getElementById('uploadForm');
const imageGallery = document.getElementById('imageGallery');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(uploadForm);
  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      const imgElement = document.createElement('img');
      imgElement.src = result.imageUrl;
      imgElement.alt = 'Uploaded Image';
      imgElement.style.width = '200px'; // Adjust as needed
      imgElement.style.margin = '10px';
      imageGallery.appendChild(imgElement);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
});
