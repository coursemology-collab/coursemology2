json.questions @assessment.questions do |question|
  json.partial! 'question', question: question
end
