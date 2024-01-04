import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

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
// Get the MongoDB connection URI from environment variables
// Get the MongoDB connection URI from environment variables
const mongodbURI = process.env.MONGODB_URI;

if (!mongodbURI) {
  console.error('MongoDB connection URI is not defined');
  process.exit(1);
}


// Define the MongoDB schema and model
const categorySchema = new mongoose.Schema({
  title: String,
  id: String,
  prompt: String,
});

const Category = mongoose.model('Category', categorySchema, 'categories');

// Connect to MongoDB
mongoose
  .connect(mongodbURI)
  .then(async () => {
    // Get the list of collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    console.log('Collections:', collectionNames);

    console.log('Connected to MongoDB');
    app.get('/categories/', async (req, res) => {
      try {
        console.log('categories');
        const categories = await Category.find({}).catch((error) => {
          console.error('Error retrieving categories:', error);
        });        
        console.log('Retrieved categories:', categories);
        res.status(200).json(categories);
      } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ message: 'An error occurred while retrieving categories.' });
      }
    });


    app.get('/category/:id', async (req, res) => {
      try {
        const category = await Category.findOne({ id: req.params.id }) as any;
        console.log('category', category);
      
        if (category) {
          // Process the category data and generate additional content if needed
          const image = await generateImageFromPrompt(category.title);
          const title = await generateContentFromPrompt(category.prompt);
          const video = await generateVideoBasedOnPrompt(category.prompt);
          const result = await generateVoice(category.prompt);
      
          // // Combine the generated content with the category data
          const categoryData = {
            ...category.toObject(),
            image,
            title,
            video,
            result,
          };

          // const categoryData2 = {
          //   "_id": "649481f7bcfc554985a7742d",
          //   "title": "The Future of Car Ownership: Subscription Services and Shared Mobility",
          //   "id": "3818a6b7-0a01-4d06-936f-36129708ac26",
          //   "prompt": "Car ownership is evolving with subscription services and shared mobility. Discuss the future of car ownership and the rise of innovative transportation models.",
          //   "image": "https://images.unsplash.com/photo-1467489904517-075c242c2b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTk2NTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODc0NTQ3MDR8&ixlib=rb-4.0.3&q=80&w=1080",
          //   "result": {
          //       "signedUrl": "https://storage.googleapis.com/ai-content-creator/car-ownership-is-evolving-with-subscription-services-and-shared-mobility-discuss-the-future-of-car-ownership-and-the-rise-of-innovative-transportation-models-1687454707287.mp3?GoogleAccessId=api-project%40api-project-108888684492.iam.gserviceaccount.com&Expires=1740816000&Signature=SIZaK5Z6DqiMNuRV76kOH5Z10i96WfA8Q0wP286p34%2FaEy2R1Z20iQWWEpyB87%2Bk0HqPY4aVhmf65d1zdl9AH%2BiZf0ItT4Gy%2Bg2%2F3jgNRHIJVQWQLJPWzyC3FagErC1BlNbujfE65XESIXP0Z4%2F76bu6PRA5KZMgnesbYDUmPtn8xjBQQ%2FgGbKt%2FEnXPnodIVj9D19DR4Hi52XVpUXKUOTAwrcWV0fDBn95aY1Imz12bhUcckp05DzPVOLT6UBUROMJj1OBKTcWyZR%2FYP236tipjnD13FcMGV%2B9%2BTKMQzpYZsklam%2Bn9ILJd1nffaQpMUP4QeSVlUTfojQluZ%2BK55w%3D%3D",
          //       "text": "Car ownership is evolving, with subscription services and shared mobility on the rise. This trend is driven by a variety of factors, including the increasing cost of ownership, the convenience of alternative transportation options, and the desire for more sustainable living.\n\nAs ownership models change, so too does the way we use and interact with our cars. In the future, we will see a shift from private ownership to shared ownership and usage, as well as an increase in the use of alternative transportation options such as electric scooters and bikes.\n\nThe rise of subscription services and shared mobility is changing the car ownership landscape and giving rise to more sustainable and convenient transportation options."
          //   }

          
          res.status(200).json({ message: categoryData });
        } else {
          res.status(404).json({ message: 'Category not found' });
        }
      } catch (error) {
        console.error('Error retrieving category:', error);
        res.status(500).json({ message: `An error occurred while retrieving the category - ${error}` });
      }
    });


  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });



//
app.post('/generate-suggestions', async (req, res) => {

  const { topic } = req.body;

  if (!topic) return res.status(400).json({ message: 'Please provide a topic.' });

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
