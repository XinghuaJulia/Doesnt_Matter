// import { ExpoRequest, ExpoResponse } from 'expo-router/server';
// import OpenAI from 'openai';

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// const openai = new OpenAI();

// export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
//   //console.log('key: ', OPENAI_API_KEY);
//   //code above works

//   const body = await request.json();

//   // const completion = await openai.chat.completions.create({
//   //       messages: [{ role: "user", content: "name me 1 random color" }],
//   //       model: "gpt-3.5-turbo",
//   //     });

//   //     console.log(completion.choices[0]);

//   return ExpoResponse.json({hello: 'world'});
// }