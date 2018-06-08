# frozen_string_literal: true

# Preloads SkillBranches, Skills and calculates student mastery
class Course::SkillsMasteryPreloadService
  # Preloads skills and calculate course user's mastery of the skills in the course.
  #
  # @param [Course] course The course to find Skills for.
  # @param [CourseUser] course_user The course user to calculate Skill mastery for.
  def initialize(course, course_user)
    load_skills(course)
    calculate_skill_mastery(course, course_user)
  end

  # @return [Array<Course::Assessment::SkillBranch>] Array of skill branches sorted by title.
  def skill_branches
    @skill_branches ||= @skills_by_branch.keys.sort_by(&:title)
  end

  # Returns the skills which belong to a given skill branch.
  #
  # @param [Course::Assessment::SkillBranch] skill_branch The skill branch to get skills for
  # @return [Array<Course::Assessment::Skill>] Array of skills.
  def skills_in_branch(skill_branch)
    @skills_by_branch[skill_branch]
  end

  # Calculate the percentage of points in the skill which the course user has obtained.
  #
  # @param [Course::Assessment::Skill] skill The skill to calculate percentage mastery for.
  # @return [Integer] Percentage of skill mastered, rounded off
  def percentage_mastery(skill)
    (grade(skill) / skill.total_grade.to_f * 100).round
  end

  # Returns the total grade obtained for a given skill.
  #
  # @param [Course::Assessment::Skill] skill The skill to get the grade for.
  # @return [Float]
  def grade(skill)
    @grade_by_skill[skill]
  end

  private

  # @param [Course] course The course to find Skills for.
  def load_skills(course)
    @skills_by_branch = course.assessment_skills.includes(:questions, :skill_branch).
                        group_by(&:skill_branch).
                        transform_values { |skills| skills.sort_by(&:title) }
  end

  def calculate_skill_mastery(course, course_user)
    @grade_by_skill = Hash.new(0)
    submissions = Course::Assessment::Submission.by_user(course_user.user.id).
                  from_course(course).with_published_state
    answers = Course::Assessment::Answer.belonging_to_submissions(submissions).current_answers.
              includes(question: :skills)
    answers.each do |answer|
      answer.question.skills.each do |skill|
        @grade_by_skill[skill] += answer.grade
      end
    end
  end
end
