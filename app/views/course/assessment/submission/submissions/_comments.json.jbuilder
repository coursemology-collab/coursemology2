json.topics submission.submission_questions do |submission_question|
  topic = submission_question.discussion_topic
  json.id topic.id
  json.submissionQuestionId submission_question.id
  json.questionId submission_question.question_id
  json.postIds topic.post_ids
end

posts = submission.submission_questions.reduce([]) do |posts, submission_question|
  posts + submission_question.discussion_topic.posts
end

json.posts posts do |post|
  json.partial! post, post: post
end
