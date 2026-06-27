import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

/**
 * @description Services to generate interview report based on user self description , resume and job description, get interview report by interviewId and get all interview reports of logged in user. 
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData();
    formData.append("jobDescription", jobDescription)
    formData.append("selfDeclaration" , selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
     return response.data
}

/**
* @description Services to get interview report by interviewId. 
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}

/**
* @description Services to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")
    return response.data
}


/**
 * 
 * @description Services to generate resume pdf based on interview report id. The generated pdf will be downloaded to the user's device.
 * 
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response  = await api.get(`/api/interview/resume/pdf/${interviewReportId}`, {
        responseType: 'blob'
    })
    return response.data
}