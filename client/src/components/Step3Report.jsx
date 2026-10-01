import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Step3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    conclusion = "",
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }));

  const overallConclusion =
    conclusion && conclusion.trim() !== ""
      ? conclusion
      : finalScore >= 8
      ? "Strong overall performance. The candidate communicated clearly, answered with good confidence, and showed relevant and accurate knowledge across the interview."
      : finalScore >= 5
      ? "Moderate performance overall. The candidate showed solid foundations, but clarity, structure, and precision in answers need improvement to perform consistently at a higher level."
      : "Overall performance needs significant improvement. The candidate should focus on clearer communication, stronger structure, and more accurate and complete answers to improve interview outcomes.";

  const evaluationFactors = [
    { label: "Confidence", value: "confidence" },
    { label: "Communication", value: "communication" },
    { label: "Correctness", value: "correctness" },
  ];

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;


  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });

    currentY += 30;

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 28, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Overall Conclusion", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitConclusion = doc.splitTextToSize(overallConclusion, contentWidth - 20);
    doc.text(splitConclusion, margin + 10, currentY + 18);

    currentY += 40;

    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Answer", "Score", "Factor Summary", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question || "Question not available",
        q.answer || "No answer submitted",
        `${q.score ?? 0}/10`,
        `Confidence: ${q.confidence ?? 0}/10\nCommunication: ${q.communication ?? 0}/10\nCorrectness: ${q.correctness ?? 0}/10`,
        q.feedback || "No feedback available",
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 4,
        valign: "top",
        overflow: "line",
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 38 },
        2: { cellWidth: 34 },
        3: { cellWidth: 16, halign: "center" },
        4: { cellWidth: 30 },
        5: { cellWidth: 34 },
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save("AI_Interview_Report.pdf");
  };


  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-green-50 px-4 sm:px-6 lg:px-10 py-8'>
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='md:mb-10 w-full flex items-start gap-4 flex-wrap'>
          <button
            onClick={() => navigate("/history")}
            className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition'><FaArrowLeft className='text-gray-600' /></button>

          <div>
            <h1 className='text-3xl font-bold flex-nowrap text-gray-800'>
              Interview Analytics Dashboard
            </h1>
            <p className='text-gray-500 mt-2'>
              AI-powered performance insights
            </p>

          </div>
        </div>

        <button onClick={downloadPDF} className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap'>Download PDF</button>
      </div>


      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>

        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center">

            <h3 className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Overall Performance
            </h3>
            <div className='relative w-20 h-20 sm:w-25 sm:h-25 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#10b981",
                  textColor: "#ef4444",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>

            <p className="text-gray-400 mt-3 text-xs sm:text-sm">
              Out of 10
            </p>

            <div className="mt-4">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {performanceText}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8'>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
              Skill Evaluation
            </h3>

            <div className='space-y-5'>
              {
                skills.map((s, i) => (
                  <div key={i}>
                    <div className='flex justify-between mb-2 text-sm sm:text-base'>

                      <span>{s.label}</span>
                      <span className='font-semibold text-green-600'>{s.value}</span>
                    </div>

                    <div className='bg-gray-200 h-2 sm:h-3 rounded-full'>
                      <div className='bg-green-500 h-full rounded-full'
                        style={{ width: `${s.value * 10}%` }}

                      ></div>

                    </div>


                  </div>
                ))
              }
            </div>

            <div className='mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4'>
              <p className='text-xs uppercase tracking-[0.16em] text-emerald-700 font-semibold mb-2'>Final Conclusion</p>
              <p className='text-sm text-gray-700 leading-relaxed'>
                {overallConclusion}
              </p>
            </div>

          </motion.div>


        </div>

        <div className='lg:col-span-2 space-y-6'>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8'>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">
              Performance Trend
            </h3>

            <div className='h-64 sm:h-72'>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    fill="#bbf7d0"
                    strokeWidth={3} />


                </AreaChart>

              </ResponsiveContainer>


            </div>


          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8'>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
              Question Breakdown
            </h3>
            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='bg-gradient-to-br from-gray-50 to-emerald-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-emerald-100 shadow-sm'>
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5'>
                    <div className='flex-1'>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 font-semibold mb-2">
                        Question {i + 1}
                      </p>

                      <p className="font-semibold text-gray-800 text-sm sm:text-base leading-relaxed">
                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div className='bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm w-fit shadow-sm'>
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className='grid gap-4'>
                    <div className='bg-white border border-gray-200 rounded-xl p-4'>
                      <p className='text-[11px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-2'>Candidate Answer</p>
                      <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-line'>
                        {q.answer && q.answer.trim() !== ""
                          ? q.answer
                          : "No answer submitted for this question."}
                      </p>
                    </div>

                    <div className='bg-white border border-emerald-100 rounded-xl p-4'>
                      <p className='text-[11px] font-semibold text-emerald-700 uppercase tracking-[0.15em] mb-3'>Evaluation Factors</p>
                      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                        {evaluationFactors.map((factor) => {
                          const factorValue = q[factor.value] ?? 0;
                          return (
                            <div key={factor.value} className='bg-emerald-50 border border-emerald-200 rounded-lg p-3'>
                              <div className='flex justify-between items-center mb-2'>
                                <span className='text-xs font-medium text-emerald-700'>{factor.label}</span>
                                <span className='text-xs font-bold text-emerald-700'>{factorValue}/10</span>
                              </div>
                              <div className='h-2 bg-emerald-100 rounded-full overflow-hidden'>
                                <div
                                  className='h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full'
                                  style={{ width: `${(factorValue / 10) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-4'>
                      <p className='text-[11px] font-semibold text-emerald-700 uppercase tracking-[0.15em] mb-2'>AI Feedback</p>
                      <p className='text-sm text-gray-700 leading-relaxed'>
                        {q.feedback && q.feedback.trim() !== ""
                          ? q.feedback
                          : "No feedback available for this question."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>





        </div>
      </div>

    </div>
  )
}

export default Step3Report
