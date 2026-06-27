import React, { useState, useEffect } from 'react'
import "../style/interview.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router-dom'
import { generateResumePdf } from '../services/interview.api.js'

const Interview = () => {
  const [active, setActive] = useState('technical')
  const { report, getReportById, loading , getResumePdf} = useInterview()
  const { interviewId } = useParams()

  useEffect(() => {
    if (interviewId && (!report || report._id !== interviewId)) {
      getReportById(interviewId)
    }
  }, [interviewId, report, getReportById])

  if (loading || !report) {
    return (
      <main className="interview-page">
        <div className="interview-container">
          <div className="loading-screen">
            <h1>Loading your interview plan...</h1>
          </div>
        </div>
      </main>
    )
  }

  const interviewReport = report

  return (
    <main className="interview-page">
      <div className="interview-container">
        
        <aside className="left-panel">
          <button
            className={`section-btn ${active === 'technical' ? 'active' : ''}`}
            onClick={() => setActive('technical')}
          >
            <span className="nav-icon">⚡</span>
            Technical Questions
          </button>
          <button
            className={`section-btn ${active === 'behavioral' ? 'active' : ''}`}
            onClick={() => setActive('behavioral')}
          >
            <span className="nav-icon">💬</span>
            Behavioral Questions
          </button>
          
          <button
            className={`section-btn ${active === 'plan' ? 'active' : ''}`}
            onClick={() => setActive('plan')}
          >
            
            <span className="nav-icon">🗺️</span>
            Road Map
          </button>
          <button 
          onClick = { () => getResumePdf({interviewReportId: interviewId})}
          className= "button primary-button">
            Download Resume
            <svg height = {"0.8rem"} style = { { marginRight:"0.8rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
          </button>
        </aside>
        

        <section className="center-panel">
          {active === 'technical' && (
            <div className="panel-content">
              <h3 className="panel-title">
                Technical Questions <span className="count">{interviewReport.technicalQuestions.length} questions</span>
              </h3>
              {interviewReport.technicalQuestions.map((q, i) => (
                <div key={i} className="question-card">
                  <div className="q-header">
                    <span className="q-badge">{String(i + 1).padStart(2, '0')}</span>
                    <p className="q">{q.question}</p>
                  </div>
                  <details>
                    <summary>
                      <span className="summary-title">Intention & Answer</span>
                    </summary>
                    <p className="intention"><strong>INTENTION</strong>: {q.intention}</p>
                    <p className="answer"><strong>MODEL ANSWER</strong>: {q.answer}</p>
                  </details>
                </div>
              ))}
            </div>
          )}

          {active === 'behavioral' && (
            <div className="panel-content">
              <h3 className="panel-title">
                Behavioral Questions <span className="count">{interviewReport.behavioralQuestions.length} questions</span>
              </h3>
              {interviewReport.behavioralQuestions.map((q, i) => (
                <div key={i} className="question-card">
                  <div className="q-header">
                    <span className="q-badge">{String(i + 1).padStart(2, '0')}</span>
                    <p className="q">{q.question}</p>
                  </div>
                  <details>
                    <summary>
                      <span className="summary-title">Intention & Answer</span>
                    </summary>
                    <p className="intention"><strong>INTENTION</strong>: {q.intention}</p>
                    <p className="answer"><strong>MODEL ANSWER</strong>: {q.answer}</p>
                  </details>
                </div>
              ))}
            </div>
          )}

          {active === 'plan' && (
            <div className="panel-content">
              <h3 className="panel-title">Preparation Plan</h3>
              <div className="plan-list">
                {interviewReport.preparationPlan.map((day) => (
                  <div key={day._id} className="plan-day">
                    <div className="day">Day {day.day}</div>
                    <div className="focus">{day.focus}</div>
                    <ul>
                      {day.tasks.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="right-panel">
          <div className="match-card">
            <div className="match-label">Match Score</div>
            <div className="match-score">
              <div className="match-visual" style={{ '--p': `${interviewReport.matchScore}` }}>
                <div className="match-inner">{interviewReport.matchScore}%</div>
              </div>
            </div>
          </div>
          

          <div className="skill-gaps">
            <h4>Skill Gaps</h4>
            {interviewReport.skillGaps.map((s, i) => (
              <div key={i} className={`skill-tag gap-${i + 1}`}>
                {s.skill}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Interview
