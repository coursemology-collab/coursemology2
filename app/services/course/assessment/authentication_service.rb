# frozen_string_literal: true

# Authenticate the assessment and stores the authentication token in the given session.
# Token generation is based on the assessment password, so that if the password changed, token will automaitcally become
#   invalid.
class Course::Assessment::AuthenticationService
  # @param [Course::Assessment] assessment The password protected assessment.
  # @param [ActionDispatch::Request::Session] session The current session.
  def initialize(assessment, session)
    @assessment = assessment
    @session = session
  end

  # Check if the password from user input matches the assessment password.
  #
  # @param [String] password_input
  # @return [Boolean] true if matches
  def authenticate(password_input)
    return true unless @assessment.password_protected?

    if password_input == @assessment.view_password
      set_session_token!
      true
    else
      false
    end
  end

  # Generates a new authentication token and stores it in current session.
  def set_session_token!
    @session[session_key] = password_token
  end

  # Check whether current session is the same session that created the submission or not.
  #
  # @return [Boolean]
  def authenticated?
    return true unless @session

    @session[session_key] == password_token
  end

  def can_access?(user)
    # Allow access if password matches or if the student has at least one submission to the assessment.
    authenticated? || @assessment.submissions.by_user(user).count > 0
  end

  private

  def password_token
    Digest::SHA1.hexdigest(@assessment.view_password)
  end

  def session_key
    "assessment_#{@assessment.id}_access_token"
  end
end
