import jsPDF from 'jspdf';

export const exportSubjectToPDF = (subject, questions) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(subject.title, margin, yPosition);
  yPosition += 10;

  // Description
  if (subject.description) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const descLines = pdf.splitTextToSize(subject.description, pageWidth - 2 * margin);
    pdf.text(descLines, margin, yPosition);
    yPosition += descLines.length * 6 + 10;
  }

  // Stats
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text(`Total Questions: ${questions.length}`, margin, yPosition);
  yPosition += 6;

  const easyCount = questions.filter(q => q.difficulty === 'Easy').length;
  const mediumCount = questions.filter(q => q.difficulty === 'Medium').length;
  const hardCount = questions.filter(q => q.difficulty === 'Hard').length;

  pdf.text(`Easy: ${easyCount} | Medium: ${mediumCount} | Hard: ${hardCount}`, margin, yPosition);
  yPosition += 15;

  // Questions
  questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }

    // Question number and difficulty
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Q${index + 1}. ${question.title}`, margin, yPosition);
    yPosition += 7;

    // Difficulty badge
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`[${question.difficulty}]`, margin, yPosition);
    yPosition += 7;

    // Tags
    if (question.tags && question.tags.length > 0) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Tags: ${question.tags.join(', ')}`, margin, yPosition);
      yPosition += 7;
    }

    // Answer
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Remove HTML tags for PDF
    const cleanAnswer = question.answer.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    const answerLines = pdf.splitTextToSize(cleanAnswer, pageWidth - 2 * margin);
    
    pdf.text(answerLines, margin, yPosition);
    yPosition += answerLines.length * 5 + 12;

    // Separator line
    if (index < questions.length - 1) {
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
      yPosition += 3;
    }
  });

  // Save the PDF
  const fileName = `${subject.title.replace(/[^a-z0-9]/gi, '_')}_questions.pdf`;
  pdf.save(fileName);
};
