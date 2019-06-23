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

    # Please create "nsf.csv" and "xcp.csv" from CV1010X master google sheet first
    nsf = CSV.parse(File.read(HOME_DIR + "/nsf.csv"), :headers=>true).by_col[1]
    xcp = CSV.parse(File.read(HOME_DIR + "/xcp.csv"), :headers=>true).by_col[1]
    nsf_names, xcp_names, cm_names = [], [], []
    nsf.each do |nsf_name|
      nsf_names << (nsf_name.strip! || nsf_name).downcase.split(/[\s|,]/)
    end
    xcp.each do |xcp_name|
      xcp_names << (xcp_name.strip! || xcp_name).downcase.split(/[\s|,]/)
    end

    # Get all course users on coursemology for this course and match them with
    # CV1010X master google sheet
    CSV.open(HOME_DIR + "/course_users.csv", "wb") do |csv|
      csv << ["id", "user_id", "role", "phantom", "name", "type"]
      course_users.each do |user|
        cm_user_name = (user.name.strip! || user.name).downcase.split(/[\s|,]/)
        matched_users = []
        nsf_names.each do |nsf_name|
          matched_users << "NSF" if ((cm_user_name - nsf_name).empty? || (nsf_name - cm_user_name).empty?)
        end
        xcp_names.each do |xcp_name|
          matched_users << "XCP" if ((cm_user_name - xcp_name).empty? || (xcp_name - cm_user_name).empty?)
        end
        csv << [user.id, user.user_id, user.role, user.phantom,
          user.name.strip! || user.name, matched_users.join(",")]
      end
    end

    cm = CSV.parse(File.read(HOME_DIR + "/course_users.csv"), :headers=>true).by_col[4]
    cm.each do |cm_name|
      cm_names << (cm_name.strip! || cm_name).downcase.split(/[\s|,]/)
    end

    # See which NSF users are already matched with coursemology user
    CSV.open(HOME_DIR + "/nsf_users.csv", "wb") do |csv|
      csv << ["name", "matched"]
      nsf_names.each do |nsf_name|
        matched_users = []
        cm_names.each do |cm_name|
          matched_users << "NSF" if (cm_name - nsf_name).empty?
        end
        csv << [nsf_name.join(" "), matched_users.join(",")]
      end
    end

    # See which XCP users are already matched with coursemology user
    CSV.open(HOME_DIR + "/xcp_users.csv", "wb") do |csv|
      csv << ["name", "matched"]
      xcp_names.each do |xcp_name|
        matched_users = []
        cm_names.each do |cm_name|
          matched_users << "XCP" if (cm_name - xcp_name).empty?
        end
        csv << [xcp_name.join(" "), matched_users.join(",")]
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
