import { Storage } from '@google-cloud/storage';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { OpenAIApi, Configuration } from 'openai';
import path from 'path';
import util from 'util';
import fs from 'fs';

// Creates a client
const textToSpeechClient = new TextToSpeechClient();
// Create OpenAI configuration

// Create a Google Cloud Storage client
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const {GOOGLE_CLOUD_BUCKET_NAME} = process.env || 'ai-content-creator';

function slugyfy(text: string) {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// Function 1: Add two numbers
export function downloadFromGoogleStorage(a: number, b: number): number {
    return a + b;
}

export async function getSignedUrl(bucketName: string, remoteFileName: string) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(remoteFileName);
  
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2025', // Specify the expiration date or a duration in seconds
    });
  
    return url;
}

export async function generateVoiceFromParams(make: string, year: string, model: string) {

}

export async function generateSuggestionsFromPrompt(promptText: string) {

    const openAIConfig = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(openAIConfig);
    
    // Generate content using OpenAI's GPT-3
    const gpt3Response = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `Please generate some trending 2024 suggestions based on: ${promptText} and return them in JSON format.`,
        max_tokens: 500,
    });

    const aiResponse =  gpt3Response.data.choices?.[0]?.text?.trim() || '';
    const suggestions = aiResponse.split('\n').map((suggestion) => suggestion.trim()).filter((suggestion) => suggestion.length > 0);

    return suggestions;

}

export async function generateVoice(promptText: string) {

    try {
 
        const openAIConfig = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(openAIConfig);
        
        // Generate content using OpenAI's GPT-3
        const gpt3Response = await openai.createCompletion({
            model: 'text-davinci-002',
            prompt: `Write a comprehensive review about the following ${promptText}.`,
            max_tokens: 500,
        });

        const generatedText = gpt3Response.data.choices?.[0]?.text?.trim() || '';

        console.log('generatedText', generatedText);
        

        const request = {
            input: { text: generatedText },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: 'en-US', ssmlGender: 'MALE', name: 'en-US-Wavenet-D' },
            // Select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Performs the Text-to-Speech request
        const [response] = await textToSpeechClient.synthesizeSpeech(request as any);
        // Generate a unique filename for each request
        const fileName = `${slugyfy(promptText)}-${Date.now()}.mp3`;
        const outputPath = path.join(__dirname, 'output', fileName);

        const writeFile = util.promisify(fs.writeFile);
        await writeFile(outputPath, response.audioContent as unknown as string, 'binary');

        // Upload the file to Google Cloud Storage
        const bucketName = GOOGLE_CLOUD_BUCKET_NAME || 'ai-content-creator';
        await storage.bucket(bucketName).upload(outputPath, {
            gzip: true,
            destination: fileName,
        });

        const signedUrl = await getSignedUrl(bucketName, fileName);
        console.log('Audio content generated and uploaded to Google Cloud Storage.');

        return {
            'signedUrl' : signedUrl,
            'text': generatedText

        };
    } catch (error) {
        console.error('Error:', error);
        return 'An error occurred during content generation and upload.';
    }

}
