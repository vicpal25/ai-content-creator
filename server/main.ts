import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import { downloadFromGoogleStorage, generateVoice, generateSuggestionsFromPrompt } from './utils';

dotenv.config();

const app = express();
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

const categories = [{ title: 'Ford Mustang Vs. Chevrolet Camaro.', id: '078c9fa9-7614-4d17-8fb7-017325bcc5c3', prompt: 'Ford Mustang Vs. Chevrolet Camaro.' },
{ title: 'Can an F1 car beat an Tesla Plaid?', id: '078c9fa9-7614-4d17-8fb7-017325bcc5c3', prompt: 'F1 vs. Tesla Plaid?' },
{ title: 'Corvette ZR1 vs. Ford GT00', id: 'f699f12a-9094-42f7-bd8b-cbf964282207', prompt: 'Corvette ZR1 vs. Ford GT00' }];

app.get('/categories/', async (req, res) => {

  res.status(200).json(categories);
});

app.get('/category/:id', async (req, res) => {

  const category = categories.find(c => c.id === req.params.id);
  console.log('category', category?.prompt);

  if (category) {
    const result = await generateVoice(category.prompt);

    res.status(200).json({ message: result });
    // res.status(200).json({
    //   "message": {
    //   "signedUrl": "https://storage.googleapis.com/ai-content-creator/corvette-zr1-vs-ford-gt00-1686165692096.mp3?GoogleAccessId=api-project%40api-project-108888684492.iam.gserviceaccount.com&Expires=1740816000&Signature=kvBnr3rZQI39YU%2BV0TrVjxzoOjqbee%2FmjPF8HxoobBPSzXC5ngfl9E9KgPqoalsgL9kNCBjc6lZU4fOj7I9Kff2t9ebvvxubeBhsrYMGf57smDsDhx%2FdCo1E3WnMk6Nyv0XZ7ruEu0WmtEA7MDZcyouGTl%2BPhksH1MsnAcXJ6qgHdOdaxIIaUL%2BrVE4OSVm3j0xzGHq6Pvjxt9H6psqek0011JcPt5PLMaQ8GZ9JtkswWUvOXn1Wtze%2Fvkua79ToNx6%2B520L4AFw%2BVSSkyPknrmQrYBl62R2WME%2FV0YsIpU1BTdYV7uqmORqrrPZw6gkE%2FyMXcDjDkPaPS6pITe%2BrA%3D%3D",
    //   "text": "The 2019 Chevrolet Corvette ZR1 is a two-seat sports car that delivers staggering performance. It's powered by a supercharged 6.2-liter V8 engine that generates 755 horsepower and 715 pound-feet of torque. A seven-speed manual transmission is standard, and an eight-speed automatic is optional.\n\nThe 2019 Ford GT is a two-seat supercar that's offered in two trims: the standard and the GT Mullin Roadster. The GT is powered by a mid-mounted, twin-turbocharged 3.5-liter V6 engine that generates 647 horsepower and 550 pound-feet of torque. A seven-speed dual-clutch automatic transmission is the only gearbox offered.\n\nThe Corvette ZR1 is significantly faster than the Ford GT, with a zero-to-60 mph time of 3.1 seconds, compared to the GT's time of 3.5 seconds. The ZR1 also has a higher top speed, at 212 mph, while the GT is limited to 216 mph.\n\nThe GT is more luxurious than the ZR1, with standard features that include Nappa leather upholstery, an eight-speaker audio system, and a 10.0-inch touch screen. The ZR1's interior is more spartan, with synthetic leather upholstery and a smaller 8.0-inch touch screen.\n\nThe Corvette ZR1 starts at $119,995, while the Ford GT has a base price of $450,000.\n\nThe Corvette ZR1 is a sports car that offers staggering performance, thanks to its supercharged V8 engine. It's significantly faster than the Ford GT, with a zero-to-60 mph time of just 3.1 seconds. The ZR1 also has a higher top speed, making it the better choice for drivers who want to push their car to the limit. However, the GT is more luxurious, with a higher-quality interior that features Nappa leather upholstery and a larger touch screen. It's also significantly more expensive, with a base price of $450,000."
    //   }
    //   });
  }

});

//
app.post('/generate-suggestions', async (req, res) => {

  const { topic } = req.body;

  if(!topic) return res.status(400).json({ message: 'Please provide a topic.' });

  try {
    const formattedTopic = `Provide a topic of: ${topic} in JSON format.`;
    console.log('formattedTopic', formattedTopic);    
    // Generate content using OpenAI's GPT-3
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
