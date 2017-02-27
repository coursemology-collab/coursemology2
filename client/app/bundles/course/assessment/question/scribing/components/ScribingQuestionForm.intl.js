import { defineMessages } from 'react-intl';

export default defineMessages({
  titleFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.titleFieldLabel',
    defaultMessage: 'Title',
    description: 'Label for the title input field.',
  },
  descriptionFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.descriptionFieldLabel',
    defaultMessage: 'Description',
    description: 'Label for the description input field.',
  },
  staffOnlyCommentsFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.staffOnlyCommentsFieldLabel',
    defaultMessage: 'Staff only comments',
    description: 'Label for the staff only comments input field.',
  },
  maximumGradeFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.maximumGradeFieldLabel',
    defaultMessage: 'Maximum Grade',
    description: 'Label for the maximum grade input field.',
  },
  skillsFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.skillsFieldLabel',
    defaultMessage: 'Skills',
    description: 'Label for the skills input field.',
  },
  attemptLimitFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.attemptLimitFieldLabel',
    defaultMessage: 'Attempt Limit',
    description: 'Label for the attempt limit input field.',
  },
  attemptLimitPlaceholderMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.attemptLimitPlaceholderMessage',
    defaultMessage: 'The maximum times that the students can test their answers (does not apply to staff)',
    description: 'Placeholder message for attempt limit input field.',
  },
  uploadedPackageLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.uploadedPackageLabel',
    defaultMessage: 'Uploaded package',
    description: 'Label for the existing uploaded zip package.',
  },
  downloadPackageLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.downloadPackageLabel',
    defaultMessage: 'Download package',
    description: 'Label for the downloading generated zip package.',
  },
  packageUpdatedBy: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.packageUpdatedBy',
    defaultMessage: 'Updated by: {name}',
    description: 'Shows the author who last modified the package through the online editor.',
  },
  packageUploadedBy: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.packageUploadedBy',
    defaultMessage: 'Uploaded by: {name}',
    description: 'Shows the author who last uploaded the zip package.',
  },
  newPackageButton: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.newPackageButton',
    defaultMessage: 'Choose new package',
    description: 'Button for uploading new zip package.',
  },
  noFileChosenMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.noFileChosenMessage',
    defaultMessage: 'No file chosen',
    description: 'Message to be displayed when no file is chosen for a file input.',
  },
  uploadPackageButton: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.uploadPackageButton',
    defaultMessage: 'Upload Package',
    description: 'Button for uploading package.',
  },
  submitButton: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.submitButton',
    defaultMessage: 'Submit',
    description: 'Button for submitting the form.',
  },
  submitFailureMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.submitFailureMessage',
    defaultMessage: 'An error occurred, please try again.',
  },
  loadingMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.loadingMessage',
    defaultMessage: 'Loading',
    description: 'Text to be displayed when waiting for server response after form submission.',
  },
  resolveErrorsMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.resolveErrorsMessage',
    defaultMessage: 'This form has errors, please resolve before submitting.',
  },
  cannotBeBlankValidationError: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.cannotBeBlankValidationError',
    defaultMessage: 'Cannot be blank.',
  },
  noPackageValidationError: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.noPackageValidationError',
    defaultMessage: 'Package file required.',
  },
  positiveNumberValidationError: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.positiveNumberValidationError',
    defaultMessage: 'Value must be positive.',
  },
  lessThanEqualZeroValidationError: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.lessThanEqualZeroValidationError',
    defaultMessage: 'Value must be greater than 0.',
  },
});
