question = answer.question.specific

json.files answer.files do |file|
  json.filename file.filename
  json.content file.content
end

if question.test_cases.present?
  json.test_cases question.test_cases do |test_case|
    json.identifier format_inline_text(test_case.identifier)
    json.expression format_inline_text(test_case.expression)
    json.expected format_inline_text(test_case.expected)
    json.hint format_html(test_case.hint)
  end
end
