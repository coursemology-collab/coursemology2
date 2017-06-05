json.fields do
  json.questionId answer.question_id
  json.id answer.acting_as.id
  json.option_ids answer.options.map(&:id)
end

last_attempt = last_attempt(answer)

json.explanation do
  assessment = answer.submission.assessment
  if assessment.autograded? && last_attempt&.auto_grading&.result
    json.correct last_attempt.correct?
    json.explanations last_attempt.auto_grading.result['messages'].each do |explanation|
      format_html(explanation)
    end
  end
end
