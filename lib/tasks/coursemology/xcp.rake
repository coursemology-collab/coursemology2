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
    nsf = CSV.parse(File.read(HOME_DIR + "/nsf_score.csv"), :headers=>true)
    xcp = CSV.parse(File.read(HOME_DIR + "/xcp_score.csv"), :headers=>true)

    # Get all course users on coursemology for this course and match them with
    # CV1010X master google sheet
    CSV.open(HOME_DIR + "/course_users.csv", "wb") do |csv|
      csv << ["id", "user_id", "role", "phantom", "name", "type"]
      # Exclude course_user Jason Leong
      course_users.reject { |course_user| course_user.id == 29168 }.each do |user|
        cm_user_name = (user.name.strip! || user.name).downcase.split(/[\s|,]/)
        matched_users = []
        nsf.each do |nsf_student|
          nsf_name = (nsf_student["name"].strip! || nsf_student["name"]).downcase.split(/[\s|,]/)
          matched_users << "NSF" if ((cm_user_name - nsf_name).empty? || (nsf_name - cm_user_name).empty?)
        end
        xcp.each do |xcp_student|
          xcp_name = (xcp_student["name"].strip! || xcp_student["name"]).downcase.split(/[\s|,]/)
          matched_users << "XCP" if ((cm_user_name - xcp_name).empty? || (xcp_name - cm_user_name).empty?)
        end
        csv << [user.id, user.user_id, user.role, user.phantom,
          user.name.strip! || user.name, matched_users.join(",")]
      end
    end

    cm = CSV.parse(File.read(HOME_DIR + "/course_users.csv"), :headers=>true)

    # See which NSF users are already matched with coursemology user
    CSV.open(HOME_DIR + "/nsf_users.csv", "wb") do |csv|
      csv << ["matric", "name", "matched_uid", "midterm", "remidterm", "pe", "repe", "exam"]
      nsf.each do |nsf_student|
        matched_user_id = []
        nsf_name = (nsf_student["name"].strip! || nsf_student["name"]).downcase.split(/[\s|,]/)
        cm.each do |cm_student|
          cm_name = (cm_student["name"].strip! || cm_student["name"]).downcase.split(/[\s|,]/)
          matched_user_id << cm_student["user_id"] if (cm_name - nsf_name).empty?
        end
        csv << [nsf_student["matric"], nsf_name.join(" "), matched_user_id.join(","),
          nsf_student["midterm"], nsf_student["remidterm"], nsf_student["pe"],
          nsf_student["repe"], nsf_student["exam"]]
      end
    end

    # See which XCP users are already matched with coursemology user
    CSV.open(HOME_DIR + "/xcp_users.csv", "wb") do |csv|
      csv << ["matric", "name", "matched_uid", "midterm", "remidterm", "pe", "repe", "exam"]
      xcp.each do |xcp_student|
        matched_user_id = []
        xcp_name = (xcp_student["name"].strip! || xcp_student["name"]).downcase.split(/[\s|,]/)
        cm.each do |cm_student|
          cm_name = (cm_student["name"].strip! || cm_student["name"]).downcase.split(/[\s|,]/)
          matched_user_id << cm_student["user_id"] if (cm_name - xcp_name).empty?
        end
        csv << [xcp_student["matric"], xcp_name.join(" "), matched_user_id.join(","),
          xcp_student["midterm"], xcp_student["remidterm"], xcp_student["pe"],
          xcp_student["repe"], xcp_student["exam"]]
      end
    end
  end

  def export_submissions_to_csv(mission, index)
    # Get array of uid that belongs to nsf and xcp students
    nsf = CSV.parse(File.read(HOME_DIR + "/nsf_users.csv"), :headers=>true).by_col[2].each.map(&:to_i)
    xcp = CSV.parse(File.read(HOME_DIR + "/xcp_users.csv"), :headers=>true).by_col[2].each.map(&:to_i)

    CSV.open(HOME_DIR + "/#{index}_#{mission.title.gsub(/[\/\.]/, "-").gsub(" ", "_").gsub(":", "")}.csv", "wb") do |csv|
      csv << ["title", "index", "id", "user_id", "course_user_id",
              "course_role", "phantom",
              "created_at", "submitted_at", "normalized_submission_time",
              "graded_at", "grade", "normalized_grade", "exp", "creator_type"]
      mission.submissions.order("course_assessment_submissions.creator_id").
        each do |submission|
        norm_submission_time = submission.submitted_at ?
          (submission.submitted_at - mission.start_at) / (mission.end_at - mission.start_at) :
          nil
        creator_type =
          if nsf.include? (submission.creator_id)
            "NSF"
          elsif xcp.include? (submission.creator_id)
            "XCP"
          else
            nil
          end
        csv << [mission.title, index, submission.id, submission.creator_id, submission.course_user.id,
                submission.course_user.role, submission.course_user.phantom,
                submission.created_at, submission.submitted_at,
                norm_submission_time, submission.graded_at, submission.grade,
                (submission.grade / mission.maximum_grade),
                submission.points_awarded, creator_type]
      end
    end
  end
end
