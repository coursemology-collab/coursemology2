import AchievementsAPI from './Achievements';
import AssessmentAPI from './Assessment';
import VirtualClassroomsAPI from './VirtualClassrooms';
import MaterialsAPI from './Materials';
import MaterialFoldersAPI from './MaterialFolders';
import LessonPlanAPI from './LessonPlan';
import SurveyAPI from './Survey';

const CourseAPI = {
  achievements: new AchievementsAPI(),
  assessment: AssessmentAPI,
  virtualClassrooms: new VirtualClassroomsAPI(),
  materials: new MaterialsAPI(),
  materialFolders: new MaterialFoldersAPI(),
  lessonPlan: new LessonPlanAPI(),
  survey: SurveyAPI,
};

Object.freeze(CourseAPI);

export default CourseAPI;
