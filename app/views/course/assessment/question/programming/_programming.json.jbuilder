json.language question.language.name

if question.test_cases.present?
  test_cases = question.test_cases
  test_cases = test_cases.select(&:public_test?) unless can_grade

  json.testCases test_cases do |test_case|
    json.identifier format_inline_text(test_case.identifier)
    json.expression format_inline_text(test_case.expression)
    json.expected format_inline_text(test_case.expected)
    json.hint format_html(test_case.hint)
    json.type test_case.test_case_type
  end
end
