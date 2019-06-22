# frozen_string_literal: true
require 'csv'
require 'rubygems'
require 'nokogiri'
# require 'net/http'

namespace :coursemology do
  HOME_DIR= "#{Rails.public_path}/downloads/cs1010x"
  task :xcp, [:course_id] => :environment do |t, args|
    ActsAsTenant.current_tenant = Instance.default
    course = Course.find(args[:course_id])

    # Get all published missions, which happens to be first assessment_category
    # in current case
    published_missions = course.assessment_categories.first.assessments.
                           published.ordered_by_date_and_title

    export_missions_to_csv(published_missions)
    export_users_to_csv(course.course_users.order("course_users.id"))
    published_missions.each.with_index do |mission, index|
      export_submissions_to_csv(mission, index)
    end
  end

  def export_missions_to_csv(missions)
    CSV.open(HOME_DIR + "/missions.csv", "wb") do |csv|
      csv << ["id", "title", "maximum_grade", "base_exp", "time_bonus_exp",
        "start_at", "end_at", "bonus_end_at"]
      missions.each do |mission|
        csv << [mission.id, mission.title, mission.maximum_grade,
          mission.base_exp, mission.time_bonus_exp, mission.start_at,
          mission.end_at, mission.bonus_end_at]
      end
    end
  end

  def export_users_to_csv(course_users)
    CSV.open(HOME_DIR + "/course_users.csv", "wb") do |csv|
      csv << ["id", "user_id", "role", "name", "phantom"]
      course_users.each do |user|
        csv << [user.id, user.user_id, user.role, user.name, user.phantom]
      end
    end
  end

  def export_submissions_to_csv(mission, index)
    CSV.open(HOME_DIR + "/#{index}_#{mission.title.gsub("/", "-")}.csv", "wb") do |csv|
      csv << ["id", "user_id", "course_user_id", "course_role", "phantom",
              "created_at", "submitted_at", "normalized_submission_time",
              "graded_at", "grade", "exp"]
      mission.submissions.order("course_assessment_submissions.creator_id").
        each do |submission|
        norm_submission_time = submission.submitted_at ?
          (submission.submitted_at - mission.start_at) / (mission.end_at - mission.start_at) :
          nil
        csv << [submission.id, submission.creator_id, submission.course_user.id,
                submission.course_user.role, submission.course_user.phantom,
                submission.created_at, submission.submitted_at,
                norm_submission_time, submission.graded_at, submission.grade,
                submission.points_awarded]
      end
    end
  end
end
