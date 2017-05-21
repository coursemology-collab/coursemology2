json.topic do
  puts topic.inspect
  submission_question = topic.specific
  json.id topic.id
  json.submissionQuestionId submission_question.id
  json.questionId submission_question.question_id
  json.posts topic.posts do |post|
    json.partial! post
  end
end
