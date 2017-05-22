json.answer do
  json.partial! latest_attempt, can_grade: can_grade
end

json.explanation do
  json.partial! previous_attempt, can_grade: can_grade
end unless previous_attempt.nil?
