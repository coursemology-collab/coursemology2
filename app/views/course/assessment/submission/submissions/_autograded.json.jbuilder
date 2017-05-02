json.answers @assessment.questions do |question|
  answer = @answers_hash[question.id]

  json.partial! 'answer', answer: answer
  json.type case question.actable_type
            when Course::Assessment::Question::MultipleResponse.name
              question.actable.multiple_choice? ? 'MultipleChoice' : 'MultipleResponse'
            when Course::Assessment::Question::TextResponse.name
              question.actable.hide_text? ? 'FileUpload' : 'TextResponse'
            when Course::Assessment::Question::Programming.name
              'Programming'
            end

  json.question do
    json.(question, :display_title, :description)
  end
end
