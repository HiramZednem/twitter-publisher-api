#!/bin/bash
PROJECT_ID="modular-glider-449518-b9"
REGION="us-central1"
SERVICE_NAME="twitter-publisher"

# Set the Google Cloud project
gcloud config set project $PROJECT_ID

# Deploy the application to Google Cloud Run
gcloud run deploy $SERVICE_NAME \
  --source . \
  --project $PROJECT_ID \
  --region $REGION \
  --allow-unauthenticated \

# Check deployment status
if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed."
  exit 1
fi