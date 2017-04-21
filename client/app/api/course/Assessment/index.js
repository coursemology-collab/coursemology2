import AssessmentsAPI from './Assessments';
import SubmissionsAPI from './Submissions';

const AssessmentAPI = {
  surveys: new AssessmentsAPI(),
  submissions: new SubmissionsAPI(),
};

Object.freeze(AssessmentAPI);

export default AssessmentAPI;
