if response[:redirect_to_edit]
  json.redirect_edit do
    json.url edit_course_assessment_question_scribing_path(current_course, @assessment,
                                                    @scribing_question)
    json.page_header @scribing_question.display_title
    json.page_title @scribing_question.display_title + ' - ' + page_title
  end
end

json.redirect_assessment course_assessment_path(current_course, @assessment)
json.message response[:message]
