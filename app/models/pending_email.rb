# frozen_string_literal: true
# Represents an unsent email in the application.
class PendingEmail < ApplicationRecord
  belongs_to :user_email, class_name: User::Email.name, inverse_of: :pending_emails
  belongs_to :trigger, polymorphic: true
end
