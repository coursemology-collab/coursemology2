answers_hash = submission.latest_answers.map do |a|
  [a.question_id, a]
end.to_h

topics_hash = submission.submission_questions.map do |sq|
  [sq.question_id, sq.discussion_topic]
end.to_h

if assessment.autograded? && submission.attempting?
  previous_attempts = submission.latest_answers.map { |a| last_attempt(a) }.reject(&:nil?)
  previous_attempts_hash = previous_attempts.map { |a| [a.question_id, a] }.to_h
else
  previous_attempts_hash = {}
end

json.questions assessment.questions do |question|
  json.partial! 'question', question: question, can_grade: can_grade

  json.partial! 'answer', latest_attempt: answers_hash[question.id],
                          previous_attempt: previous_attempts_hash[question.id],
                          can_grade: can_grade

  json.partial! 'topic', topic: topics_hash[question.id]
end
