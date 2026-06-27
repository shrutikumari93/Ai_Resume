const pdfParse = require("pdf-parse")
const { generateAiInterviewReport, generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")



/**
 * @description Controller to generate interview report based on user self description , resume and job description.
 */
async function generateInterviewReportController(req, res){
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required." })
    }

    const { selfDeclaration, jobDescription } = req.body
    if (!selfDeclaration || !jobDescription) {
      return res.status(400).json({ message: "Self declaration and job description are required." })
    }

    try {
      const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

      const interviewReportByAi = await generateAiInterviewReport({
        resume: resumeContent.text,
        jobDescription,
        selfDeclaration
      })

     const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDeclaration,
        jobDescription,
        ...interviewReportByAi
     })

     res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
     })
}

/**
 * @description controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res){
   const { interviewId } = req.params

   const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
      if(!interviewReport){
         return res.status(404).json({ 
            message: "Interview report not found."
     })
   }
   res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport
   })
}

/**
 * @description controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res){
   const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDeclaration -jobDescription -__v -technicalQuestions.answer -behavioralQuestions  -skillGaps -preparationPlan -behavioralQuestions")
   res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports
   })
}

/**
 * @description controller to generate resume PDF based on user self description , and job description.
 */

async function generateResumePdfController(req, res){
  const { interviewReportId} = req.params

  const interviewReport = await interviewReportModel.findById(interviewReportId )
   if(!interviewReport){
      return res.status(404).json({
         message: "Interview report not found."
      })
   }

   const { resume, selfDescription, jobDescription}  = interviewReport

   const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription })
   res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
   })
   res.send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController , generateResumePdfController}