# GCP Cloud Functions

This directory cotnains codes(files) used on GCP Cloud Functions Service

(Now Cloud Functions replaced with Cloud Run Function. Anyway still the legacy product works).

## Why this directory is provided

`sanjae-gemma` uses 2 cloud function services as an AI service caller to hide secrets

When you need to create your Cloud Function Service on GCP, you can use the files as a template.

## Services

- Summarization : It takes original long texts, and call Google Gemini API to summarize them.
- Analysis : It takes user inputs, then call Hugging Face Inference Endpoints to make a analysis report.

## Usage

> `Python 3.12 (Ubuntu 22 Full)` environment is recommended.

1. Open GCP Console, Create your Cloud Function (or, Cloud Run Function)
2. Copy-Paste each service directories' files. (main.py and requirements.txt)
3. Deploy your Cloud Function Service
4. Use your endpoint from the Cloud Function Service
