# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Course::VideoNotifier, type: :notifier do
  let!(:instance) { Instance.default }

  with_tenant(:instance) do
    describe '#video_attempted' do
      let(:course) { create(:course) }
      let!(:video) { create(:video, course: course) }
      let!(:user) { create(:course_user, course: course).user }

      subject { Course::VideoNotifier.video_attempted(user, video) }

      it 'sends a course notification' do
        expect { subject }.to change(course.notifications, :count).by(1)
      end
    end

    describe '#video_opening' do
      let(:course) { create(:course) }
      let!(:video) { create(:course_video, course: course) }
      let!(:user) { create(:course_user, course: course).user }
      let(:activity) { Activity.find_by(object: video, event: :opening, actor: user) }

      subject { Course::VideoNotifier.video_opening(user, video) }

      it 'sends a course notification' do
        expect { subject }.to change(course.notifications, :count).by(1)
      end

      it 'sends an email notification' do
        expect { subject }.to change { ActionMailer::Base.deliveries.count }.by(2)
      end

      it 'creates an activity' do
        subject
        expect(activity).not_to be_nil
      end
    end

    describe '#video_closing' do
      let!(:now) { Time.zone.now }
      let(:activity) { Activity.find_by(object: video, event: :closing, actor: user) }

      let(:course) { create(:course) }
      let!(:video) { create(:course_video, course: course, end_at: now) }
      let(:user) { create(:course_manager, course: course).user }
      let!(:submitted_student) { create(:course_student, course: course) }
      let!(:unsubmitted_student) { create(:course_student, course: course) }
      let!(:video_submission) do
        create(:video_submission, course: course, video: video, creator: submitted_student.user)
      end

      subject { Course::VideoNotifier.video_closing(user, video) }

      it 'sends a user notification' do
        expect { subject }.to change(UserNotification, :count).by(1)
      end

      it 'sends an email notification to students who have not attempted it' do
        expect { subject }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end

      it 'creates an activity' do
        subject
        expect(activity).not_to be_nil
      end
    end
  end
end
