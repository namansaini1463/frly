import React from 'react';

const Features = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">Features</h1>
      <p className="text-sm text-gray-600 mb-6 max-w-2xl">
        FRYLY helps small groups stay organised with shared spaces for everything you track together: notes, checklists, files, reminders, and expenses.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-700">
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <h2 className="font-semibold mb-1">Sections per group</h2>
          <p>Create as many sections as you need for each group: notes, lists, galleries, reminders, folders and payments.</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <h2 className="font-semibold mb-1">Clean shared workspace</h2>
          <p>Jump straight from the groups list into a focused workspace, or use the overview grid to see everything at a glance.</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <h2 className="font-semibold mb-1">Checklists & reminders</h2>
          <p>Keep track of tasks with lightweight lists and time-based reminders that can also email you when something is due.</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <h2 className="font-semibold mb-1">Shared expenses</h2>
          <p>Record what people paid, split costs fairly, and see clear balances for every member in the group.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
