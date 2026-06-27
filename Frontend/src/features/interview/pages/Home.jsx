import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useinterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

const { loading, generateReport, reports, getReports } = useInterview()
const [jobDescription, setJobDescription] = useState("")
const [selfDescription, setSelfDescription] = useState("")
const resumeInputRef = useRef()

const navigate = useNavigate()
useEffect(() => {
    getReports()
}, [])

const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]

    const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile
    })

    if (data?.interviewReport?._id) {
    navigate(`/interview/${data.interviewReport._id}`)
}
}

if(loading){
    return(
        <main className= 'loading-screen'>
           <h1>Loading your interview plan...</h1>
        </main>
    )
}


  return (
    <main className="home">
      {/* Header Section */}
      <div className="header-section">
        <h1 className="title">
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p className="subtitle">Let our AI analyze the job requirements and your unique profile to build a winning strategy</p>
      </div>

      {/* Container */}
      <div className="content-container">
        {/* Main Content */}
        <div className="interview-input-group">
          
          {/* Left Section - Target Job Description */}
          <div className="left">
            <div className="section-header">
              <span className="section-icon">🎯</span>
              <h2>Target Job Description</h2>
              <span className="required-tag">required</span>
            </div>
            
            <div className="input-group">
              
              <textarea 
                onChange ={(e) => {setJobDescription(e.target.value)}}
                id="jobDescription"
                name="jobDescription" 
                
                placeholder="Copy and paste the complete job description...
e.g., 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design'"
                className="job-textarea"
              ></textarea>
              
              <span className="char-count">0 / 5000 chars</span>
            </div>
          </div>

          {/* Right Section - Your Profile */}
          <div className="right">
            <div className="section-header">
              <span className="section-icon">👤</span>
              <h2>Your Profile</h2>
              <span className="required-tag">best results</span>
            </div>

            {/* Resume Upload */}
            <div className="input-group resume-group">
              <div className="resume-header">
                <span className="resume-icon">📄</span>
                <label className="input-label">Upload Resume</label>
                <span className="resume-tag">best results</span>
              </div>
              <label htmlFor="resume" className="resume-upload-container">
                <div className="upload-placeholder">
                  <span className="upload-icon">📄</span>
                  <p>Click to upload or drag & drop</p>
                  <small>PDF or DOCX (Max 5MB)</small>
                </div>
                <input ref = { resumeInputRef }
                  hidden 
                  type="file" 
                  id="resume" 
                  name="resume" 
                  accept=".pdf,.doc,.docx" 
                />
              </label>
            </div>

            {/* Divider */}
            <div className="divider">OR</div>

            {/* Quick Self Description */}
            <div className="input-group">
              <label htmlFor="selfDescription" className="input-label">
                Quick Self-Description
              </label>
              <textarea 
                onChange ={(e) => {setSelfDescription(e.target.value)}}
                id="selfDescription"
                name="selfDescription" 
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                className="description-textarea"
              ></textarea>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <div className="info-content">
                <input type="radio" id="confirm" className="info-radio" name="requirement" />
                <label htmlFor="confirm" className="info-label">
                  <span className="info-text">
                    <strong>Either a Resume</strong> or <strong>Self Description</strong> is required to generate a personalized plan.
                  </span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button  onClick= { handleGenerateReport } className="generate-button">
              ✨ Generate My Interview Strategy
            </button>
          </div>
        </div>
      </div>

      {/* Recent Footer List*/ }
{reports.length > 0 && (
  <section className="recent-reports">
    <h2>My Recent Interview Plans</h2>

    <ul className="reports-list">
      {reports.map((report) => (
        <li
          key={report._id}
          className="report-item"
          onClick={() => navigate(`/interview/${report._id}`)}
        >
          <h3>{report.title || "Untitled Position"}</h3>

          <p className="report-meta">
            Generated on {new Date(report.createdAt).toLocaleDateString()}
          </p>

          <p
            className={`match-score ${
              report.matchScore >= 80
                ? "score--high"
                : report.matchScore >= 60
                ? "score--mid"
                : "score--low"
            }`}
          >
            Match Score: {report.matchScore}%
          </p>
        </li>
      ))}
    </ul>
  </section>
)}


      {/* Footer */}
      <footer className="footer">
        <a href="#privacy">Privacy Policy</a>
        <span className="separator">•</span>
        <a href="#terms">Terms of Service</a>
        <span className="separator">•</span>
        <a href="#help">Help Center</a>
      </footer>
    </main>
  )
}

export default Home