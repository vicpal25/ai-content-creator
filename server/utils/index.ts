import { Storage } from '@google-cloud/storage';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { OpenAI } from 'openai';
import path from 'path';
import util from 'util';
import fs from 'fs';
import axios from 'axios';
require('dotenv').config();
// Creates a client
const textToSpeechClient = new TextToSpeechClient();
// Create OpenAI configuration

// Create a Google Cloud Storage client
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const { GOOGLE_CLOUD_BUCKET_NAME } = process.env || 'ai-content-creator';

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});


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

// export async function generateImageFromPrompt(promptText: string) {
//     const unsplashAccessKey = process.env.UNPLASH_ACCESS_KEY;

//     try {
//         const response = await axios.get(`https://api.unsplash.com/photos/random?query=${promptText}&client_id=${unsplashAccessKey}`);
//         return response.data.urls.regular;
//     } catch (error) {
//         console.error(error);
//     }
// }

export async function generateImageFromPrompt(promptText: string) {

    const unsplashAccessKey = process.env.UNPLASH_ACCESS_KEY;

    try {
        const image = await openai.images.generate({ model: "dall-e-3", prompt: promptText });
        return image.data?.[0] || '';
    } catch (error) {
        console.error(error);
    }
}

export async function generateSuggestionsFromPrompt(promptText: string) {

    const gpt3Response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: `Please generate some trending 2024 suggestions based on: ${promptText} and return them in JSON format.` }],
        model: 'gpt-3.5-turbo',
    });

    return gpt3Response.choices?.[0]?.message?.content || '';
}

export async function generateContentFromPrompt(promptText: string, size: number = 500) {

    const gpt3Response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: `Write a good title with the following:  '${promptText}' under ${size} characters.` }],
        model: 'gpt-3.5-turbo',
    });

    return gpt3Response.choices?.[0]?.message?.content || '';

}

export async function generateVoice(promptText: string) {

    try {


        const request = {
            input: { text: promptText },
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
            'signedUrl': signedUrl,
            'text': promptText

        };
    } catch (error) {
        console.error('Error:', error);
        return 'An error occurred during content generation and upload.';
    }

}

export async function generateVideoBasedOnPrompt(promptText: string) {
    const { OPENAI_API_DAVINCI_URL, OPENAI_API_KEY } = process.env;

    if (!OPENAI_API_DAVINCI_URL) {
        console.error('OPENAI_API_DAVINCI_URL is not defined.');
        return;
    }

    if (!OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY is not defined.');
        return;
    }

    try {
        const response = await axios.post(
            OPENAI_API_DAVINCI_URL,
            {
                prompt: promptText,
                max_tokens: 100,
                temperature: 0.8,
                n: 1,
                stop: '\n',
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const videoUrl = response.data.choices[0].video;
        // Process and display the video as needed
        console.log('Generated Video URL:', videoUrl);
    } catch (error) {
        console.error('Error generating video:', error);
    }
}