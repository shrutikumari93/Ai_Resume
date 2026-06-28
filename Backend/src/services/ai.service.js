const {GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
     matchScore: z.number().describe("The overall match score for the candidate's profile"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take while answering this question"),
    })).describe("Technical questions that can be asked in the interview along with thier intension and how to answer them"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take while answering this question"),
    })).describe("Behavioral questions that can be asked in the interview along with thier intension and how to answer them"),

    skillGaps: z.array(z.object({ skill: z.string().describe("The skill which the candidate is lacking"), 
    severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is the skill for the job role") 
})).describe("List of skill gaps in the candidate's profile along with their severity "),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation paln , start from 1 and so on"),
        focus: z.string().describe("The main focus of preparation for that day, e.g. data structure, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be completed on that day to prepare for the interview")
    })).describe("A day-wise preparation plan for the candidate to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})




async function generateAiInterviewReport({ resume, selfDeclaration, jobDescription}){
   
const prompt = `
You are an expert technical interviewer.

IMPORTANT:
Return ONLY valid JSON.

DO NOT:
- add extra keys
- rename fields
- return markdown
- return explanations
- create your own structure

YOU MUST FOLLOW THIS EXACT JSON STRUCTURE:

{
  "matchScore": number,
  "title": string,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],

  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],

  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],

  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": [string]
    }
  ]
}

Generate at least:
- 3 technical questions
- 2 behavioral questions
- 2 skill gaps
- 5 preparation plan days

Candidate Resume:
${resume}

Self Declaration:
${selfDeclaration}

Job Description:
${jobDescription}
`;


    const response = await ai.models.generateContent({
    model : "gemini-2.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        
    }
   })
   return JSON.parse(response.text)

}

async function generatePdfFromHtml(htmlContent) {

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "15mm",
      bottom: "20mm",
      left: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}


async function generateResumePdf({ resume, selfDescription, jobDescription}){

  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer"),
  })

  const prompt = `Generate a resume for a candidate with the following details:
                  Resume: ${resume}
                  selfDescription: ${selfDescription}
                  jobDescription: ${jobDescription}
  The response should be a JSON object with a single field "html" which contains the HTML content of the resume. The HTML should be well-structured and can be converted to PDF using libraries like puppeteer. 
  The resume should highlight the candidate's strengths and skills that are relevant to the job description, and should be formatted in a professional manner.                
  The content of the resume should be not sound like it's generated by AI and should be as close as possible to a human written resume.
  you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
  The content should be ATS friendly, i.e. it should be easily parsable by ATS systems and should not contain any complex formatting or design elements that can break the parsing.
  The resume shuold not be so lengthy , it should be idealy 1-2 pages long and should focus on the most important and relevant information about the candidate.
  `

                  const response = await ai.models.generateContent({
                    model : "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(resumePdfSchema),
                    }
                  })

                  const jsonContent =  JSON.parse(response.text)
                  const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

                  return pdfBuffer
}



module.exports = { generateAiInterviewReport, generateResumePdf } 