can_grade = can?(:grade, @submission)
can_update = can?(:update, @submission)

json.partial! 'submission', submission: @submission, assessment: @assessment,
                            can_grade: can_grade, can_update: can_update

json.assessment do
  json.(@assessment, :title, :description, :autograded, :skippable)
  json.delayedGradePublication @assessment.delayed_grade_publication
  json.tabbedView @assessment.tabbed_view

  json.partial! 'questions', assessment: @assessment, submission: @submission, can_grade: can_grade
end
