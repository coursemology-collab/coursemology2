json.form_data do
  json.method 'PATCH'
  json.auth_token form_authenticity_token
  json.path course_assessment_question_scribing_path(current_course, @assessment,
                                                  @scribing_question)
end

json.partial! 'props'
