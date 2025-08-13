
import React, { useState, useEffect } from "react";
import { Child } from "@/api/entities";
import { Assignment } from "@/api/entities";
import { PracticeQuestion } from "@/api/entities";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowLeft, Upload as UploadIcon, FileText, CheckCircle, Camera, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UploadPage() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChildren();
  }, []);

  // Auto-generate assignment title when child and subject are selected
  useEffect(() => {
    if (selectedChild && subject && children.length > 0) {
      const selectedChildData = children.find(c => c.id === selectedChild);
      if (selectedChildData) {
        const childFirstName = selectedChildData.name.split(' ')[0];
        const today = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
        setAssignmentTitle(`${childFirstName} - ${capitalizedSubject} - ${today}`);
      }
    }
  }, [selectedChild, subject, children]);

  const loadChildren = async () => {
    try {
      const data = await Child.list();
      setChildren(data);
    } catch (error) {
      console.error("Error loading children:", error);
      setError("Failed to load children");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setError(null);
  };

  const handleCameraCapture = (e) => {
    const capturedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...capturedFiles]);
    setError(null);
    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const processAssignment = async () => {
    if (!files.length || !selectedChild || !assignmentTitle || !subject) {
      setError("Please fill in all fields and select at least one file");
      return;
    }

    const startTime = Date.now();
    console.log("--- 🚀 Starting Assignment Processing ---", new Date().toISOString());
    console.log(`Child ID: ${selectedChild}, Title: ${assignmentTitle}, Subject: ${subject}, Files: ${files.length}`);

    setIsProcessing(true);
    setError(null);
    setProcessedCount(0);
    setTotalCount(files.length + 2); // files + analysis + saving

    try {
      const selectedChildData = children.find(c => c.id === selectedChild);
      // Ensure child data is found
      if (!selectedChildData) {
        throw new Error("Selected child not found. Please select a valid child.");
      }
      const childFirstName = selectedChildData.name.split(' ')[0];

      // Step 1: Upload all files with error handling
      const uploadStartTime = Date.now();
      setProcessingStep("Uploading files...");
      console.log("--- étape 1: Uploading files ---", new Date().toISOString());
      const fileUrls = [];

      for (let i = 0; i < files.length; i++) {
        const fileUploadStart = Date.now();
        console.log(`Uploading file ${i + 1}: ${files[i].name}`);

        try {
          const { file_url } = await UploadFile({ file: files[i] });
          const fileUploadEnd = Date.now();
          console.log(`✅ File ${i + 1} uploaded successfully in ${fileUploadEnd - fileUploadStart}ms. URL: ${file_url}`);
          fileUrls.push(file_url);
          setProcessedCount(i + 1);
        } catch (uploadError) {
          console.error(`❌ Failed to upload file ${i + 1}:`, uploadError);
          // Re-throw specific error to be caught by the main catch block
          throw new Error(`Failed to upload file "${files[i].name}": ${uploadError.message}`);
        }
      }

      const uploadEndTime = Date.now();
      console.log(`⏱️ Total file upload time: ${uploadEndTime - uploadStartTime}ms (${((uploadEndTime - uploadStartTime) / 1000).toFixed(2)}s)`);

      // Step 2: Extract text from all files with error handling
      const extractStartTime = Date.now();
      setProcessingStep("Extracting homework content...");
      console.log("--- étape 2: Extracting content from files ---", new Date().toISOString());
      let allExtractedText = "";
      const allQuestions = [];

      for (let index = 0; index < fileUrls.length; index++) {
        const file_url = fileUrls[index];
        const extractFileStart = Date.now();
        console.log(`Extracting data from file ${index + 1}: ${file_url}`);

        try {
          const extractResult = await ExtractDataFromUploadedFile({
            file_url,
            json_schema: {
              type: "object",
              properties: {
                extracted_text: { type: "string" },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question_number: { type: "number" },
                      question_text: { type: "string" },
                      options: { type: "array", items: { type: "string" } },
                      student_answer: { type: "string" },
                      correct_answer: { type: "string" }
                    }
                  }
                }
              }
            }
          });

          const extractFileEnd = Date.now();
          console.log(`🔍 Extraction Result for file ${index + 1} (${extractFileEnd - extractFileStart}ms):`, extractResult);

          if (extractResult.status === "success") {
            console.log(`✅ Extraction successful for file ${index + 1}.`);
            allExtractedText += (extractResult.output.extracted_text || "") + "\n\n--- PAGE BREAK ---\n\n";
            if (extractResult.output.questions) {
              allQuestions.push(...extractResult.output.questions);
            }
          } else {
            console.error(`❗️ Extraction failed for file ${index + 1}.`, extractResult.details);
            // Append a specific failure message to indicate an issue with this page
            allExtractedText += "\n\n--- FAILED TO EXTRACT PAGE ---\n\n";
          }
        } catch (extractError) {
          console.error(`❌ Network or API error during extraction for file ${index + 1}:`, extractError);
          // Append a specific network error message but continue processing other files
          allExtractedText += "\n\n--- NETWORK ERROR DURING EXTRACTION ---\n\n";
        }
      }

      const extractEndTime = Date.now();
      console.log(`⏱️ Total extraction time: ${extractEndTime - extractStartTime}ms (${((extractEndTime - extractStartTime) / 1000).toFixed(2)}s)`);
      console.log("📚 Combined Extracted Text Length:", allExtractedText.length);
      console.log("❓ Combined Questions Found:", allQuestions.length, allQuestions);
      setProcessedCount(files.length + 1);

      // Check if we have any meaningful extracted text after all attempts
      if (!allExtractedText.trim() || allExtractedText.trim().replace(/--- (FAILED TO EXTRACT PAGE|NETWORK ERROR DURING EXTRACTION) ---/g, '').trim().length === 0) {
        throw new Error("Unable to extract any readable content from the uploaded files. Please ensure the images are clear, well-lit, and contain readable text.");
      }

      // Step 3: Analyze and grade the homework with error handling
      const gradingStartTime = Date.now();
      setProcessingStep("Analyzing homework and generating feedback...");
      console.log("--- étape 3: Sending to AI for grading ---", new Date().toISOString());

      const gradingPrompt = `You are an expert elementary school teacher grading homework for ${childFirstName}, a grade ${selectedChildData?.grade_level} student.

HOMEWORK CONTENT:
${allExtractedText}

EXTRACTED QUESTIONS (if available):
${JSON.stringify(allQuestions, null, 2)}

Please analyze this ${subject} homework and provide:
1. Count the total number of questions
2. Determine how many answers are correct
3. Calculate the score percentage
4. Identify specific strengths (what they did well)
5. Identify areas for improvement (specific skills to work on)
6. Provide encouraging, constructive feedback appropriate for a ${selectedChildData?.grade_level} grader

Be encouraging and focus on learning opportunities. If some questions can't be clearly read, note that in your analysis.`;

      console.log("🤖 AI Grading Prompt length:", gradingPrompt.length, "characters");
      console.log("🤖 AI Grading Prompt (first 500 chars):", gradingPrompt.substring(0, 500) + "...");

      let gradingResult;
      try {
        gradingResult = await InvokeLLM({
          prompt: gradingPrompt,
          response_json_schema: {
            type: "object",
            properties: {
              total_questions: { type: "number" },
              correct_answers: { type: "number" },
              score_percentage: { type: "number" },
              detailed_feedback: { type: "string" },
              strengths: { type: "array", items: { type: "string" } },
              weaknesses: { type: "array", items: { type: "string" } },
              skill_areas_to_practice: { type: "array", items: { type: "string" } },
              question_analysis: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question_number: { type: "number" },
                    question_text: { type: "string" },
                    student_answer: { type: "string" },
                    correct_answer: { type: "string" },
                    is_correct: { type: "boolean" },
                    explanation: { type: "string" }
                  }
                }
              }
            }
          }
        });
      } catch (gradingError) {
        console.error(`❌ Network or API error during AI grading:`, gradingError);
        throw new Error(`AI grading failed: ${gradingError.message}. Please try again or check your internet connection.`);
      }

      const gradingEndTime = Date.now();
      console.log(`⏱️ AI grading time: ${gradingEndTime - gradingStartTime}ms (${((gradingEndTime - gradingStartTime) / 1000).toFixed(2)}s)`);
      console.log("✅ AI Grading Result:", gradingResult);

      // Clean and validate the AI response data before saving
      console.log("🧹 Cleaning AI response data...");

      const cleanArrayOfStrings = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr
          .filter(item => item != null && item !== undefined)
          .map(item => String(item).trim())
          .filter(item => item.length > 0 && item.length < 500); // reasonable string length
      };

      const cleanedGradingResult = {
        total_questions: Math.max(1, Math.floor(Number(gradingResult.total_questions) || 1)),
        correct_answers: Math.max(0, Math.floor(Number(gradingResult.correct_answers) || 0)),
        score_percentage: Math.max(0, Math.min(100, Math.floor(Number(gradingResult.score_percentage) || 0))),
        detailed_feedback: String(gradingResult.detailed_feedback || "Assignment analyzed").trim().substring(0, 2000),
        strengths: cleanArrayOfStrings(gradingResult.strengths),
        weaknesses: cleanArrayOfStrings(gradingResult.weaknesses),
        skill_areas_to_practice: cleanArrayOfStrings(gradingResult.skill_areas_to_practice),
        question_analysis: Array.isArray(gradingResult.question_analysis) ? gradingResult.question_analysis : []
      };

      console.log("✅ Cleaned grading result:", cleanedGradingResult);

      setProcessedCount(files.length + 2);

      // Step 4: Save the assignment with error handling
      const saveStartTime = Date.now();
      setProcessingStep("Saving assignment...");
      console.log("--- étape 4: Saving assignment to database ---", new Date().toISOString());

      const assignmentPayload = {
        child_id: selectedChild,
        title: assignmentTitle,
        subject,
        grade_level: selectedChildData?.grade_level,
        original_file_url: fileUrls[0],
        additional_file_urls: fileUrls.slice(1),
        processed_text: allExtractedText,
        total_questions: cleanedGradingResult.total_questions,
        correct_answers: cleanedGradingResult.correct_answers,
        score_percentage: cleanedGradingResult.score_percentage,
        strengths: cleanedGradingResult.strengths,
        weaknesses: cleanedGradingResult.weaknesses,
        detailed_feedback: cleanedGradingResult.detailed_feedback,
        status: "graded",
        question_analysis: cleanedGradingResult.question_analysis,
        skill_areas_to_practice: cleanedGradingResult.skill_areas_to_practice
      };

      console.log("💾 Assignment payload to be saved:", assignmentPayload);

      let assignment;
      try {
        assignment = await Assignment.create(assignmentPayload);
      } catch (saveError) {
        console.error(`❌ Database save error:`, saveError);
        throw new Error(`Failed to save assignment: ${saveError.message}. Please try again.`);
      }

      const saveEndTime = Date.now();
      console.log(`⏱️ Database save time: ${saveEndTime - saveStartTime}ms (${((saveEndTime - saveStartTime) / 1000).toFixed(2)}s)`);
      console.log("✅ Assignment saved successfully:", assignment);

      // Step 5: Generate practice questions if skill areas were identified
      let practiceStartTime, practiceEndTime; // Declare variables here
      if (cleanedGradingResult.skill_areas_to_practice && cleanedGradingResult.skill_areas_to_practice.length > 0) {
        practiceStartTime = Date.now();
        console.log("--- étape 5: Generating practice questions ---", new Date().toISOString());
        // Limit to 3 practice questions to avoid excessive API calls
        for (const skillArea of cleanedGradingResult.skill_areas_to_practice.slice(0, 3)) {
          try {
            const practiceResult = await InvokeLLM({
              prompt: `Create a practice question for a grade ${selectedChildData?.grade_level} student to help them improve in: ${skillArea}.
              Subject: ${subject}
              Make it appropriate for their level and similar to what they're learning.`,
              response_json_schema: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct_answer: { type: "string" },
                  explanation: { type: "string" },
                  question_type: { type: "string" }
                }
              }
            });

            await PracticeQuestion.create({
              child_id: selectedChild,
              assignment_id: assignment.id,
              subject,
              skill_area: skillArea,
              question_type: practiceResult.question_type || "multiple_choice",
              question: practiceResult.question,
              options: practiceResult.options || [],
              correct_answer: practiceResult.correct_answer,
              explanation: practiceResult.explanation,
              difficulty_level: "medium"
            });
          } catch (practiceError) {
            console.warn(`Failed to create practice question for skill area "${skillArea}":`, practiceError);
            // Do not re-throw here; practice questions are secondary and should not fail the entire process
          }
        }
        practiceEndTime = Date.now();
        console.log(`⏱️ Practice questions generation time: ${practiceEndTime - practiceStartTime}ms (${((practiceEndTime - practiceStartTime) / 1000).toFixed(2)}s)`);
      }

      const totalEndTime = Date.now();
      console.log(`--- 🎉 Processing Finished in ${totalEndTime - startTime}ms (${((totalEndTime - startTime) / 1000).toFixed(2)}s) ---`);
      console.log("⏰ Time Breakdown:");
      console.log(`  📤 Upload: ${uploadEndTime - uploadStartTime}ms`);
      console.log(`  🔍 Extraction: ${extractEndTime - extractStartTime}ms`);
      console.log(`  🤖 AI Grading: ${gradingEndTime - gradingStartTime}ms`);
      console.log(`  💾 Database Save: ${saveEndTime - saveStartTime}ms`);
      if (practiceStartTime && practiceEndTime) { // Conditionally log only if they were set
        console.log(`  📝 Practice Qs: ${practiceEndTime - practiceStartTime}ms`);
      }

      // Navigate to the assignment details
      navigate(createPageUrl(`AssignmentDetails?id=${assignment.id}`));

    } catch (error) {
      const errorTime = Date.now();
      console.error(`--- ❗️ An error occurred after ${errorTime - startTime}ms ---`, error);

      // Provide more specific error messages based on error type
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.message.includes("Network Error") || error.message.includes("Failed to fetch")) {
        errorMessage = "Network connection issue. Please check your internet connection and try again.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "The request timed out. This might be due to large files or slow connection. Please try with smaller images or ensure a stable internet connection.";
      } else if (error.message.includes("Failed to upload")) {
        errorMessage = error.message + " Please check your internet connection and try again.";
      } else if (error.message.includes("Unable to extract")) {
        errorMessage = error.message + " Ensure the homework is clearly visible and well-lit.";
      } else if (error.message.includes("AI grading failed")) {
        errorMessage = error.message;
      } else if (error.message.includes("Failed to save")) {
        errorMessage = error.message;
      } else if (error.message.includes("Selected child not found")) {
        errorMessage = error.message;
      } else if (error.message) {
        // Fallback for any other specific errors thrown
        errorMessage = error.message;
      }

      setError(errorMessage);
    }

    setIsProcessing(false);
    setProcessingStep("");
  };

  if (isProcessing) {
    const progress = totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FileText className="w-6 h-6 text-blue-500 animate-pulse" />
              Processing Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-gray-600">{processingStep}</p>
            </div>
            <div className="text-center text-xs text-gray-500">
              This may take a few moments...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Assignment</h1>
            <p className="text-gray-600 mt-1">Upload homework for AI-powered grading and feedback</p>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Pick a Child */}
              <div className="space-y-2">
                <Label htmlFor="child">1. Pick a Child *</Label>
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map(child => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name} (Grade {child.grade_level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Step 2: Select Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">2. Select Subject *</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="spelling">Spelling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Step 3: Assignment Name (Auto-generated but editable) */}
              <div className="space-y-2">
                <Label htmlFor="title">3. Assignment Name</Label>
                <Input
                  id="title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder="Will be auto-generated when you select child and subject"
                  className={assignmentTitle ? "bg-green-50 border-green-200" : ""}
                />
                <p className="text-xs text-gray-500">
                  Auto-generated based on your selections. You can edit this if needed.
                </p>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <Label>4. Take or Upload Photos *</Label>

                {/* Mobile Camera Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                      id="camera-capture"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-14 border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => document.getElementById('camera-capture').click()}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Take Photos
                    </Button>
                  </div>

                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-14 border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <UploadIcon className="w-5 h-5 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Take multiple photos or upload JPG, PNG, PDF files
                </p>
              </div>

              {/* Selected Files Display */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Selected Files ({files.length})</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFiles}
                      className="text-gray-500 hover:text-red-600"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-600 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={processAssignment}
                disabled={!files.length || !selectedChild || !assignmentTitle || !subject}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 h-12 text-lg font-semibold"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Grade Assignment
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Take Photos</h4>
                  <p className="text-sm text-gray-600">Use your phone camera to capture multiple pages of homework</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">AI Analysis</h4>
                  <p className="text-sm text-gray-600">Our AI reads all pages and identifies questions and answers</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Instant Feedback</h4>
                  <p className="text-sm text-gray-600">Get detailed feedback, scores, and practice suggestions</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📱 Mobile Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Take photos in good lighting</li>
                  <li>• Keep homework flat and centered</li>
                  <li>• Capture one page per photo</li>
                  <li>• You can take multiple photos in sequence</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
