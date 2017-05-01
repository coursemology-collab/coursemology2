question = answer.question.specific
json.allow_attachment question.allow_attachment? unless question.hide_text?

json.answer_text answer.answer_text unless question.hide_text
json.attachment answer.attachment if question.allow_attachment?
