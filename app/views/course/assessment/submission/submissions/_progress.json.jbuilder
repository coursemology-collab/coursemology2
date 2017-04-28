json.workflow_state Course::Assessment::Submission.human_attribute_name(@submission.workflow_state)
json.course_user display_course_user(@submission.course_user)

if @submission.attempting?
  json.action_at @submission.created_at
end
if @submission.submitted?
  json.action_at @submission.submitted_at
end
if @submission.published? || @submission.graded?
  # Display the published time first, else show the graded time if available.
  # For showing timestamps from delayed grade publication.
  json.action_at @submission.published_at || @submission.graded_at
  json.grade @submission.grade
  json.maximum_grade @submission.assessment.maximum_grade
end

json.late @submission.submitted? && @submission.assessment.end_at &&
  @submission.submitted_at > @submission.assessment.end_at
