# frozen_string_literal: true
class CleanUpReadMarksJob < ApplicationJob
  def perform
    ReadMark.readable_classes.each do |klass|
      klass.cleanup_read_marks!
    end
  end
end
