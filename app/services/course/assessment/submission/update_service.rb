# frozen_string_literal: true
class Course::Assessment::Submission::UpdateService < SimpleDelegator
  def update
    if update_submission
      render partial: 'submission'
    else
      render json: { errors: @submission.errors }, status: :bad_request
    end
  end

  def load_or_create_answers
    return unless @submission.attempting?

    new_answers = questions_to_attempt.not_answered(@submission).attempt(@submission).
                  map { |answer| answer.save! if answer.new_record? }.
                  reduce(false) { |a, e| a || e }
    @submission.answers.reload if new_answers && @submission.answers.loaded?
  end

  def load_or_create_submission_questions
    if create_missing_submission_questions && @submission.submission_questions.loaded?
      @submission.submission_questions.reload
    end
  end

  protected

  # Service for handling the submission management logic, this serves as the super class for the
  # specific submission services.
  #
  # @param [Course::Assessment::SubmissionsController] controller the controller instance.
  # @param [Hash] variables a key value pairs of variables, which will be set as instance
  #   variables in the service. `{ name: 'Bob' }` will set a instance variable @name with the
  #   value of 'Bob' in the service.
  def initialize(controller, variables = {})
    super(controller)

    variables.each do |key, value|
      instance_variable_set("@#{key}", value)
    end
  end

  def update_submission_params
    params.require(:submission).permit(*workflow_state_params, :draft_points_awarded)
  end

  def update_answers_params
    params.require(:submission).permit(answers: [:id] + update_answer_params)
  end

  def submit_answer_params
    params.require(:submission).require(:answers_attributes).
      require(answer_id_param).permit(actable_attributes: [:id, update_answer_type_params])
  end

  private

  # The permitted state changes that will be provided to the model.
  def workflow_state_params
    result = []
    result << :finalise if can?(:update, @submission)
    result.push(:publish, :mark, :unmark, :unsubmit) if can?(:grade, @submission)
    result
  end

  # The permitted parameters for answers and their specific answer types.
  #
  # This varies depending on the permissions of the user.
  def update_answer_params
    [].tap do |result|
      result.push(*update_answer_type_params) if can?(:update, @submission)
      result.push(:grade) if can?(:grade, @submission) and !@submission.attempting?
    end
  end

  # The permitted parameters for each kind of answer.
  def update_answer_type_params
    scalar_params = [].tap do |result|
      result.push(:answer_text) # Text response answer
      result.push(attachments_params) # User uploaded files
    end
    # Parameters that must be an array of permitted values
    array_params = {}.tap do |result|
      result[:option_ids] = [] # MRQ answer
      result[:files] = [:id, :_destroy, :filename, :content] # Programming answer
    end
    scalar_params.push(array_params)
  end

  def answer_id_param
    params.permit(:answer_id)[:answer_id]
  end

  def edit_submission_path
    edit_course_assessment_submission_path(current_course, @assessment, @submission)
  end

  # Find the questions for this submission without submission_questions.
  # Build and save! new submission_questions.
  #
  # @raise [ActiveRecord::RecordInvalid] If the new submission_questions cannot be saved.
  # @return[Boolean] If new submission_questions were created.
  def create_missing_submission_questions
    questions_with_submission_questions = @submission.submission_questions.map(&:question)
    questions_without_submission_questions = questions_to_attempt - questions_with_submission_questions
    new_submission_questions = []
    questions_without_submission_questions.each do |question|
      new_submission_questions <<
        @submission.submission_questions.build(question: question)
    end
    new_submission_questions.each(&:save!)

    new_submission_questions.any?
  end

  def update_submission
    @submission.class.transaction do
      update_answers_params[:answers].each do |answer_params|
        answer = @submission.answers.find { |answer| answer.id == answer_params[:id].to_i }
        actable_answer = answer.specific
        actable_answer.assign_params(answer_params)
        actable_answer.save!
      end unless unsubmit?

      @submission.update(update_submission_params)
    end
  end

  def submit_answer
    answer = @submission.answers.find(answer_id_param)

    if answer.update_attributes(submit_answer_params)
      if valid_for_grading?(answer)
        job = grade_and_reattempt_answer(answer)

        respond_to do |format|
          format.json { render json: { redirect_url: job ? job_path(job.job) : nil } }
        end
      else
        # TODO: Implement error recovery in the frontend. Code only goes here if user hacks the html
        # and enables the submit button.
        head :bad_request
      end
    else
      head :bad_request
    end
  end

  def grade_and_reattempt_answer(answer)
    # The transaction is to make sure that auto grading and job are present when the answer is in
    # the submitted state.
    answer.class.transaction do
      answer.finalise! if answer.attempting?
      # Only save if answer is graded in another server
      answer.save! unless answer.grade_inline?
      answer.auto_grade!(edit_submission_path, true)
    end
  end

  def unsubmit?
    params[:submission] && params[:submission][:unsubmit].present?
  end

  # Test whether the answer can be graded or not.
  def valid_for_grading?(answer)
    return true unless answer.specific.is_a?(Course::Assessment::Answer::Programming)

    answer.specific.attempting_times_left > 0 || can?(:manage, @assessment)
  end
end
