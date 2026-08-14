import React from 'react';
import { Joyride, STATUS } from 'react-joyride';

// Onboarding tour: walks a new user through the app's main features.
// Each step points at a DOM element (by id) and shows a tooltip with an arrow.
// To add/remove a step, just edit the steps array below.

const steps = [
  {
    target: '#project-name-input',
    title: 'Create a project',
    content: 'Type a project name, then press the + button. It gets its own color automatically.',
    placement: 'right',
  },
  {
    target: '#tag-name-input',
    title: 'Organize with tags',
    content: 'Add tags like "urgent" or "home" to group tasks across projects.',
    placement: 'right',
  },
  {
    target: '#task-title-input',
    title: 'Add a task',
    content: 'Write the task title. You can add a longer description below it.',
    placement: 'bottom',
  },
  {
    target: '#task-options',
    title: 'Set task details',
    content: 'Choose a priority, link it to a project, and set a due date.',
    placement: 'bottom',
  },
  {
    target: '#add-task-btn',
    title: 'Save your task',
    content: 'Click "Add task" to save it. It appears in the list below.',
    placement: 'bottom',
  },
  {
    target: '#filter-bar',
    title: 'Filter and sort',
    content: 'Narrow tasks by priority or status, and change the sort order.',
    placement: 'bottom',
  },
];

export default function Onboarding({ run, onFinish }) {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: '#2563eb',
          zIndex: 1000,
        },
      }}
      callback={(data) => {
        const { status } = data;
        // Stop the tour when it's finished or skipped, so it doesn't
        // restart on every React re-render.
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
          onFinish();
        }
      }}
    />
  );
}