@answers_hash = @submission.answers.map { |answer| [answer.question_id, answer] }.to_h

can_grade = can?(:grade, @submission)
can_update = can?(:update, @submission)

json.submitted @submission.submitted?
json.attempting @submission.attempting?
json.can_grade can_grade
json.can_update can_update

json.partial! 'progress' if can_grade

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
