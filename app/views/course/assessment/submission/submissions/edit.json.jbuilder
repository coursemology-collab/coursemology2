@answers_hash = @submission.answers.map { |answer| [answer.question_id, answer] }.to_h

json.assessment do
  json.(@assessment, :title, :description, :published, :autograded, :skippable,
    :tabbed_view, :password, :delayed_grade_publication)
  json.password_protected @assessment.password_protected?

  json.questions @assessment.questions do |question|
    answer = @answers_hash[question.id]

    json.question do
      json.(@question, :title, :description)
      json.type @question.actable_type
    end

    json.answer
  end
end
