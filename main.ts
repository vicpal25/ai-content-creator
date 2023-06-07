import express from 'express';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { OpenAIApi, Configuration } from 'openai';
import fs from 'fs';
import util from 'util';
import dotenv from 'dotenv';
import path from 'path';
import { Storage } from '@google-cloud/storage';

dotenv.config();

const app = express();

// Creates a client
const textToSpeechClient = new TextToSpeechClient();

// Create OpenAI configuration
const openAIConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfig);

// Create a Google Cloud Storage client
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

app.get('/generate/:make/:year/:model', async (req, res) => {
  const { make, year, model } = req.params;

  try {
    // Generate content using OpenAI's GPT-3
    const gpt3Response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: `Write a comprehensive review about the ${year} ${make} ${model}.`,
      max_tokens: 500,
    });

    const generatedText = gpt3Response.data.choices?.[0]?.text?.trim() || '';

    const request = {
      input: { text: generatedText },
      // Select the language and SSML voice gender (optional)
      voice: { languageCode: 'es-US', ssmlGender: 'NEUTRAL' },
      // Select the type of audio encoding
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the Text-to-Speech request
    const [response] = await textToSpeechClient.synthesizeSpeech(request as any);
    // Generate a unique filename for each request
    const fileName = `${year}-${make}-${model}-${Date.now()}.mp3`;
    const outputPath = path.join(__dirname, 'output', fileName);

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputPath, response.audioContent as unknown as string, 'binary');

    // Upload the file to Google Cloud Storage
    const bucketName = 'ai-content-creator';
    await storage.bucket(bucketName).upload(outputPath, {
      gzip: true,
      destination: fileName,
    });

    res.status(200).json({ message: 'Audio content generated and uploaded to Google Cloud Storage.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred during content generation and upload.' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
