# frozen_string_literal: true
class CleanUpAttachmentsJob < ApplicationJob
  def perform
    Attachment.without_references.older_than(1.year.ago).destroy_all
  end
end
