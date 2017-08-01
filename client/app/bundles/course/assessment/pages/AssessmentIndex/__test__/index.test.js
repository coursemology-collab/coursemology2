import React from 'react';
import ReactDOM from 'react-dom';
import { mount, ReactWrapper } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';
import CourseAPI from 'api/course';
import ProviderWrapper from 'lib/components/ProviderWrapper';
import storeCreator from 'course/assessment/store';
import AssessmentIndex from '../index';

// summernote does not work well with jsdom in tests, stub it to normal text field.
jest.mock('lib/components/redux-form/RichTextField', () => {
  const TextField = require.requireActual('lib/components/redux-form/TextField');
  return TextField;
});

const categoryId = 1;
const tabId = 1;
const assessment = {
  autograded: false,
  base_exp: 0,
  delayed_grade_publication: false,
  skippable: false,
  start_at: new Date('2016-12-31T16:00:00.000Z'),
  tabbed_view: false,
  time_bonus_exp: 0,
  title: 'Funky title',
};

describe('<AssessmentIndex />', () => {
  it('allows new assessments to be created', async () => {
    const spy = jest.spyOn(CourseAPI.assessment.assessments, 'create');
    const store = storeCreator({ assessments: {} });

    const indexPage = mount(
      <ProviderWrapper store={store}>
        <AssessmentIndex {...{ categoryId, tabId }} />
      </ProviderWrapper>
    );

    const newBtn = ReactDOM.findDOMNode(indexPage.find('button').node);
    ReactTestUtils.Simulate.touchTap(newBtn);
    const formDialog = indexPage.find('Dialog').first();
    expect(formDialog.props().open).toBe(true);
    const dialogInline = formDialog.find('RenderToLayer').first().node.layerElement;
    const form = new ReactWrapper(dialogInline, true).find('form');

    const titleInput = form.find('input[name="title"]');
    titleInput.simulate('change', { target: { value: assessment.title } });
    const startAtDateInput = form.find('input[name="start_at"]').first();
    startAtDateInput.simulate('change', { target: { value: assessment.start_at } });
    startAtDateInput.simulate('blur');
    const submitButton = indexPage.find('PopupDialog').node.submitButton;
    ReactTestUtils.Simulate.touchTap(ReactDOM.findDOMNode(submitButton));
    expect(spy).toHaveBeenCalledWith({ assessment, category: categoryId, tab: tabId });
  });
});
