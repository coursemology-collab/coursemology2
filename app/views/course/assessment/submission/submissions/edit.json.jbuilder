@answers_hash = @submission.answers.map { |answer| [answer.question_id, answer] }.to_h

json.submitted @submission.submitted?
json.attempting @submission.attempting?
json.can_grade can?(:grade, @submission)
json.can_update can?(:update, @submission)

json.partial! 'progress'

json.assessment do
  json.(@assessment, :title, :description, :published, :autograded, :skippable,
    :tabbed_view, :password, :delayed_grade_publication)
  json.password_protected @assessment.password_protected?

  if @assessment.autograded?
    json.partial! 'autograded'
  else
    json.partial! 'manually_graded'
  end
end
