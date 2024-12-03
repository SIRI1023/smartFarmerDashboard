The Smart Farmer Dashboard is an integrated platform designed to assist farmers in making informed decisions by providing comprehensive analyses of crops, weather, and soil data.

Frontend: Developed with React.js for a responsive user interface.
Backend: Developed using Node.js and Express.js
Storage: Utilizes Supabase(bult on Postgres) Storage for efficient image storage and retrieval.

1. Crop Analysis: 
Functionality: Enables farmers to upload crop images for health assessment, utilizing machine learning models to detect diseases and provide actionable recommendations.
Technologies:
Machine Learning Integration:
Model Training:
Trained on datasets from sources like PlantVillage(https://github.com/spMohanty/PlantVillage-Dataset/tree/master/raw/color) using frameworks such as TensorFlow and Keras.
Deployment:
Models are containerized using Docker and deployed on Google Cloud Run for scalable inference.
PLEASE USE PLANTVILLAGE DATASET IMAGES FOR CROP ANALYSIS

2. Weather Analysis
Functionality: Provides real-time weather data and forecasts, offering recommendations on optimal farming activities based on weather patterns.
Technologies:
APIs: Integrates with external weather services like OpenWeatherMap for accurate information.

3. Soil Data Analysis
Functionality: Allows input of soil test results, providing recommendations on nutrient management and suitable crops.

4. History Feature
Functionality: Enables users to review past analyses and recommendations, tracking changes over time to assess the effectiveness of implemented strategies.

Deployment: Managed with Git and hosted on Vercel platform.

The Smart Farmer Dashboard leverages modern web technologies, machine learning, and integrated storage solutions like Supabase Storage to provide farmers with actionable insights, promoting efficient and sustainable agricultural practices.
