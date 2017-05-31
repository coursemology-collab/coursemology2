answer_ids_hash = answers.map do |a|
  [a.question_id, a.id]
end.to_h

topic_ids_hash = submission.submission_questions.map do |sq|
  [sq.question_id, sq.discussion_topic.id]
end.to_h

if explanations
  explanation_ids_hash = explanations.map { |e| [e.question_id, e.id] }.to_h
else
  explanation_ids_hash = {}
end

json.questions assessment.questions do |question|
  json.partial! 'question', question: question, can_grade: can_grade

  json.answerId answer_ids_hash[question.id]
  json.topicId topic_ids_hash[question.id]
  json.explanationId explanation_ids_hash[question.id]
end
