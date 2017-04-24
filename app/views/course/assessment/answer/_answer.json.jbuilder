json.(answer, :id)

answer = answer.specific
json.partial! answer, answer: answer

last_attempt = last_attempt(answer)
if last_attempt && last_attempt.auto_grading && last_attempt.auto_grading.result
  json.last_attempt do
    json.correct answer.correct?
    json.explanations answer.auto_grading.result['messages'].each do |explanation|
      format_html(explanation)
    end
  end
end
