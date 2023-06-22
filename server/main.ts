import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import { 
  downloadFromGoogleStorage, 
  generateVoice, 
  generateSuggestionsFromPrompt, 
  generateImageFromPrompt, 
  generateContentFromPrompt,
  generateVideoBasedOnPrompt
} from './utils';

dotenv.config();

const app = express();
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

const categories = [
{ title: 'Fastest V8 vs. Fastest Electric! Who wins?', id: '73c867c3-64db-436b-9074-ed7832febe31', prompt: 'Fastest V8 vs. Fastest Electric! Who wins?' },
{ title: 'Ford Mustang Vs. Chevrolet Camaro.', id: '178c9fa9-7714-4d17-8fb7-017325bcc5c3', prompt: 'Ford Mustang Vs. Chevrolet Camaro.' },
{ title: 'Can an F1 car beat an Tesla Plaid?', id: '078c9fa9-7614-4d17-8fb7-017325bcc5c3', prompt: 'F1 vs. Tesla Plaid?' },
{ title: 'Corvette ZR1 vs. Ford GT00', id: 'f699f12a-9094-42f7-bd8b-cbf964282207', prompt: 'Corvette ZR1 vs. Ford GT00' }];

app.get('/categories/', async (req, res) => {

  res.status(200).json(categories);
});

app.get('/category/:id', async (req, res) => {

  const category = categories.find(c => c.id === req.params.id);
  console.log('category', category?.prompt);

  if (category) {
    const image = await generateImageFromPrompt(category.title);
    const title = await generateContentFromPrompt(category.prompt);
    const video = await generateVideoBasedOnPrompt(category.prompt);
    const result = await generateVoice(category.prompt);

    Object.assign(result, { image, title, video });
    res.status(200).json({ message: result });
  }

});

//
app.post('/generate-suggestions', async (req, res) => {

  const { topic } = req.body;

  if(!topic) return res.status(400).json({ message: 'Please provide a topic.' });

  try {
    const formattedTopic = `Provide a topic of: ${topic} in JSON format.`;
    console.log('formattedTopic', formattedTopic);    
    const gpt3Response = await generateSuggestionsFromPrompt(formattedTopic);
    console.log('gpt3Response', gpt3Response);    
    return res.status(200).json({ message: gpt3Response });

  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred during content generation and upload.' });
  }
});



app.get('/generate/:make/:year/:model', async (req, res) => {
  const { make, year, model } = req.params;

  // try {
    // Generate content using OpenAI's GPT-3
  //   const gpt3Response = await openai.createCompletion({
  //     model: 'text-davinci-002',
  //     prompt: `Write a comprehensive review about the ${year} ${make} ${model}.`,
  //     max_tokens: 500,
  //   });

  //   const generatedText = gpt3Response.data.choices?.[0]?.text?.trim() || '';

  //   const request = {
  //     input: { text: generatedText },
  //     // Select the language and SSML voice gender (optional)
  //     voice: { languageCode: 'es-US', ssmlGender: 'NEUTRAL' },
  //     // Select the type of audio encoding
  //     audioConfig: { audioEncoding: 'MP3' },
  //   };

  //   // Performs the Text-to-Speech request
  //   const [response] = await textToSpeechClient.synthesizeSpeech(request as any);
  //   // Generate a unique filename for each request
  //   const fileName = `${year}-${make}-${model}-${Date.now()}.mp3`;
  //   const outputPath = path.join(__dirname, 'output', fileName);

  //   const writeFile = util.promisify(fs.writeFile);
  //   await writeFile(outputPath, response.audioContent as unknown as string, 'binary');

  //   // Upload the file to Google Cloud Storage
  //   const bucketName = 'ai-content-creator';
  //   await storage.bucket(bucketName).upload(outputPath, {
  //     gzip: true,
  //     destination: fileName,
  //   });

  //   res.status(200).json({ message: 'Audio content generated and uploaded to Google Cloud Storage.' });
  // } catch (error) {
  //   console.error('Error:', error);
  //   res.status(500).json({ message: 'An error occurred during content generation and upload.' });
  // }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
