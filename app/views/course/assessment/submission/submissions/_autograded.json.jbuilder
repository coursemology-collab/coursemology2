json.questions @assessment.questions do |question|
  answer = @answers_hash[question.id]

  json.question do
    json.(question, :display_title, :description)
    json.type question.actable_type.demodulize
  end

  json.answer do
    json.partial! 'course/assessment/answer/answer', answer: answer
  end
end
