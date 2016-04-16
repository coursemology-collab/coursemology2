# frozen_string_literal: true
class Course::Achievement < ActiveRecord::Base
  acts_as_conditional
  mount_uploader :badge, ImageUploader

  after_initialize :set_defaults, if: :new_record?

  belongs_to :course, inverse_of: :achievements
  has_many :course_user_achievements, class_name: Course::UserAchievement.name,
                                      inverse_of: :achievement, dependent: :destroy
  has_many :course_users, through: :course_user_achievements, class_name: CourseUser.name

  default_scope { order(weight: :asc) }

  # Set default values
  def set_defaults
    self.weight ||= 10
  end

  def permitted_for!(course_user)
    return if conditions.empty?
    course_users << course_user unless course_users.exists?(course_user.id)
  end

  def precluded_for!(course_user)
    course_users.delete(course_user) if course_users.exists?(course_user.id)
  end
end
