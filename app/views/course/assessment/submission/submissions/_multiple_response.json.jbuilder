question = answer.question.specific

json.options question.options do |option|
  json.option format_html(option.option)
  json.selected answer.options.include?(option)
  json.id option.id
end

if question.multiple_choice?
  selected_option = answer.options.first
  json.selected_option selected_option && selected_option.id
end
