# frozen_string_literal: true
json.fields do
  json.questionId answer.question_id
  json.id answer.acting_as.id
  json.option_ids answer.options.map(&:id)
end

last_attempt = last_attempt(answer)

json.explanation do
  if last_attempt&.auto_grading&.result
    json.correct last_attempt.correct
    json.dirtyAnswer last_attempt.actable.answer_options.map(&:option_id).to_set != answer.answer_options.map(&:option_id).to_set
    json.explanations last_attempt.auto_grading.result['messages'].map { |e| format_html(e) }
  end
end
