import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(request: Request) {
    const { exerciseName } = await request.json();

    if(!exerciseName){
        return Response.json({ error: "Exercise name is required" }, { status: 400 });
    }
    const prompt = `
    You are a fitness expert. 
    You are given an exercise, provide clear instructions on how to perform the exercise. Include if any equipment is required and any safety precautions to keep in mind.
    
    This is the exercise name: ${exerciseName}  
    
    Keep it short and concise, around 100 words.Use markdown formatting
    
    Use the following format:
    
    ##Equipment Required
    ##Instructions
    ###Tips
    ###Variations
    ###Safety Precautions
    keep spacing between the headings and the content. Use bullet points where necessary.
    Always use heading and sub headings`;

    console.log(prompt);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: prompt }
            ]
        });
        console.log(response);
        return Response.json({ message: response.choices[0].message.content });

    } catch (error) {
        console.error("Error fetching AI response:", error);
        return Response.json({ error: "Failed to fetch AI response" }, { status: 500 });
    }
}