json.fields do
  json.questionId answer.question_id
  json.id answer.acting_as.id
  json.files answer.files do |file|
    json.(file, :id, :filename, :content)
  end
end

submission = answer.submission
assessment = submission.assessment
question = answer.question.specific
last_attempt = last_attempt(answer)

can_read_tests = can?(:read_tests, submission)
show_private = can_read_tests || last_attempt&.correct? && assessment.show_private?
show_evaluation = can_read_tests || last_attempt&.correct? && assessment.show_evaluation?

test_cases_by_type = question.test_cases_by_type
test_cases_and_results = get_test_cases_and_results(test_cases_by_type, last_attempt&.auto_grading&.specific)

displayed_test_case_types = ['public_test']
displayed_test_case_types << 'private_test' if show_private
displayed_test_case_types << 'evaluation_test' if show_evaluation

json.testCases do
  displayed_test_case_types.each do |test_case_type|
    json.set! test_case_type do
      if test_cases_and_results[test_case_type].present?
        json.array! test_cases_and_results[test_case_type] do |test_case, test_result|
          json.identifier test_case.identifier
          json.expression test_case.expression
          json.expected test_case.expected
          json.hint format_html(test_case.hint)
          if test_result
            json.output get_output(test_result)
            json.passed test_result.passed?
          end
        end
      end
    end
  end
end

failed_test_cases_by_type = get_failed_test_cases_by_type(test_cases_and_results)

json.explanation do
  assessment = answer.submission.assessment
  if assessment.autograded? && last_attempt
    explanations = []
    if failed_test_cases_by_type['public_test']
      failed_test_cases_by_type['public_test'].each do |test_case, test_result|
        explanations << simple_format(get_hint(test_case, test_result))
      end
    elsif failed_test_cases_by_type['private_test']
      failed_test_cases_by_type['private_test'].each do |test_case, test_result|
        explanations << simple_format(get_hint(test_case, test_result))
      end
    end

    if can_read_tests && failed_test_cases_by_type['evaluation_test']
      failed_test_cases_by_type['evaluation_test'].each do |test_case, test_result|
        explanations << simple_format(get_hint(test_case, test_result))
      end
    end

    json.correct last_attempt.correct?
    json.explanations explanations
  end
end
